﻿using Newtonsoft.Json;

#pragma warning disable 1591

namespace Limbo.Umbraco.BorgerDk.Models.Import;

public class ImportJob : ImportTask {

    [JsonProperty("type", Order = -999)]
    public static string Type => "Job";

}