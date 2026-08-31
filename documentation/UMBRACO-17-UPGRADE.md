# Upgrading Limbo.Umbraco.BorgerDk to Umbraco 17

This document recaps the work done to move **Limbo.Umbraco.BorgerDk** from Umbraco 13 to Umbraco 17, on the
`v17/dev` branch. It is written for someone who knows the Umbraco 13 version of the package and needs to understand
what changed, why, and what is likely to break for consumers.

The short version: the server side needed a handful of targeted fixes, while the entire backoffice UI had to be
rewritten, because Umbraco 14 replaced the AngularJS backoffice with a Lit/TypeScript one.

---

## 1. Target framework, package version and dependencies

| | Umbraco 13 | Umbraco 17 |
|---|---|---|
| Target framework | `net8.0` | `net10.0` |
| Package version | `13.0.1` | `17.0.0-alpha000` |
| `Umbraco.Cms.Core` | `[13.0.0,13.999)` | `[17.0.0,17.9.9)` |
| `Umbraco.Cms.Web.Website` | `[13.0.0,13.999)` | `[17.0.0,17.9.9)` |
| `Umbraco.Cms.Web.BackOffice` | `[13.0.0,13.999)` | *removed* |
| `Umbraco.Cms.Api.Management` | – | `[17.0.0,17.9.9)` |
| `Umbraco.Cms.Infrastructure` | *(transitive)* | `[17.0.0,17.9.9)` |
| `Skybrud.Essentials` | `1.1.59` | `1.1.68` |
| `Skybrud.Essentials.Umbraco` | `13.0.2` | `17.0.0-alpha003` |
| `Limbo.Integrations.BorgerDk` | `1.0.4` | `1.0.4` (unchanged) |

Notes:

- **`Umbraco.Cms.Web.BackOffice` no longer exists.** The server-side half of the backoffice now lives in
  `Umbraco.Cms.Api.Management`, which is what the package references instead.
- **The version suffix is now always applied.** `VersionPrefix` is `17.0.0` and `VersionSuffix` is `alpha000`, so
  release builds produce `Limbo.Umbraco.BorgerDk.17.0.0-alpha000.nupkg`. Debug builds still append a timestamp
  (`alpha000.build202607311200`).
- **`NU1605` is suppressed on purpose.** `Skybrud.Essentials.Umbraco 17.0.0-alpha003` requires Umbraco `>= 17.1.0`,
  while the advertised range for this package deliberately starts at `17.0.0`. Restore therefore reports a
  downgrade for the lower bound. The range shipped in the nuspec is the one that matters to consumers, so the
  warning is suppressed rather than the range being narrowed. Once the alpha dependency settles, revisit this.

---

## 2. Server side

### 2.1 Property editor split into schema + UI

In Umbraco 14 a property editor became two separate things: a **schema** (C#) and a **UI** (a `propertyEditorUi`
manifest). The label, icon, group and view all moved out of the `[DataEditor]` attribute.

```diff
-[DataEditor(EditorAlias, EditorType.PropertyValue, "Limbo Borger.dk", EditorView,
-            ValueType = ValueTypes.Json, Group = "Limbo", Icon = EditorIcon)]
+[DataEditor(EditorAlias, ValueType = ValueTypes.Json, ValueEditorIsReusable = false)]
 public class BorgerDkPropertyEditor : DataEditor {
```

`EditorView` and `EditorIcon` are gone; a new `EditorUiAlias` constant documents which UI the schema pairs with.
`BorgerDkConfigurationEditor` lost its `IEditorConfigurationParser` argument (it still takes `IIOHelper`).

### 2.2 Data type configuration: municipality is now an `int`

`BorgerDkConfiguration.Municipality` used to be a `BorgerDkMunicipality` object. Umbraco 14+ serializes data type
configuration with `System.Text.Json`, and `BorgerDkMunicipality` relies on a **Newtonsoft** converter - so it would
no longer round-trip.

