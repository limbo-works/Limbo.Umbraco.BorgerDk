﻿using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.IO;
using System.Text;
using Limbo.Umbraco.BorgerDk.Models;
using Limbo.Umbraco.BorgerDk.Models.Import;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Skybrud.Essentials.Strings;
using Skybrud.Essentials.Strings.Extensions;
using Skybrud.Integrations.BorgerDk;
using Umbraco.Cms.Core;
using Umbraco.Cms.Core.Extensions;

namespace Limbo.Umbraco.BorgerDk {

    public partial class BorgerDkService {

        /// <summary>
        /// Starts a new import from the Borger.dk web services. The method will pull an article list of each web
        /// service, and then only update the articles that are already in our local database, but has a newer version
        /// in the web service.
        /// </summary>
        /// <returns>An instance of <see cref="ImportJob"/> representing the result of the import.</returns>
        public ImportJob Import() {

            ImportJob job = new() { Name = "Importing articles from the Borger.dk web service" };

            job.Start();

            if (!FetchArticleList(job, out Dictionary<string, BorgerDkArticleDescription> fromApi)) return job;
            if (!FetchArticlesFromDatabase(job, out IReadOnlyList<BorgerDkArticleDto>? fromDb)) return job;

            SynchronizeArticles(job, fromApi, fromDb);

            if (job.Status == ImportStatus.Pending) {
                job.Completed();
            }

            return job;

        }

        /// <summary>
        /// Writes the log of the specified <paramref name="job"/> to the disk.
        /// </summary>
        /// <param name="job">The job.</param>
        public void WriteToLog(ImportJob job) {

            string path = Path.Combine(Constants.SystemDirectories.LogFiles, BorgerDkPackage.Alias, $"{DateTime.UtcNow:yyyyMMddHHmmss}.txt");

            string fullPath = _webHostEnvironment.MapPathContentRoot(path);

            // ReSharper disable once AssignNullToNotNullAttribute
            Directory.CreateDirectory(Path.GetDirectoryName(fullPath)!);
            File.AppendAllText(fullPath, JsonConvert.SerializeObject(job), Encoding.UTF8);

        }

        private bool FetchArticleList(ImportJob job, out Dictionary<string, BorgerDkArticleDescription> articles) {

            ImportTask task = job.AddTask("Fetching article list from Borger.dk").Start();

            articles = new Dictionary<string, BorgerDkArticleDescription>();

            foreach (BorgerDkEndpoint endpoint in BorgerDkEndpoint.Values) {

                ImportTask endpointTask = task.AddTask($"Fetching articles from {endpoint.Domain}").Start();

                try {

                    // Initialize a new service instance for the endpoint
                    BorgerDkHttpService borgerdk = new(endpoint);

                    // Fetch the article list
                    IReadOnlyList<BorgerDkArticleDescription> list = borgerdk.GetArticleList();

                    // Add the articles to the dictionary
                    foreach (BorgerDkArticleDescription row in list) {
                        articles.Add(endpoint.Domain + "_" + row.Id, row);
                    }

                    endpointTask
                        .AppendToMessage($"Found {list.Count} articles")
                        .Completed();

                } catch (Exception ex) {

                    _logger.LogError(ex, "Failed fetching articles for endpoint {Endpoint}.", endpoint.Domain);

                    endpointTask.Failed(ex);

                    break;

                }

            }

            if (task.Status != ImportStatus.Failed) task.Completed();

            return task.Status != ImportStatus.Failed;

        }

        private bool FetchArticlesFromDatabase(ImportJob job, [NotNullWhen(true)] out IReadOnlyList<BorgerDkArticleDto>? result) {

            ImportTask task = job.AddTask("Fetching existing articles from the database").Start();

            result = null;

            try {

                result = GetAllArticlesDtos();

                task.AppendToMessage($"Found {result.Count} {StringUtils.ToPlural("article", result.Count)}").Completed();

                return true;

            } catch (Exception ex) {

                _logger.LogError(ex, "Failed fetching existing articles for the database.");

                task.Failed(ex);

                return false;

            }

        }

        private void SynchronizeArticles(ImportJob job, Dictionary<string, BorgerDkArticleDescription> fromApi, IReadOnlyList<BorgerDkArticleDto> fromDb) {

            ImportTask task = job.AddTask("Synchronizing articles").Start();

            int updated = 0;
            int skipped = 0;

            foreach (BorgerDkArticleDto dto in fromDb) {

                ImportTask articleTask = task.AddTask($"Synchronizing article with unique ID {dto.Id}.").Start();

                try {

                    if (fromApi.TryGetValue(dto.Domain + "_" + dto.ArticleId, out var value)) {

                        if (value.UpdateDate > dto.UpdateDate) {

                            ImportTask fetchTask = articleTask.AddTask("Fetching article content from web service").Start();

                            BorgerDkArticle article;

                            try {

                                // Get the endpoint from the domain
                                BorgerDkEndpoint endpoint = BorgerDkEndpoint.GetFromDomain(dto.Domain);

                                // Initialize a new service instance from the endpoint
                                BorgerDkHttpService service = new(endpoint);

                                // Get the municipality from the code
                                BorgerDkMunicipality municipality = BorgerDkMunicipality.GetFromCode(dto.Municipality);

                                // Fetch the article from the web service
                                article = service.GetArticleFromId(dto.ArticleId, municipality);

                                // Update the task status
                                fetchTask.Completed();

                            } catch (Exception ex) {

                                fetchTask.Failed(ex);

                                articleTask.Stop();

                                continue;

                            }

                            try {

                                Import(article);

                                articleTask.Completed(ImportAction.Updated);

                                updated++;

                            } catch (Exception ex) {

                                articleTask.Failed(ex);

                            }

                        } else {

                            articleTask
                                .AppendToMessage("No changes found ... skipping article.")
                                .Completed(ImportAction.NotModified);

                            skipped++;

                        }

                    } else {

                        articleTask
                            .AppendToMessage("Article no longer exists in web service ... ignoring for now.")
                            .Completed(ImportAction.Deleted);

                        skipped++;

                    }

                } catch (Exception ex) {

                    //_logger.Error<BorgerDkService>(ex, "Failed fetching articles for endpoint {Endpoint}.", endpoint.Domain);

                    articleTask.Failed(ex);

                    break;

                }

            }

            // Update the task
            if (task.Status == ImportStatus.Failed) {
                task.Stop();
                return;
            }

            List<string> message = new() {
                $"updated {updated} {StringUtils.ToPlural("article", updated)}",
                $"skipped {skipped} {StringUtils.ToPlural("article", skipped)}"
            };


            task
                .AppendToMessage(string.Join(" and ", message).FirstCharToUpper())
                .Completed();

        }

    }

}