using Umbraco.Cms.Core.IO;
using Umbraco.Cms.Core.PropertyEditors;
using Umbraco.Cms.Core.Services;

#pragma warning disable 1591

namespace Limbo.Umbraco.BorgerDk.PropertyEditors;

public class BorgerDkConfigurationEditor : ConfigurationEditor<BorgerDkConfiguration> {

    public BorgerDkConfigurationEditor(IIOHelper ioHelper, IEditorConfigurationParser editorConfigurationParser) : base(ioHelper, editorConfigurationParser) { }

}