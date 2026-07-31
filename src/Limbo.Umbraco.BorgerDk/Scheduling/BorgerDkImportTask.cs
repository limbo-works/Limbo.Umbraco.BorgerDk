using System;
using System.Globalization;
using System.Threading.Tasks;
using Limbo.Umbraco.BorgerDk.Models.Import;
using Microsoft.Extensions.Logging;
using Umbraco.Cms.Core;
using Umbraco.Cms.Core.Services;
using Umbraco.Cms.Core.Sync;
using Umbraco.Cms.Infrastructure.HostedServices;

#pragma warning disable 1591

namespace Limbo.Umbraco.BorgerDk.Scheduling;

/// <summary>
/// Recurring task responsible for keeping the locally stored Borger.dk articles up to date.
/// </summary>
/// <remarks>
/// Up until Umbraco 13, the "last run" bookkeeping was handled by <c>TaskHelper</c> from
/// <c>Skybrud.Essentials.Umbraco</c>, which wrote a timestamp and a log to disk. That helper is not part of the
/// Umbraco 17 version of the package, so the task now persists its last run through
/// <see cref="IKeyValueService"/> - which also means the timestamp is shared across a load balanced setup - and
/// writes to <see cref="ILogger"/> rather than to its own log file.
/// </remarks>
public class BorgerDkImportTask : RecurringHostedServiceBase {

    /// <summary>
    /// Gets the key used for storing the time of the last run in the Umbraco key/value store.
    /// </summary>
    internal const string LastRunKey = $"{BorgerDkPackage.Alias}.ImportTask.LastRun";

    private readonly ILogger<BorgerDkImportTask> _logger;
    private readonly BorgerDkService _borgerDkService;
    private readonly BorgerDkImportTaskSettings _importSettings;
    private readonly IRuntimeState _runtimeState;
    private readonly IServerRoleAccessor _serverRoleAccessor;
    private readonly IKeyValueService _keyValueService;

    private static TimeSpan HowOftenWeRepeat => TimeSpan.FromMinutes(5);

    private static TimeSpan DelayBeforeWeStart => TimeSpan.FromMinutes(5);

    public BorgerDkImportTask(ILogger<BorgerDkImportTask> logger,
        BorgerDkService borgerDkService,
        BorgerDkImportTaskSettings importSettings,
        IRuntimeState runtimeState,
        IServerRoleAccessor serverRoleAccessor,
        IKeyValueService keyValueService) : base(logger, HowOftenWeRepeat, DelayBeforeWeStart) {
        _logger = logger;
        _borgerDkService = borgerDkService;
        _importSettings = importSettings;
        _runtimeState = runtimeState;
        _serverRoleAccessor = serverRoleAccessor;
        _keyValueService = keyValueService;
    }

    public override Task PerformExecuteAsync(object? state) {

        // Don't do anything if the site is not running.
        if (_runtimeState.Level != RuntimeLevel.Run) return Task.CompletedTask;

        switch (_importSettings.State) {

            // If the job is disabled, we return right away
            case BorgerDkImportTaskState.Disabled:
                return Task.CompletedTask;

            // If the state is set to "Auto", we check the current role of the server
            case BorgerDkImportTaskState.Auto: {
                ServerRole role = _serverRoleAccessor.CurrentServerRole;
                if (role is ServerRole.Subscriber or ServerRole.Unknown) return Task.CompletedTask;
                break;
            }

        }

        if (!ShouldRun()) {
            _logger.LogDebug("Exiting as the Borger.dk import isn't supposed to run yet.");
            return Task.CompletedTask;
        }

        // Run a new import
        ImportJob result = _borgerDkService.Import();

        // Save the result to the disk
        if (_importSettings.LogResults) _borgerDkService.WriteToLog(result);

        // Make sure we save that the job has run
        _keyValueService.SetValue(LastRunKey, DateTime.UtcNow.ToString("O", CultureInfo.InvariantCulture));

        _logger.LogInformation("Borger.dk import finished with status {Status}.", result.Status);

        return Task.CompletedTask;

    }

    /// <summary>
    /// Returns whether at least <see cref="BorgerDkImportTaskSettings.ImportInterval"/> has passed since the last
    /// time the import ran.
    /// </summary>
    private bool ShouldRun() {

        string? value = _keyValueService.GetValue(LastRunKey);

        // The task has never run before
        if (string.IsNullOrWhiteSpace(value)) return true;

        // If we can't make sense of the stored value, we let the task run again. The timestamp is written with the
        // round-trip ("O") format, so it must be read back with the invariant culture as well - parsing it with the
        // current culture can yield a wrong date on a server running a non-Gregorian calendar.
        // [CHANGE: culture-sensitive parsing of an invariant round-trip timestamp] Related: BorgerDkHtmlSanitizer.cs,
        // PropertyEditors/BorgerDkValueConverter.cs, Client/src/modals/article-modal.element.ts,
        // Client/src/modals/search-modal.element.ts
        if (!DateTime.TryParseExact(value, "O", CultureInfo.InvariantCulture, DateTimeStyles.RoundtripKind, out DateTime lastRun)) {
            _logger.LogWarning("Unable to parse the last run time of the Borger.dk import task: {Value}", value);
            return true;
        }

        return DateTime.UtcNow - lastRun.ToUniversalTime() >= _importSettings.ImportInterval;

    }

}
