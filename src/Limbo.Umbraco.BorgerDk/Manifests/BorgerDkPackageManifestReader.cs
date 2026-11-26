using System.Collections.Generic;
using System.Threading.Tasks;
using Umbraco.Cms.Core.Manifest;
using Umbraco.Cms.Infrastructure.Manifest;

#pragma warning disable CS1591 // Missing XML comment for publicly visible type or member

using static Limbo.Umbraco.BorgerDk.BorgerDkPackage;

namespace Limbo.Umbraco.BorgerDk.Manifests;

public class BorgerDkPackageManifestReader : IPackageManifestReader {

    public Task<IEnumerable<PackageManifest>> ReadPackageManifestsAsync() {

        IEnumerable<PackageManifest> manifests = [
            new() {
                Id = Alias,
                Name = Name,
                AllowTelemetry = true,
                Version = InformationalVersion,
                Extensions = [
                    new {
                        type = "backofficeEntryPoint",
                        alias = "Limbo.Umbraco.BorgerDk.EntryPoint",
                        name =  "Limbo Borger.dk Entry Point",
                        js = $"/App_Plugins/{Alias}/limbo-borgerdk.js"
                    }
                ]
            }
        ];

        return Task.FromResult(manifests);

    }

}