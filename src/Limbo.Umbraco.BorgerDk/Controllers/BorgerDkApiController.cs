using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text.RegularExpressions;
using Limbo.Integrations.BorgerDk;
using Limbo.Integrations.BorgerDk.Elements;
using Limbo.Integrations.BorgerDk.Exceptions;
using Limbo.Umbraco.BorgerDk.Models.Api;
using Limbo.Umbraco.BorgerDk.Models.Import;
using Limbo.Umbraco.BorgerDk.Scheduling;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Skybrud.Essentials.Strings;
using Umbraco.Cms.Core.Cache;
using Umbraco.Cms.Core.Sync;

#pragma warning disable 1591

namespace Limbo.Umbraco.BorgerDk.Controllers;

/// <summary>
/// Management API controller backing the Borger.dk dashboard and property editor.
/// </summary>
public class BorgerDkApiController : BorgerDkManagementApiControllerBase {

    private readonly IServerRoleAccessor _serverRoleAccessor;
    private readonly BorgerDkService _borgerdk;
    private readonly BorgerDkImportTaskSettings _importSettings;
    private readonly ILogger<BorgerDkApiController> _logger;
    private readonly IAppPolicyCache _runtimeCache;

    public BorgerDkApiController(IServerRoleAccessor serverRoleAccessor,
        BorgerDkService borgerdk,
        BorgerDkImportTaskSettings importSettings,
        ILogger<BorgerDkApiController> logger,
        AppCaches appCaches) {
        _serverRoleAccessor = serverRoleAccessor;
        _borgerdk = borgerdk;
        _importSettings = importSettings;
        _logger = logger;
        _runtimeCache = appCaches.RuntimeCache;
    }

    /// <summary>
    /// Runs a new import from the Borger.dk web services.
    /// </summary>
    /// <remarks>
    /// In Umbraco 13 this endpoint was annotated with <c>[AllowAnonymous]</c>, which made it possible for anyone to
    /// trigger a full import. It now requires an authenticated backoffice user like the rest of the Management API.
    /// </remarks>
    [HttpPost("import")]
    [ProducesResponseType<ImportTaskModel>(StatusCodes.Status200OK)]
    public IActionResult Import() {

        // Run a new import
        ImportJob result = _borgerdk.Import();

        // Save the result to the disk
        _borgerdk.WriteToLog(result);

        // Return the result for the API
        return Ok(ImportTaskModel.Create(result));

    }

    /// <summary>
    /// Returns the current server role and the settings of the scheduled import task.
    /// </summary>
    [HttpGet("settings")]
    [ProducesResponseType<BorgerDkSettingsModel>(StatusCodes.Status200OK)]
    public IActionResult GetSettings() {
        return Ok(new BorgerDkSettingsModel {
            ServerRole = _serverRoleAccessor.CurrentServerRole.ToString(),
            State = _importSettings.State.ToString(),
            ImportInterval = _importSettings.ImportInterval,
            LogResults = _importSettings.LogResults
        });
    }

    /// <summary>
    /// Returns a list of the known Borger.dk web service endpoints.
    /// </summary>
    [HttpGet("endpoints")]
    [ProducesResponseType<IEnumerable<BorgerDkEndpointModel>>(StatusCodes.Status200OK)]
    public IActionResult GetEndpoints() {
        return Ok(BorgerDkEndpoint.Values.Select(x => new BorgerDkEndpointModel {
            Domain = x.Domain,
            Name = x.Name
        }));
    }

