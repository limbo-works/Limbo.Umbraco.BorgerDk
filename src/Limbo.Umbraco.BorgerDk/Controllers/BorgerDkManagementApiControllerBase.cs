using Asp.Versioning;
using Limbo.Umbraco.BorgerDk.Api;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Umbraco.Cms.Api.Common.Attributes;
using Umbraco.Cms.Api.Management.Controllers;
using Umbraco.Cms.Api.Management.Routing;
using Umbraco.Cms.Web.Common.Authorization;

namespace Limbo.Umbraco.BorgerDk.Controllers;

/// <summary>
/// Base class for the Management API controllers of this package.
/// </summary>
/// <remarks>
/// Umbraco 14 replaced the AngularJS backoffice - and with it <c>UmbracoAuthorizedApiController</c> and the
/// <c>[PluginController]</c> attribute - with the Management API. Endpoints are now routed under
/// <c>/umbraco/management/api/v1/borgerdk/</c> and are described by the Management API OpenAPI document.
/// </remarks>
[ApiExplorerSettings(GroupName = "Borger.dk")]
[ApiController]
[VersionedApiBackOfficeRoute(BorgerDkApiConstants.Route)]
[Authorize(Policy = AuthorizationPolicies.SectionAccessContent)]
[MapToApi(BorgerDkApiConstants.Alias)]
[ApiVersion(BorgerDkApiConstants.Version)]
public abstract class BorgerDkManagementApiControllerBase : ManagementApiControllerBase;