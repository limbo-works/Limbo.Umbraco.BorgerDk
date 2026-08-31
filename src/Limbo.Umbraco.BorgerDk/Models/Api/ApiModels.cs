using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

#pragma warning disable 1591

namespace Limbo.Umbraco.BorgerDk.Models.Api;

/// <summary>
/// API model describing one of the Borger.dk web service endpoints.
/// </summary>
public class BorgerDkEndpointModel {

    [JsonPropertyName("domain")]
    public required string Domain { get; init; }

    [JsonPropertyName("name")]
    public required string Name { get; init; }

}

/// <summary>
/// API model describing a Borger.dk article as it appears in the article list.
/// </summary>
public class BorgerDkArticleListItemModel {

    [JsonPropertyName("id")]
    public required int Id { get; init; }

    [JsonPropertyName("url")]
    public required string Url { get; init; }

    [JsonPropertyName("title")]
    public required string Title { get; init; }

    [JsonPropertyName("publishDate")]
    public required long PublishDate { get; init; }

    [JsonPropertyName("updateDate")]
    public required long UpdateDate { get; init; }

}

/// <summary>
/// API model describing a micro article of a <see cref="BorgerDkElementModel"/>.
/// </summary>
public class BorgerDkMicroArticleModel {

    [JsonPropertyName("id")]
    public required string Id { get; init; }

    [JsonPropertyName("title")]
    public required string Title { get; init; }

    [JsonPropertyName("content")]
    public required string Content { get; init; }

}

/// <summary>
/// API model describing an element of a <see cref="BorgerDkArticleModel"/>. An element is either a text element
/// (<see cref="Content"/> is set) or a block of micro articles (<see cref="MicroArticles"/> is set).
/// </summary>
public class BorgerDkElementModel {

    [JsonPropertyName("id")]
    public required string Id { get; init; }

    [JsonPropertyName("title")]
    public required string Title { get; init; }

    [JsonPropertyName("content")]
    public string? Content { get; init; }

    [JsonPropertyName("microArticles")]
    public IReadOnlyList<BorgerDkMicroArticleModel>? MicroArticles { get; init; }

}

/// <summary>
/// API model describing a full Borger.dk article, including the elements the editor may select from.
/// </summary>
public class BorgerDkArticleModel {

    [JsonPropertyName("id")]
    public required int Id { get; init; }

    [JsonPropertyName("url")]
    public required string Url { get; init; }

    [JsonPropertyName("domain")]
    public required string Domain { get; init; }

    [JsonPropertyName("municipality")]
    public required int Municipality { get; init; }

    [JsonPropertyName("title")]
    public required string Title { get; init; }

    [JsonPropertyName("header")]
    public required string Header { get; init; }

    [JsonPropertyName("byline")]
    public string? ByLine { get; init; }

    [JsonPropertyName("publishDate")]
    public required long PublishDate { get; init; }

    [JsonPropertyName("updateDate")]
    public required long UpdateDate { get; init; }

    [JsonPropertyName("elements")]
    public required IReadOnlyList<BorgerDkElementModel> Elements { get; init; }

}

/// <summary>
/// API model describing the current server role and the settings of the scheduled import task.
/// </summary>
public class BorgerDkSettingsModel {

    [JsonPropertyName("serverRole")]
    public required string ServerRole { get; init; }

    [JsonPropertyName("state")]
    public required string State { get; init; }

    [JsonPropertyName("importInterval")]
    public required TimeSpan ImportInterval { get; init; }

    [JsonPropertyName("logResults")]
    public required bool LogResults { get; init; }

}
