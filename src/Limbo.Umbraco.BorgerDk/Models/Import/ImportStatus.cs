using Newtonsoft.Json;
using Skybrud.Essentials.Json.Newtonsoft.Converters.Enums;

#pragma warning disable 1591

namespace Limbo.Umbraco.BorgerDk.Models.Import;

[JsonConverter(typeof(EnumStringConverter))]
public enum ImportStatus {
    Pending,
    Completed,
    Aborted,
    Failed
}