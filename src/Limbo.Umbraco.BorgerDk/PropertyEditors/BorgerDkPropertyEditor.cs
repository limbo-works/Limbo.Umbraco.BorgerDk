using Umbraco.Cms.Core.IO;
using Umbraco.Cms.Core.PropertyEditors;

#pragma warning disable 1591

namespace Limbo.Umbraco.BorgerDk.PropertyEditors;

/// <summary>
/// Class representing the Borger.dk property editor.
/// </summary>
/// <remarks>
/// As of Umbraco 14, a property editor is split in two: the schema (this class, server side) and the UI (registered
/// as a <c>propertyEditorUi</c> in <c>wwwroot/umbraco-package.json</c>). The label, icon and group that used to be
/// part of the <see cref="DataEditorAttribute"/> now live in that manifest instead.
/// </remarks>
[DataEditor(EditorAlias, ValueType = ValueTypes.Json, ValueEditorIsReusable = false)]
public class BorgerDkPropertyEditor : DataEditor {

    /// <summary>
    /// Gets the alias of the property editor schema.
    /// </summary>
    public const string EditorAlias = "Limbo.Umbraco.BorgerDk";

    /// <summary>
    /// Gets the alias of the property editor UI shipped with this package.
    /// </summary>
    public const string EditorUiAlias = "Limbo.Umbraco.BorgerDk.PropertyEditorUi";

    private readonly IIOHelper _ioHelper;

    public BorgerDkPropertyEditor(IDataValueEditorFactory dataValueEditorFactory, IIOHelper ioHelper) : base(dataValueEditorFactory) {
        _ioHelper = ioHelper;
    }

    /// <inheritdoc />
    protected override IConfigurationEditor CreateConfigurationEditor() => new BorgerDkConfigurationEditor(_ioHelper);

}