using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using Limbo.Umbraco.BorgerDk.Models.Import;

#pragma warning disable 1591

namespace Limbo.Umbraco.BorgerDk.Models.Api;

/// <summary>
/// API model describing an exception of an <see cref="ImportTaskModel"/>.
/// </summary>
public class ImportExceptionModel {

    [JsonPropertyName("type")]
    public required string Type { get; init; }

    [JsonPropertyName("message")]
    public required string Message { get; init; }

    [JsonPropertyName("stackTrace")]
    public string? StackTrace { get; init; }

}

/// <summary>
/// API model describing an <see cref="ImportTask"/> or <see cref="ImportJob"/>.
/// </summary>
/// <remarks>
/// <see cref="ImportTask"/> is serialized with Newtonsoft.Json when written to the log on disk, whereas the
/// Management API uses <c>System.Text.Json</c>. Rather than annotating the domain model for both serializers - and
/// exposing a raw <see cref="Exception"/> over the API - the tasks are projected into this model.
/// </remarks>
public class ImportTaskModel {

    [JsonPropertyName("type")]
    public required string Type { get; init; }

    [JsonPropertyName("name")]
    public string? Name { get; init; }

    /// <summary>
    /// Gets the duration of the task in seconds, or <c>null</c> if the task hasn't finished.
    /// </summary>
    [JsonPropertyName("duration")]
    public double? Duration { get; init; }

    [JsonPropertyName("message")]
    public string? Message { get; init; }

    [JsonPropertyName("status")]
    public required string Status { get; init; }

    [JsonPropertyName("action")]
    public required string Action { get; init; }

    [JsonPropertyName("exception")]
    public ImportExceptionModel? Exception { get; init; }

    [JsonPropertyName("items")]
    public required IReadOnlyList<ImportTaskModel> Items { get; init; }

    /// <summary>
    /// Returns a new <see cref="ImportTaskModel"/> based on the specified <paramref name="task"/>.
    /// </summary>
    /// <param name="task">The task to be converted.</param>
    /// <returns>An instance of <see cref="ImportTaskModel"/>.</returns>
    public static ImportTaskModel Create(ImportTask task) {
        return new ImportTaskModel {
            Type = task is ImportJob ? "Job" : "Task",
            Name = task.Name,
            Duration = task.Duration?.TotalSeconds,
            Message = task.Message,
            Status = task.Status.ToString(),
            Action = task.Action.ToString(),
            Exception = task.Exception is null ? null : new ImportExceptionModel {
                Type = task.Exception.GetType().FullName ?? task.Exception.GetType().Name,
                Message = task.Exception.Message,
                StackTrace = task.Exception.StackTrace
            },
            Items = task.Items.Select(Create).ToList()
        };
    }

}
