using System.Collections.Generic;
using System.Reflection;
using Umbraco.Cms.Core.Manifest;

namespace Limbo.Umbraco.BorgerDk;

/// <inheritdoc />
public class BorgerDkManifestFilter : IManifestFilter {

    /// <inheritdoc />
    public void Filter(List<PackageManifest> manifests) {

        // Initialize a new manifest filter for this package
        PackageManifest manifest = new() {
            AllowPackageTelemetry = true,
            PackageName = BorgerDkPackage.Name,
            Version = BorgerDkPackage.InformationalVersion,
            Scripts = new[] {
                "/App_Plugins/Limbo.Umbraco.BorgerDk/Scripts/Services/BorgerDkService.js",
                "/App_Plugins/Limbo.Umbraco.BorgerDk/Scripts/Directives/Item.js",
                "/App_Plugins/Limbo.Umbraco.BorgerDk/Scripts/Controllers/AllowedTypes.js",
                "/App_Plugins/Limbo.Umbraco.BorgerDk/Scripts/Controllers/Editor.js",
                "/App_Plugins/Limbo.Umbraco.BorgerDk/Scripts/Controllers/Dashboard.js",
                "/App_Plugins/Limbo.Umbraco.BorgerDk/Scripts/Controllers/Municipality.js",
                "/App_Plugins/Limbo.Umbraco.BorgerDk/Scripts/Controllers/Overlay.js",
                "/App_Plugins/Limbo.Umbraco.BorgerDk/Scripts/Controllers/SearchOverlay.js"
            },
            Stylesheets = new[] {
                "/App_Plugins/Limbo.Umbraco.BorgerDk/Styles/BorgerDk.css"
            }
        };

        // The "PackageId" property isn't available prior to Umbraco 12, and since the package is build against
        // Umbraco 10, we need to use reflection for setting the property value for Umbraco 12+. Ideally this
        // shouldn't fail, but we might at least add a try/catch to be sure
        try {
            PropertyInfo? property = manifest.GetType().GetProperty("PackageId");
            property?.SetValue(manifest, BorgerDkPackage.Alias);
        } catch {
            // We don't really care about the exception
        }

        // Append the manifest
        manifests.Add(manifest);

    }

}