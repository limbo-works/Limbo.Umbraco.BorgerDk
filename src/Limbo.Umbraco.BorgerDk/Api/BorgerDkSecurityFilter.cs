using Umbraco.Cms.Api.Management.OpenApi;

namespace Limbo.Umbraco.BorgerDk.Api;

internal class BorgerDkSecurityFilter : BackOfficeSecurityRequirementsOperationFilterBase {

    protected override string ApiName => BorgerDkApiConstants.Name;

}