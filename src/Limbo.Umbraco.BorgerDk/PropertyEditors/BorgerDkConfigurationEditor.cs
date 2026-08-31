using Umbraco.Cms.Core.IO;
using Umbraco.Cms.Core.PropertyEditors;

#pragma warning disable 1591

namespace Limbo.Umbraco.BorgerDk.PropertyEditors;

/// <remarks>
/// The Umbraco 13 constructor also took an <c>IEditorConfigurationParser</c>, which was used to resolve the
/// AngularJS views of the configuration fields. It is gone as of Umbraco 14 - the configuration fields now point at
/// property editor UIs declared in <c>wwwroot/umbraco-package.json</c>.
/// </remarks>
public class BorgerDkConfigurationEditor : ConfigurationEditor<BorgerDkConfiguration> {

    public BorgerDkConfigurationEditor(IIOHelper ioHelper) : base(ioHelper) { }

}