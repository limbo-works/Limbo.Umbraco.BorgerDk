using Microsoft.AspNetCore.Mvc;
using Umbraco.Cms.Api.Management.Controllers;
using Umbraco.Cms.Api.Management.Routing;

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
[VersionedApiBackOfficeRoute("borgerdk")]
public abstract class BorgerDkManagementApiControllerBase : ManagementApiControllerBase { }
