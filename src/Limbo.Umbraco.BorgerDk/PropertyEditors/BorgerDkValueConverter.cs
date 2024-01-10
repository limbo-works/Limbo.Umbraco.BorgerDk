using System;
using Limbo.Integrations.BorgerDk;
using Limbo.Umbraco.BorgerDk.Caching;
using Limbo.Umbraco.BorgerDk.Models.Published;
using Newtonsoft.Json.Linq;
using Skybrud.Essentials.Json.Newtonsoft;
using Skybrud.Essentials.Json.Newtonsoft.Extensions;
using Umbraco.Cms.Core.Models.PublishedContent;
using Umbraco.Cms.Core.PropertyEditors;
using Umbraco.Extensions;

#pragma warning disable 1591

namespace Limbo.Umbraco.BorgerDk.PropertyEditors {

    public class BorgerDkValueConverter : PropertyValueConverterBase {

        private readonly BorgerDkCache _borgerDkCache;

        public BorgerDkValueConverter(BorgerDkCache borgerDkCache) {
            _borgerDkCache = borgerDkCache;
        }

        /// <summary>
        /// Gets a value indicating whether the converter supports a property type.
        /// </summary>
        /// <param name="propertyType">The property type.</param>
        /// <returns>A value indicating whether the converter supports a property type.</returns>
        public override bool IsConverter(IPublishedPropertyType propertyType) {
            return propertyType.EditorAlias == BorgerDkPropertyEditor.EditorAlias;
        }

        public override object? ConvertSourceToIntermediate(IPublishedElement owner, IPublishedPropertyType propertyType, object? source, bool preview) {

            // Return null right away if "source" isn't a valid JSON string
            if (source is not string str || !str.DetectIsJson()) return null;

            // Parse the JSON
            return JsonUtils.ParseJsonObject(str);

        }

        public override object? ConvertIntermediateToObject(IPublishedElement owner, IPublishedPropertyType propertyType, PropertyCacheLevel referenceCacheLevel, object? inter, bool preview) {

            if (inter is not JObject json) return null;

            // Parse the individual identifiers of the article
            string domain = json.GetString("domain")!;
            int municipality = json.GetInt32("municipality");
            int articleId = json.GetInt32("id");

            // Try to get the article from the cache
            BorgerDkArticle? article = _borgerDkCache.GetArticleById(domain, municipality, articleId);

            // TODO: Should we still return a value here if the selected article isn't found in the cache?
            if (article == null) return null;

            return new BorgerDkPublishedArticle(json, article);

        }

        /// <remarks>
        /// The cache level is set to <see cref="PropertyCacheLevel.Snapshot"/>, which would normally indicate that the
        /// value is cached per request. Ideally we want to cache the value harder, but in this case, the value is
        /// pulled from an underlying cache, so the result is that article is cached beyond each request regardless of
        /// the <see cref="PropertyCacheLevel.Snapshot"/>.
        /// </remarks>
        public override PropertyCacheLevel GetPropertyCacheLevel(IPublishedPropertyType propertyType) {
            return PropertyCacheLevel.Snapshot;
        }

        /// <summary>
        /// Gets the type of values returned by the converter.
        /// </summary>
        /// <param name="propertyType">The property type.</param>
        /// <returns>The CLR type of values returned by the converter.</returns>
        public override Type GetPropertyValueType(IPublishedPropertyType propertyType) {
            return typeof(BorgerDkPublishedArticle);
        }

    }

}