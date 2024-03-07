using Newtonsoft.Json;

namespace Limbo.Umbraco.BorgerDk.Models.Published;

/// <summary>
/// Base class representing an element of a <see cref="BorgerDkPublishedArticle"/>.
/// </summary>
public class BorgerDkPublishedElement {

    /// <summary>
    /// Gets the ID of the element.
    /// </summary>
    [JsonProperty("id", Order = -99)]
    public string Id { get; protected set; }

    /// <summary>
    /// Gets the title of the element.
    /// </summary>
    [JsonProperty("title", Order = -98)]
    public string Title { get; protected set; }

    /// <summary>
    /// Initializes a new instance based on the specified <paramref name="id"/> and <paramref name="title"/>.
    /// </summary>
    /// <param name="id">The ID of the element.</param>
    /// <param name="title">The title of the element.</param>
    protected BorgerDkPublishedElement(string id, string title) {
        Id = id;
        Title = title;
    }

}