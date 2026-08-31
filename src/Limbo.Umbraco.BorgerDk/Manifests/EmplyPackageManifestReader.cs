using System.Collections.Generic;
using System.Threading.Tasks;
using Skybrud.Essentials.Security.Extensions;
using Umbraco.Cms.Core.Manifest;
using Umbraco.Cms.Infrastructure.Manifest;

#pragma warning disable CS1591 // Missing XML comment for publicly visible type or member

namespace Limbo.Umbraco.BorgerDk.Manifests;

public class BorgerDkPackageManifestReader : IPackageManifestReader {

    public static string Alias => BorgerDkPackage.Alias;

    public static string Name => BorgerDkPackage.Name;

    public Task<IEnumerable<PackageManifest>> ReadPackageManifestsAsync() {

        string cacheBuster = BorgerDkPackage.InformationalVersion.ToMd5Hash();

        IEnumerable<PackageManifest> manifests = [
            new() {
                Id = Alias,
                Name = Name,
                AllowTelemetry = true,
                Version = BorgerDkPackage.InformationalVersion,
                Extensions = [
                    new {
                        type = "backofficeEntryPoint",
                        alias = "Limbo.Umbraco.BorgerDk.EntryPoint",
                        name =  "Limbo Borger.dk Entry Point",
                        js = $"/App_Plugins/{Alias}/limbo-borgerdk.js"
                    }
                ],
                Importmap = null
            }
        ];

        return Task.FromResult(manifests);

    }

}