The property is therefore now the numeric municipality code, which is what the backoffice UI has always submitted
anyway. A `GetMunicipality()` helper resolves the `BorgerDkMunicipality` for callers that need it.

```diff
-[ConfigurationField("municipality", "Municipality", "/App_Plugins/.../Municipality.html", Description = "...")]
-public BorgerDkMunicipality Municipality { get; set; } = BorgerDkMunicipality.NoMunicipality;
+[ConfigurationField("municipality")]
+[JsonPropertyName("municipality")]
+public int Municipality { get; set; }
```

`ConfigurationFieldAttribute` now only takes the alias - label, description and editor moved to the
`settings.properties` array on the `propertyEditorUi` manifest.

> **Breaking for consumers:** any code reading `BorgerDkConfiguration.Municipality` as a `BorgerDkMunicipality`
> must switch to `GetMunicipality()`. Existing data type configuration in the database is unaffected: the stored
> JSON was already a number.

`HideLabel` was kept on the configuration class, and is still editable on the data type, but Umbraco 14+ moved
"hide label" to the *property* level on the document type. Nothing in the new backoffice reads the data type level
flag any more, so it is effectively inert - it is retained only so existing configuration keeps deserializing.
Consider dropping it in a later release.

### 2.3 Value converter

```diff
-BorgerDkConfiguration? config = propertyType.DataType.Configuration as BorgerDkConfiguration;
+BorgerDkConfiguration? config = propertyType.DataType.ConfigurationAs<BorgerDkConfiguration>();
```

