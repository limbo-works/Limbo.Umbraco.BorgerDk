using System.Collections.Generic;
using Umbraco.Cms.Core.Manifest;

namespace Limbo.Umbraco.BorgerDk;

/// <inheritdoc />
public class BorgerDkManifestFilter : IManifestFilter {

    /// <inheritdoc />
    public void Filter(List<PackageManifest> manifests) {

        // Initialize a new manifest filter for this package
        PackageManifest manifest = new() {
            AllowPackageTelemetry = true,
            PackageId = BorgerDkPackage.Alias,
            PackageName = BorgerDkPackage.Name,
            Version = BorgerDkPackage.InformationalVersion,
            Scripts = [
                "/App_Plugins/Limbo.Umbraco.BorgerDk/Scripts/Services/BorgerDkService.js",
                "/App_Plugins/Limbo.Umbraco.BorgerDk/Scripts/Directives/Item.js",
                "/App_Plugins/Limbo.Umbraco.BorgerDk/Scripts/Controllers/AllowedTypes.js",
                "/App_Plugins/Limbo.Umbraco.BorgerDk/Scripts/Controllers/Editor.js",
                "/App_Plugins/Limbo.Umbraco.BorgerDk/Scripts/Controllers/Dashboard.js",
                "/App_Plugins/Limbo.Umbraco.BorgerDk/Scripts/Controllers/Municipality.js",
                "/App_Plugins/Limbo.Umbraco.BorgerDk/Scripts/Controllers/Overlay.js",
                "/App_Plugins/Limbo.Umbraco.BorgerDk/Scripts/Controllers/SearchOverlay.js"
            ],
            Stylesheets = [
                "/App_Plugins/Limbo.Umbraco.BorgerDk/Styles/BorgerDk.css"
            ]
        };

        // Append the manifest
        manifests.Add(manifest);

    }

}