    /// <summary>
    /// Returns the articles of the specified <paramref name="domain"/>, optionally filtered by <paramref name="text"/>.
    /// </summary>
    /// <param name="text">A search term matched against the article titles.</param>
    /// <param name="domain">The domain of the endpoint. Defaults to <see cref="BorgerDkEndpoint.Default"/>.</param>
    [HttpGet("articles")]
    [ProducesResponseType<IEnumerable<BorgerDkArticleListItemModel>>(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public IActionResult GetArticles(string? text = null, string? domain = null) {

        BorgerDkEndpoint? endpoint;
        if (string.IsNullOrWhiteSpace(domain) == false) {
            endpoint = BorgerDkEndpoint.GetFromDomain(domain);
            if (endpoint == null) return Error(400, $"Endpoint with domain '{domain}' not found.");
        } else {
            endpoint = BorgerDkEndpoint.Default;
        }

        BorgerDkHttpService service = new(endpoint);

        IEnumerable<BorgerDkArticleDescription> articles = (IEnumerable<BorgerDkArticleDescription>) _runtimeCache.Get("BorgerDkArticleList:" + endpoint.Domain, () => service.GetArticleList(), TimeSpan.FromMinutes(10))!;

        if (string.IsNullOrWhiteSpace(text) == false) {
            articles = articles.Where(x => x.Title.Contains(text, StringComparison.CurrentCultureIgnoreCase));
        }

        return Ok(articles.Select(x => new BorgerDkArticleListItemModel {
            Id = x.Id,
            Url = x.Url,
            Title = WebUtility.HtmlDecode(x.Title),
            PublishDate = x.PublishDate.UnixTimeSeconds,
            UpdateDate = x.UpdateDate.UnixTimeSeconds
        }));

    }

    /// <summary>
    /// Looks up the article with the specified <paramref name="url"/>, imports it into the local database and
    /// returns it along with the elements the editor may select from.
    /// </summary>
    /// <param name="url">The URL of the article at Borger.dk.</param>
    /// <param name="municipality">The code of the municipality the article should be fetched for.</param>
    [HttpGet("article")]
    [ProducesResponseType<BorgerDkArticleModel>(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public IActionResult GetArticleByUrl(string? url = null, int municipality = 0) {

        if (string.IsNullOrWhiteSpace(url)) {
            return Error(400, "Ingen URL angivet.");
        }

        // Get the endpoint from the domain/URL
        BorgerDkEndpoint? endpoint = BorgerDkEndpoint.GetFromUrl(url);
        if (endpoint == null) return Error(400, "Den angivne URL er ikke gyldig.");

        // Parse the municipality code
        if (BorgerDkMunicipality.TryGetFromCode(municipality, out BorgerDkMunicipality? borgerDkMunicipality) == false) {
            return Error(400, "Den angivne kommune er ikke gyldig.");
        }

        // Initialize a new service instance
        BorgerDkHttpService http = new(endpoint);

        // Look up the ID of the article with the specified URL
        BorgerDkArticleShortDescription item;
        try {
            item = http.GetArticleIdFromUrl(url);
        } catch (BorgerDkNotFoundException) {
            return Error(500, "Artiklen med den angivne URL blev ikke fundet.");
        } catch (BorgerDkNotExportableException) {
            return Error(500, "Artiklen med den angivne URL er låst for eksport fra Borger.dk.");
        } catch (BorgerDkException ex) {
            _logger.LogError(ex, "{Message}", ex.Message);
            return Error(500, ex.Message);
        } catch (Exception ex) {
            _logger.LogError(ex, "Der skete en fejl i kaldet til Borger.dk.");
            return Error(500, "Der skete en fejl i kaldet til Borger.dk.");
        }

        // Get the article via the web service
        BorgerDkArticle article;
        try {
            article = http.GetArticleFromId(item.Id, borgerDkMunicipality);
        } catch (Exception ex) {
            _logger.LogError(ex, "Der skete en fejl i kaldet til Borger.dk.");
            return Error(500, "Der skete en fejl i kaldet til Borger.dk.");
        }

        // Make sure to import/update the article
        _borgerdk.Import(article);

        List<BorgerDkElementModel> elements = [];

        foreach (BorgerDkElement element in article.Elements) {

            switch (element) {

                case BorgerDkTextElement text:
                    elements.Add(new BorgerDkElementModel {
                        Id = element.Id,
                        Title = text.Title,
                        Content = BorgerDkHtmlSanitizer.Sanitize(StripLeadingHeading(text.Content, 3))
                    });
                    break;

                case BorgerDkBlockElement block:
                    elements.Add(new BorgerDkElementModel {
                        Id = element.Id,
                        Title = "Mikroartikler",
                        MicroArticles = block.MicroArticles.Select(x => new BorgerDkMicroArticleModel {
                            Id = x.Id,
                            Title = x.Title,
                            Content = BorgerDkHtmlSanitizer.Sanitize(StripLeadingHeading(x.Content, 2))
                        }).ToList()
                    });
                    break;

            }

        }

        return Ok(new BorgerDkArticleModel {
            Id = article.Id,
            Url = article.Url,
            Domain = article.Domain,
            Municipality = article.Municipality.Code,
            Title = article.Title,
            Header = article.Header,
            ByLine = StringUtils.StripHtml(article.Elements.OfType<BorgerDkTextElement>().FirstOrDefault(x => x.Id == "byline")?.Content),
            PublishDate = article.PublishDate.UnixTimeSeconds,
            UpdateDate = article.UpdateDate.UnixTimeSeconds,
            Elements = elements
        });

    }

    /// <summary>
    /// Returns a <see cref="ProblemDetails"/> response with the specified <paramref name="detail"/>.
    /// </summary>
    /// <remarks>
    /// The Umbraco 17 backoffice HTTP client discards error bodies that don't look like <see cref="ProblemDetails"/>
    /// and substitutes a generic message, so a bare string would never reach the editor. Errors an editor can act on
    /// are therefore returned as problem details, with the message in the <c>detail</c> field.
    /// </remarks>
    private IActionResult Error(int statusCode, string detail) {
        return Problem(detail: detail, statusCode: statusCode);
    }

    /// <summary>
    /// The title of an element is already shown separately in the backoffice, so the leading heading is stripped
    /// from the content to avoid showing it twice.
    /// </summary>
    private static string StripLeadingHeading(string content, int level) {
        return Regex.Replace(content, $"^<h{level}>(.+?)</h{level}>", string.Empty).Trim();
    }

}