`IPublishedDataType.Configuration` is an object graph in Umbraco 14+, so the typed instance has to be requested
explicitly. The cache level also changed - `PropertyCacheLevel.Snapshot` is obsolete ("caching no longer supports
snapshotting"), so the converter now returns `PropertyCacheLevel.None`.

`None` - not `Element` - is the right replacement. `Snapshot` effectively meant "re-convert on each request", and
that matters here: `BorgerDkImportTask` refreshes articles in the background, and `BorgerDkCacheRefresher` only
refreshes `BorgerDkCache` - it never touches the published content cache. Caching the converted value at element
level would pin it for the lifetime of the cached `IPublishedContent`, so the front end would keep rendering the
article as it looked when the content item entered the cache. Converting every time is cheap, because the article
itself still comes out of `BorgerDkCache`.

### 2.4 Backoffice controller → Management API

`UmbracoAuthorizedApiController` and `[PluginController]` are gone. `BorgerDkController` was replaced by:

- `BorgerDkManagementApiControllerBase` - `ManagementApiControllerBase` + `[VersionedApiBackOfficeRoute("borgerdk")]`
  + `[ApiExplorerSettings(GroupName = "Borger.dk")]`.
- `BorgerDkApiController` - the actual endpoints.

Routes changed accordingly:

| Umbraco 13 | Umbraco 17 |
|---|---|
| `GET /umbraco/backoffice/Limbo/BorgerDk/Import` | `POST /umbraco/management/api/v1/borgerdk/import` |
| `GET .../GetSettings` | `GET  /umbraco/management/api/v1/borgerdk/settings` |
| `GET .../GetEndpoints` | `GET  /umbraco/management/api/v1/borgerdk/endpoints` |
| `GET .../GetArticles` | `GET  /umbraco/management/api/v1/borgerdk/articles` |
| `GET .../GetArticleByUrl` | `GET  /umbraco/management/api/v1/borgerdk/article` |

Three deliberate behaviour changes:

- **`Import` is no longer anonymous.** The Umbraco 13 action carried `[AllowAnonymous]`, which meant anyone who
  knew the URL could trigger a full import against the Borger.dk web services. It is now authenticated like every
  other Management API endpoint, and it is a `POST` because it mutates state. *If a site relied on hitting that URL
  from an external scheduler, that integration needs rethinking* - the built-in `BorgerDkImportTask` is the
  supported way to run imports on a schedule.
- **Responses are typed.** The old actions returned anonymous objects. Because the Management API is described by
  OpenAPI - and serializes with `System.Text.Json` rather than Newtonsoft - the endpoints now return the models in
  `Models/Api`, annotated with `[ProducesResponseType<T>]`.
- **Errors are returned as problem details.** The Umbraco 17 backoffice HTTP client discards any error body that
  doesn't look like `ProblemDetails` and substitutes a generic message, so the old `BadRequest("Den angivne URL er
  ikke gyldig.")` would have reached the editor as "Internal Server Error". The controller now returns
  `Problem(detail: ..., statusCode: ...)`, and the client reads the `detail` field.

`ImportJob`/`ImportTask` stayed Newtonsoft-shaped, since they are still serialized to the log on disk that way.
They are projected into `ImportTaskModel` for the API, which also avoids exposing a raw `Exception` over HTTP.

### 2.5 Article HTML is now sanitized server side

`BorgerDkHtmlSanitizer` (new) strips scriptable elements, inline `on*` handlers and `javascript:`/`vbscript:`/
`data:text/html` URLs from the article HTML before the API returns it. It uses `HtmlAgilityPack`, which is now an
explicit `PackageReference` rather than something relied on transitively via Umbraco.

This closes a trust-boundary regression: the Umbraco 13 view rendered the markup with AngularJS' `ng-bind-html`,
which sanitized via `$sanitize`. The new backoffice has no equivalent - a Lit element renders the markup with
`unsafeHTML` straight into the backoffice origin - so the sanitizing had to move to the server.

The server also no longer rewrites `<a ` into `<a prevent-default`; the modal swallows anchor clicks in a single
event handler instead.

### 2.6 `IManifestFilter` removed

`BorgerDkManifestFilter` and the `builder.ManifestFilters()` registration are deleted. Backoffice assets are now
declared in `wwwroot/umbraco-package.json`, which Umbraco discovers from `App_Plugins` automatically.

Incidentally, this fixes a latent bug: the deleted `wwwroot/package.manifest` still referenced the old
`Skybrud.Umbraco.BorgerDk` paths, and the AngularJS `borgerDkService` opened overlays from
`/App_Plugins/Limbo.Umbraco.Borgerdk/...` (lowercase `d`), which only worked on case-insensitive file systems.

### 2.7 Scheduled import task rewritten

`TaskHelper` is not part of `Skybrud.Essentials.Umbraco 17`. `BorgerDkImportTask` now does the bookkeeping itself:

| Was (`TaskHelper`) | Now |
|---|---|
| `_taskHelper.RuntimeLevel` | `IRuntimeState.Level` |
| `_taskHelper.ServerRole` | `IServerRoleAccessor.CurrentServerRole` |
| `_taskHelper.ShouldRun(this, interval)` | last-run timestamp read from `IKeyValueService` |
| `_taskHelper.SetLastRunTime(this)` | `IKeyValueService.SetValue(...)` |
| `_taskHelper.AppendToLog(this, sb)` | `ILogger` |

The last-run timestamp lives under the key `Limbo.Umbraco.BorgerDk.ImportTask.LastRun`. Storing it in the Umbraco
key/value table rather than on disk means it is shared across a load balanced setup instead of being per-server.
The schedule itself is unchanged: the task ticks every 5 minutes and imports when `ImportInterval` (default 12
hours) has elapsed.

> **Note:** because the timestamp moved, the first tick after upgrading will run an import.

### 2.8 Deprecations cleared

The upgrade also removed everything the Umbraco 17 compiler flagged as obsolete, so the build is warning-free:

- `MigrationBase` → `AsyncMigrationBase` (`Migrate()` → `MigrateAsync()`).
- `Upgrader.Execute(...)` → `ExecuteAsync(...)`, which made `BorgerDkMigrationHandler` an
  `INotificationAsyncHandler<T>`, registered with `AddNotificationAsyncHandler`.
- `Skybrud.Essentials.Collections.Extensions.SelectList` → `Skybrud.Essentials.Collections.Enumerables.Extensions`.
- `TimeSpanSecondsConverter` → `TimeSpanConverter` with `TimeSpanFormat.Seconds`.

The migration plan itself is untouched, so the `LimboBorgerDk` table - and the rename from the legacy
`SkybrudBorgerDk` table - behave exactly as before.

---

## 3. Backoffice client (complete rewrite)

Everything under `wwwroot/Scripts`, `wwwroot/Views`, `wwwroot/Styles` and `wwwroot/Lang` was deleted, along with
`package.manifest`, `compilerconfig.json` and the LESS pipeline. In its place there is now a TypeScript/Lit client.

### 3.1 Layout

```
src/Limbo.Umbraco.BorgerDk/
├── Client/                        # TypeScript sources (not shipped in the NuGet package)
│   ├── package.json               # @umbraco-cms/backoffice, TypeScript, Vite
│   ├── tsconfig.json
│   ├── vite.config.ts             # library build → ../wwwroot/dist
│   └── src/
│       ├── index.ts               # backofficeEntryPoint (onInit / onUnload)
│       ├── manifests.ts           # every extension manifest, in one typed array
│       ├── constants.ts
│       ├── types.ts               # hand-maintained mirror of Models/Api
│       ├── api/borgerdk.api.ts    # umbHttpClient wrappers
│       ├── data/                  # municipalities + element types (ported verbatim)
│       ├── property-editor/       # the property editor UI
│       ├── config/                # municipality + allowed-types configuration UIs
│       ├── modals/                # article picker + article search
│       ├── dashboard/             # dashboard + recursive import result tree
│       ├── localization/          # da-dk.ts, en-us.ts
│       └── utils/format.ts
└── wwwroot/
    ├── umbraco-package.json       # declares the entry point only
    └── dist/                      # Vite output (committed)
```

### 3.2 What replaced what

| Umbraco 13 (AngularJS) | Umbraco 17 (Lit) |
|---|---|
| `Views/Editor.html` + `Controllers/Editor.js` | `property-editor/property-editor-ui.element.ts` |
| `Views/Overlay.html` + `Controllers/Overlay.js` | `modals/article-modal.element.ts` |
| `Views/SearchOverlay.html` + `Controllers/SearchOverlay.js` | `modals/search-modal.element.ts` |
| `Views/Municipality.html` + `Controllers/Municipality.js` | `config/municipality.element.ts` |
| `Views/AllowedTypes.html` + `Controllers/AllowedTypes.js` | `config/allowed-types.element.ts` |
| `Views/Dashboard.html` + `Controllers/Dashboard.js` | `dashboard/dashboard.element.ts` |
| `Views/Directives/Item.html` + `Directives/Item.js` | `dashboard/import-item.element.ts` |
| `Services/BorgerDkService.js` (municipality/type lists) | `data/municipalities.ts`, `data/element-types.ts` |
| `Services/BorgerDkService.js` (`editorService.open`) | `modals/tokens.ts` + `UMB_MODAL_MANAGER_CONTEXT` |
| `Lang/da-DK.xml`, `Lang/en-US.xml` | `localization/da-dk.ts`, `localization/en-us.ts` |
| `Styles/BorgerDk.less` → `.css` | Lit `static styles` on each element |

`umbraco-package.json` deliberately declares only the `backofficeEntryPoint`; every other manifest is registered
from `manifests.ts` so the shapes are type checked and the elements are lazy loaded.

Two details that are easy to get wrong:

- **Localization cultures are language-only (`da`, `en`), not `da-dk`/`en-us`.** `UmbLocalizationRegistry` keeps a
  manifest only when its culture equals the default culture, the base name, or the language. A regional code such
  as `en-us` matches none of those for a user running on `en`, so the dictionary would never load and the UI would
  render raw keys. `en` doubles as the fallback dictionary for every other language.
- **The dashboard renders a bare `uui-box`, not `umb-body-layout`.** `umb-body-layout` is the workspace/modal shell;
  inside a dashboard it duplicates the header and fights the host's scrolling. The two modals *do* use it, correctly.

### 3.3 Behaviour that was preserved

The port is a faithful one. Worth calling out because it is easy to get wrong:

- **The selection model is unchanged.** `selection` is still a flat array of element IDs, where `kernetekst` means
  "every micro article", a 36-character ID is a single micro article, and anything else is one of the boxes. The
  property editor's summary line ("Alle mikroartikler og 2 bokse") uses the same rules as before, so **existing
  stored property values keep working**.
- **Selecting the `kernetekst` block still implies all of its micro articles**, which is why the micro article
  toggles are disabled - and shown as checked - while the block itself is selected.
- **Allowed types are still filtered client side** in the article modal, and an empty list still means "all types".
- **The URL field is still debounced by 300 ms**, and still only calls the API once the URL contains `borger.dk`.
- **Looking up an article still imports it**, which is how articles enter the local database.

`HideLabel` is no longer offered as a data type setting (see section 2.2) - it would have been a no-op.

Two small deliberate changes:

- Unchecking "Alle" in the allowed-types configuration now pre-selects every type instead of leaving the list
  empty. An empty list means "all", so the old behaviour made unchecking the box a no-op.
- Article content shown in the modal comes back as plain HTML now. The Umbraco 13 server injected a
  `prevent-default` attribute into every `<a>` for AngularJS; the modal instead swallows anchor clicks in a single
  event handler, so the server no longer rewrites the markup.

### 3.4 Building the client

```bash
cd src/Limbo.Umbraco.BorgerDk/Client
npm install
npm run build      # tsc --noEmit && vite build → ../wwwroot/dist
npm run watch      # rebuild on change
```

`wwwroot/dist` **is committed**, so `dotnet build` and `dotnet pack` work without Node installed. Re-run
`npm run build` and commit the output whenever anything under `Client/src` changes - the chunk filenames are
content-hashed, so the diff will touch several files.

`Client/node_modules` is git-ignored; `Client/` as a whole is excluded from the csproj and never ends up in the
NuGet package.

---

## 4. Verification

- `dotnet build src/Limbo.Umbraco.BorgerDk.sln` - succeeds with **no compiler warnings**.
- `dotnet pack -c Release` - produces `Limbo.Umbraco.BorgerDk.17.0.0-alpha000.nupkg`, targeting `net10.0`, with the
  dependency ranges listed in section 1 and the client bundle under `staticwebassets/dist`.
- `npm run build` in `Client/` - `tsc --noEmit` clean, Vite emits the bundle.
- `BorgerDkHtmlSanitizer` was exercised against 14 inputs (script/iframe/form/svg elements, `on*` attributes,
  obfuscated `javascript:` and `data:text/html` URLs, comments, unclosed tags, plain text) and behaved correctly in
  all of them.
- The client was reviewed against the Umbraco 17.5.3 backoffice sources; the two high and the actionable medium
  findings from that review are fixed and folded into this document.

**Not yet done:** the package has not been installed into a running Umbraco 17 site, so nothing here has been
exercised in a browser. Before this leaves alpha it needs a manual pass over the dashboard, the property editor,
both modals and both data type configuration editors on a real instance.

---

## 5. Follow-ups

- Run the package against a real Umbraco 17 site and verify the backoffice end to end.
- Revisit the `NU1605` suppression once `Skybrud.Essentials.Umbraco` has a stable 17 release.
- Consider generating a typed OpenAPI client for the Management API endpoints instead of hand-maintaining
  `Client/src/types.ts` against `Models/Api`.
- The client calls `api/borgerdk.api.ts` directly from the elements rather than going through a repository/data
  source with a context token. That is a knowing deviation from the pattern Umbraco documents - fine at this size,
  but worth revisiting if the client grows.
- Remove the inert `BorgerDkConfiguration.HideLabel` property in the next major version.
- `BorgerDkCache`, `BorgerDkCacheRefresher` and `BorgerDkArticleUpdatedHandler` still contain `Console.WriteLine`
  debug output inherited from the Umbraco 13 version. It was left untouched by this upgrade, but should be moved to
  `ILogger` or removed.
