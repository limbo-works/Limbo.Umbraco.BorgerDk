using Umbraco.Cms.Core.IO;
using Umbraco.Cms.Core.PropertyEditors;
using Umbraco.Cms.Core.Services;

#pragma warning disable 1591

namespace Limbo.Umbraco.BorgerDk.PropertyEditors {

    /// <summary>
    /// Class representing the Borger.dk property editor.
    /// </summary>
    [DataEditor(EditorAlias, EditorType.PropertyValue, "Limbo Borger.dk", EditorView, ValueType = ValueTypes.Json, Group = "Limbo", Icon = EditorIcon)]
    public class BorgerDkPropertyEditor : DataEditor {

        internal const string EditorAlias = "Limbo.Umbraco.BorgerDk";

        internal const string EditorIcon = "icon-school color-limbo";

        internal const string EditorView = "/App_Plugins/Limbo.Umbraco.BorgerDk/Views/Editor.html";

        private readonly IIOHelper _ioHelper;
        private readonly IEditorConfigurationParser _editorConfigurationParser;

        public BorgerDkPropertyEditor(IDataValueEditorFactory dataValueEditorFactory, IIOHelper ioHelper, IEditorConfigurationParser editorConfigurationParser) : base(dataValueEditorFactory) {
            _ioHelper = ioHelper;
            _editorConfigurationParser = editorConfigurationParser;
        }

        /// <inheritdoc />
        protected override IConfigurationEditor CreateConfigurationEditor() => new BorgerDkConfigurationEditor(_ioHelper, _editorConfigurationParser);

    }

}