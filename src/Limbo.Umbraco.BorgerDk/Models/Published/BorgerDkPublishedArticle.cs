using System.Collections.Generic;
using Limbo.Integrations.BorgerDk;
using Newtonsoft.Json;
using Umbraco.Cms.Core.Models.PublishedContent;

namespace Limbo.Umbraco.BorgerDk.Models.Published {

    /// <summary>
    /// Class representing a published Borger.dk - aka an article selected on an <see cref="IPublishedElement"/>.
    /// </summary>
    public class BorgerDkPublishedArticle {

        #region Properties

        /// <summary>
        /// Gets a reference to the article as received from the Borger.dk web service.
        /// </summary>
        [JsonIgnore]
        public BorgerDkArticle Article { get; }

        /// <summary>
        /// Gets the numeric ID of the article.
        /// </summary>
        [JsonProperty("id")]
        public int Id => Article.Id;

        /// <summary>
        /// Gets the URL of the article.
        /// </summary>
        [JsonProperty("url")]
        public string Url => Article.Url;

        /// <summary>
        /// Gets the title of the article.
        /// </summary>
        [JsonProperty("title")]
        public string Title => Article.Title;

        /// <summary>
        /// Gets the header of the article.
        /// </summary>
        [JsonProperty("header")]
        public string Header => Article.Header;

        /// <summary>
        /// Gets the by line of the article.
        /// </summary>
        [JsonProperty("byline")]
        public string ByLine => Article.ByLine;

        /// <summary>
        /// Gets an array with the IDs for the selected article lements.
        /// </summary>
        [JsonIgnore]
        public IReadOnlyList<string> Selection { get; }

        /// <summary>
        /// Gets a reference to the selected article elements.
        /// </summary>
        [JsonProperty("elements")]
        public IReadOnlyList<BorgerDkPublishedElement> Elements { get; }

        #endregion

        #region Constructors

        /// <summary>
        /// Initializes a new instance based on the specified <paramref name="article"/>, <paramref name="selection"/> and <paramref name="elements"/>.
        /// </summary>
        /// <param name="article">The Borger.dk article the instance should be based on.</param>
        /// <param name="selection">A list with the IDs of the selected elements.</param>
        /// <param name="elements">A list of the elements that should make up this instance..</param>
        public BorgerDkPublishedArticle(BorgerDkArticle article, IReadOnlyList<string> selection, IReadOnlyList<BorgerDkPublishedElement> elements) {
            Article = article;
            Selection = selection;
            Elements = elements;
        }

        #endregion

    }

}