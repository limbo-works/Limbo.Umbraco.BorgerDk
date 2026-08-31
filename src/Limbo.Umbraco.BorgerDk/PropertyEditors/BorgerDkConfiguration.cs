using System.Collections.Generic;
using System.Text.Json.Serialization;
using Limbo.Integrations.BorgerDk;
using Umbraco.Cms.Core.PropertyEditors;

namespace Limbo.Umbraco.BorgerDk.PropertyEditors;

/// <summary>
/// Class representing the configuration of a <see cref="BorgerDkPropertyEditor"/>.
/// </summary>
/// <remarks>
/// Umbraco 14 introduced two changes that affect this class:
///
/// <list type="bullet">
///   <item>Data type configuration is serialized with <c>System.Text.Json</c> rather than Newtonsoft.Json. As
///   <see cref="BorgerDkMunicipality"/> relies on a Newtonsoft converter, the municipality is now stored as its
///   numeric code - which is also what the backoffice UI has always submitted.</item>
///   <item>The label, description and editor view of a configuration field are no longer passed to
///   <c>ConfigurationFieldAttribute</c>. They are declared as <c>settings.properties</c> on the
///   <c>propertyEditorUi</c> manifest in <c>wwwroot/umbraco-package.json</c> instead.</item>
/// </list>
/// </remarks>
public class BorgerDkConfiguration {

    /// <summary>
    /// Gets or sets the code of the municipality to be used. <c>0</c> means no municipality.
    /// </summary>
    [ConfigurationField("municipality")]
    [JsonPropertyName("municipality")]
    public int Municipality { get; set; }

    /// <summary>
    /// Gets or sets an array with the allowed types. If <c>null</c> or empty, all types are allowed.
    /// </summary>
    [ConfigurationField("allowedTypes")]
    [JsonPropertyName("allowedTypes")]
    public List<string> AllowedTypes { get; set; } = [];

    /// <summary>
    /// Gets or sets whether the property editor label should be hidden.
    /// </summary>
    /// <remarks>
    /// Umbraco 14+ moved "hide label" to the property itself on the document type, and nothing in the backoffice
    /// reads a data type level flag anymore. The property is therefore inert, and is only retained so existing
    /// data type configuration keeps deserializing. It is deliberately not offered in the property editor UI
    /// manifest, and should be removed in a future major version.
    /// </remarks>
    [ConfigurationField("hideLabel")]
    [JsonPropertyName("hideLabel")]
    public bool HideLabel { get; set; }

    /// <summary>
    /// Returns the <see cref="BorgerDkMunicipality"/> matching <see cref="Municipality"/>, or
    /// <see cref="BorgerDkMunicipality.NoMunicipality"/> if the code isn't recognized.
    /// </summary>
    /// <returns>An instance of <see cref="BorgerDkMunicipality"/>.</returns>
    public BorgerDkMunicipality GetMunicipality() {
        return BorgerDkMunicipality.TryGetFromCode(Municipality, out BorgerDkMunicipality? municipality)
            ? municipality
            : BorgerDkMunicipality.NoMunicipality;
    }

}
