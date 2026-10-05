using Limbo.Umbraco.BorgerDk.Constants;
using Umbraco.Cms.Core.IO;
using Umbraco.Cms.Core.PropertyEditors;

#pragma warning disable 1591

namespace Limbo.Umbraco.BorgerDk.PropertyEditors;

/// <summary>
/// Class representing the Borger.dk property editor.
/// </summary>
[DataEditor(EditorAlias, ValueType = ValueTypes.Json, ValueEditorIsReusable = false)]
public class BorgerDkArticlePickerPropertyEditor : DataEditor {

    /// <summary>
    /// Gets the alias of the property editor schema.
    /// </summary>
    public const string EditorAlias = BorgerDkPropertyEditorSchemaAliases.ArticlePicker;

    /// <summary>
    /// Gets the alias of the property editor UI shipped with this package.
    /// </summary>
    public const string EditorUiAlias = BorgerDkPropertyEditorUiAliases.ArticlePicker;

    private readonly IIOHelper _ioHelper;

    public BorgerDkArticlePickerPropertyEditor(IDataValueEditorFactory dataValueEditorFactory, IIOHelper ioHelper) : base(dataValueEditorFactory) {
        _ioHelper = ioHelper;
    }

    /// <inheritdoc />
    protected override IConfigurationEditor CreateConfigurationEditor() => new BorgerDkArticlePickerConfigurationEditor(_ioHelper);

}