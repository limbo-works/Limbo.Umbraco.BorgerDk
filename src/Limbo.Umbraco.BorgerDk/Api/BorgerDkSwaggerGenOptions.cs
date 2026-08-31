using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Microsoft.OpenApi;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace Limbo.Umbraco.BorgerDk.Api;

#pragma warning disable CS1591

public class BorgerDkSwaggerGenOptions : IConfigureOptions<SwaggerGenOptions> {

    public void Configure(SwaggerGenOptions options) {

        options.SwaggerDoc(BorgerDkApiConstants.Alias, new OpenApiInfo {
            Title = BorgerDkApiConstants.Name,
            Version = "1.0"
        });

        options.OperationFilter<BorgerDkSecurityFilter>();
        options.SchemaFilter<BorgerDkSchemaFilter>();
        options.DocumentFilter<BorgerDkDocumentFilter>();

    }

}