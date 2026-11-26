using Limbo.Umbraco.BorgerDk.Constants;
using Umbraco.Cms.Core.IO;
using Umbraco.Cms.Core.PropertyEditors;

#pragma warning disable 1591

namespace Limbo.Umbraco.BorgerDk.PropertyEditors;

/// <summary>
/// Class representing the Borger.dk property editor.
/// </summary>
[DataEditor(EditorAlias, ValueType = EditorValueType, ValueEditorIsReusable = false)]
public class BorgerDkArticlePickerPropertyEditor : DataEditor {

    /// <summary>
    /// Gets the alias of the property editor schema.
    /// </summary>
    public const string EditorAlias = BorgerDkPropertyEditorSchemaAliases.ArticlePicker;

    /// <summary>
    /// Gets the alias of the property editor UI shipped with this package.
    /// </summary>
    public const string EditorUiAlias = BorgerDkPropertyEditorUiAliases.ArticlePicker;

    public const string EditorName = "Limbo Borger.dk Article Picker";

    public const string EditorIcon = "icon-map-location";

    public const string EditorGroup = "Limbo";

    public const string EditorValueType = ValueTypes.Json;

    private readonly IIOHelper _ioHelper;

    public BorgerDkArticlePickerPropertyEditor(IDataValueEditorFactory dataValueEditorFactory, IIOHelper ioHelper) : base(dataValueEditorFactory) {
        _ioHelper = ioHelper;
    }

    /// <inheritdoc />
    protected override IConfigurationEditor CreateConfigurationEditor() => new BorgerDkArticlePickerConfigurationEditor(_ioHelper);

}