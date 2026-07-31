using System.Threading;
using System.Threading.Tasks;
using Limbo.Umbraco.BorgerDk.Migrations;
using Umbraco.Cms.Core;
using Umbraco.Cms.Core.Events;
using Umbraco.Cms.Core.Migrations;
using Umbraco.Cms.Core.Notifications;
using Umbraco.Cms.Core.Services;
using Umbraco.Cms.Infrastructure.Migrations;
using Umbraco.Cms.Infrastructure.Migrations.Upgrade;
using Umbraco.Cms.Infrastructure.Scoping;

#pragma warning disable 1591

namespace Limbo.Umbraco.BorgerDk.NotificationHandlers;

/// <remarks>
/// <c>Upgrader.Execute</c> is obsolete as of Umbraco 17 and scheduled for removal in Umbraco 18, so the handler is
/// now an <see cref="INotificationAsyncHandler{TNotification}"/> awaiting <c>ExecuteAsync</c> instead.
/// </remarks>
public class BorgerDkMigrationHandler : INotificationAsyncHandler<UmbracoApplicationStartingNotification> {

    private readonly IScopeProvider _scopeProvider;
    private readonly IMigrationPlanExecutor _migrationPlanExecutor;
    private readonly IKeyValueService _keyValueService;
    private readonly IRuntimeState _runtimeState;

    public BorgerDkMigrationHandler(IScopeProvider scopeProvider,
        IMigrationPlanExecutor migrationPlanExecutor,
        IKeyValueService keyValueService,
        IRuntimeState runtimeState) {
        _scopeProvider = scopeProvider;
        _migrationPlanExecutor = migrationPlanExecutor;
        _keyValueService = keyValueService;
        _runtimeState = runtimeState;
    }

    public async Task HandleAsync(UmbracoApplicationStartingNotification notification, CancellationToken cancellationToken) {

        if (_runtimeState.Level < RuntimeLevel.Run) return;

        MigrationPlan plan = new(BorgerDkPackage.Alias);

        plan.From(string.Empty).To<BorgerDkCreateTableMigration>("10.0.0");

        Upgrader upgrader = new(plan);
        await upgrader.ExecuteAsync(_migrationPlanExecutor, _scopeProvider, _keyValueService);

    }

}
