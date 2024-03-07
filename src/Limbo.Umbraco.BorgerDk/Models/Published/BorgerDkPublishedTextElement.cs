using System.Text.RegularExpressions;
using Limbo.Integrations.BorgerDk;
using Limbo.Integrations.BorgerDk.Elements;
using Newtonsoft.Json;

namespace Limbo.Umbraco.BorgerDk.Models.Published;

/// <summary>
/// Class representing a text based element of a <see cref="BorgerDkPublishedArticle"/>.
/// </summary>
public class BorgerDkPublishedTextElement : BorgerDkPublishedElement {

    /// <summary>
    /// Gets the HTML content of the micro article.
    /// </summary>
    [JsonProperty("content")]
    public string Content { get; }

    /// <summary>
    /// Initializes a new published text element based on the specified <paramref name="element"/>.
    /// </summary>
    /// <param name="element">The element as received from an instance of <see cref="BorgerDkArticle"/>.</param>
    public BorgerDkPublishedTextElement(BorgerDkTextElement element) : base(element.Id, element.Title) {
        Content = Regex.Replace(element.Content, "^<h3>(.+?)</h3>", string.Empty);
    }

}