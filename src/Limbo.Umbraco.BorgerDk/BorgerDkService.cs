﻿using System;
using System.Collections.Generic;
using System.Linq;
using Limbo.Integrations.BorgerDk;
using Limbo.Umbraco.BorgerDk.Models;
using Limbo.Umbraco.BorgerDk.Notifications;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Logging;
using NPoco;
using Skybrud.Essentials.Collections.Extensions;
using Umbraco.Cms.Core.Events;
using Umbraco.Cms.Infrastructure.Persistence;
using Umbraco.Cms.Infrastructure.Scoping;
using Umbraco.Extensions;

namespace Limbo.Umbraco.BorgerDk {

    /// <summary>
    /// Service layer for working with Borger.dk
    /// </summary>
    public partial class BorgerDkService {

        private readonly IScopeProvider _scopeProvider;
        private readonly ILogger<BorgerDkService> _logger;
        private readonly IWebHostEnvironment _webHostEnvironment;
        private readonly IEventAggregator _eventAggregator;

        #region Constructors

        /// <summary>
        /// Initializes a new instance based on the specified DI dependencies.
        /// </summary>
        public BorgerDkService(IScopeProvider scopeProvider, ILogger<BorgerDkService> logger, IWebHostEnvironment webHostEnvironment, IEventAggregator eventAggregator) {
            _scopeProvider = scopeProvider;
            _logger = logger;
            _webHostEnvironment = webHostEnvironment;
            _eventAggregator = eventAggregator;
        }

        #endregion

        private BorgerDkArticleDto? GetArticleDtoById(string domain, int municipality, int articleId) {

            string id = BorgerDkUtils.GetUniqueId(domain, municipality, articleId);

            using IScope scope = _scopeProvider.CreateScope(autoComplete: true);

            try {

                // Generate the SQL for the query
                Sql<ISqlContext> sql = scope.SqlContext.Sql()
                    .Select<BorgerDkArticleDto>()
                    .From<BorgerDkArticleDto>()
                    .Where<BorgerDkArticleDto>(x => x.Id == id);

                // Make the call to the database
                return scope.Database.FirstOrDefault<BorgerDkArticleDto>(sql);

            } catch (Exception ex) {
                _logger.LogError(ex, "Unable to insert redirect into the database");
                throw new Exception("Unable to insert redirect into the database", ex);
            }

        }

        /// <summary>
        /// Returns the article matching the specified <paramref name="domain"/>, <paramref name="municipality"/> and <paramref name="articleId"/>.
        /// </summary>
        /// <param name="domain">The domain of the article.</param>
        /// <param name="municipality">The municipality of the article.</param>
        /// <param name="articleId">The ID of the article.</param>
        /// <returns>An instance of <see cref="BorgerDkArticle"/>, or <c>null</c> if not found.</returns>
        public BorgerDkArticle? GetArticleById(string domain, int municipality, int articleId) {
            return GetArticleDtoById(domain, municipality, articleId)?.Meta;
        }

        /// <summary>
        /// Imports the specified <paramref name="article"/> into the database.
        /// </summary>
        /// <param name="article">The article to be imported.</param>
        public void Import(BorgerDkArticle article) {

            // Get the article DTO (if it already exists in the db)
            BorgerDkArticleDto? dto = GetArticleDtoById(article.Domain, article.Municipality.Code, article.Id);

            using (IScope scope = _scopeProvider.CreateScope(autoComplete: true)) {

                if (dto == null) {
                    dto = new BorgerDkArticleDto(article);
                    scope.Database.Insert(dto);
                } else {
                    dto.Meta = article;
                    dto.UpdateDate = DateTime.UtcNow;
                    scope.Database.Update(dto);
                }

            }

            // Broadcast that the article has been updated
            _eventAggregator.Publish(new BorgerDkArticleUpdatedNotification(article));

        }

        /// <summary>
        /// Returns an array of all articles currently stored in the local database.
        /// </summary>
        /// <returns>An array of <see cref="BorgerDkArticle"/>.</returns>
        public IReadOnlyList<BorgerDkArticle> GetAllArticles() {
            return GetAllArticlesDtos().Where(x => x.Meta is not null).SelectList(x => x.Meta!);
        }

        private IReadOnlyList<BorgerDkArticleDto> GetAllArticlesDtos() {

            using IScope scope = _scopeProvider.CreateScope(autoComplete: true);

            try {

                // Generate the SQL for the query
                Sql<ISqlContext> sql = scope.SqlContext.Sql()
                    .Select<BorgerDkArticleDto>()
                    .From<BorgerDkArticleDto>();

                // Make the call to the database
                return scope.Database.Fetch<BorgerDkArticleDto>(sql);

            } catch (Exception ex) {
                _logger.LogError(ex, "Unable to fetch all articles from the database.");
                throw new Exception("Unable to fetch all articles from the database.", ex);
            }

        }

    }

}