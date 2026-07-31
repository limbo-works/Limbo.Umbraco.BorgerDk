# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

`Limbo.Umbraco.BorgerDk` is a single-project Umbraco package (NuGet: `Limbo.Umbraco.BorgerDk`) that wraps the
[`Limbo.Integrations.BorgerDk`](https://github.com/limbo-works/Limbo.Integrations.BorgerDk) client so editors can embed
Borger.dk articles in Umbraco content. There are no tests and no test project.

## Commands

```bash
dotnet build src/Limbo.Umbraco.BorgerDk.sln
dotnet pack  src/Limbo.Umbraco.BorgerDk/Limbo.Umbraco.BorgerDk.csproj -c Release

# Backoffice client (TypeScript/Lit) — NOT run by dotnet build
cd src/Limbo.Umbraco.BorgerDk/Client && npm install && npm run build
```

`npm run build` type-checks and emits the Vite bundle into `wwwroot/dist`, which **is committed** so `dotnet pack`
works without Node. Re-run it and commit the output whenever anything under `Client/src` changes — chunk filenames are
content-hashed, so several files churn per build.

Release version is `VersionPrefix` + `VersionSuffix` (`17.0.0` + `alpha000`) in the csproj, both bumped by hand;
Debug builds append a timestamp to the suffix.

## Branching / versioning

Branches are per-Umbraco-major: `v10/main`, `v13/main`, `v17/dev` (current). Package major version tracks the Umbraco
major. Current code targets `net10.0` / Umbraco `[17.0.0,17.9.9)`. `NU1605` is suppressed in the csproj on purpose —
see `documentation/UMBRACO-17-UPGRADE.md`, which recaps everything that changed in the v13 → v17 port.

## Architecture

Data flows: **Borger.dk SOAP/HTTP web service → local DB table → in-memory cache → published value converter**.

- **`BorgerDkService`** (partial, split over `BorgerDkService.cs` + `BorgerDkService.Import.cs`) is the only thing that
  touches the DB. It uses NPoco directly via `IScopeProvider`/`scope.SqlContext` — not Umbraco's repositories.
  - `Import(BorgerDkArticle)` upserts one article and publishes `BorgerDkArticleUpdatedNotification`.
  - `Import()` (no args) is the full sync: fetch article lists from every `BorgerDkEndpoint`, compare `UpdateDate`
    against rows already in the DB, and re-fetch only the changed ones. **It never inserts new articles** — only
    articles already imported (by an editor picking one in the backoffice) are refreshed.
- **Persistence**: `BorgerDkArticleSchema` defines the table `LimboBorgerDk` (migration renames the legacy
  `SkybrudBorgerDk` table if present); `BorgerDkArticleDto` is the row model. The full article is stored as JSON in the
  `Meta` column — `MetaJson` serializes/deserializes it on property get/set. Primary key is the string
  `{domain}_{municipality}_{articleId}`, produced by `BorgerDkUtils.GetUniqueId` — use that helper everywhere rather
  than reconstructing the format.
- **Cache invalidation across servers**: `BorgerDkService.Import` → `BorgerDkArticleUpdatedNotification` →
  `BorgerDkArticleUpdatedHandler` → `DistributedCache.RefreshByPayload` → Umbraco fans out to every environment's
  `BorgerDkCacheRefresher` → `BorgerDkCache.AddOrUpdate`. `BorgerDkCache` is a singleton dictionary lazily filled from
  the DB; it's the read path for the front-end.
- **`BorgerDkValueConverter`** resolves the stored JSON (`domain`/`municipality`/`id`/`selection`) against
  `BorgerDkCache` and projects the selected elements into `BorgerDkPublishedArticle` + `Models/Published/*`.
  Returns `null` when the article isn't in the cache. Cache level is `Element` because the real caching happens in
  `BorgerDkCache`. Config is read via `propertyType.DataType.ConfigurationAs<BorgerDkConfiguration>()`.
- **Scheduling**: `BorgerDkImportTask` is a `RecurringHostedServiceBase` that ticks every 5 min but only actually
  imports when `ImportInterval` (default 12h) has elapsed since the timestamp it keeps in `IKeyValueService` under
  `Limbo.Umbraco.BorgerDk.ImportTask.LastRun`. `BorgerDkImportTaskSettings` is a mutable DI singleton — consumers
  change the schedule/state from their own composer rather than via appSettings.
- **Registration**: `BorgerDkComposer` wires services, the cache refresher and the notification handler;
  `BorgerDkMigrationComposer` wires `BorgerDkMigrationHandler`, which runs the `MigrationPlan` on
  `UmbracoApplicationStartingNotification`. New migrations must be appended to that plan.

## Backoffice (Umbraco 17, Lit + TypeScript)

`wwwroot/umbraco-package.json` declares **only** the `backofficeEntryPoint`. Every other manifest — the property
editor UI, the two data type configuration UIs, both modals, the dashboard and both localizations — is registered from
`Client/src/manifests.ts`, so add new extensions there, not to the JSON. `StaticWebAssetBasePath` in the csproj maps
`wwwroot` to `/App_Plugins/Limbo.Umbraco.BorgerDk`.

The property editor is split in two: the C# schema (`BorgerDkPropertyEditor`, alias `Limbo.Umbraco.BorgerDk`) and the
UI manifest, whose `meta.settings.properties` supply the labels/descriptions that `ConfigurationFieldAttribute` no
longer carries.

`Client/src/types.ts` is a hand-maintained mirror of the C# models in `Models/Api` — there is no generated OpenAPI
client, so change both sides together.

`BorgerDkApiController` (routed under `/umbraco/management/api/v1/borgerdk/`) is the backoffice API. `GetArticleByUrl`
both looks the article up and imports it — that's how articles first enter the DB. Its error messages are user-facing
Danish strings; keep them Danish, and keep the UI strings in `Client/src/localization/`.

## Conventions

- `src/.editorconfig` governs style: 4-space indent, CRLF, no final newline, file-scoped namespaces, `var` discouraged
  in favour of explicit types (matching the existing code).
- Nullable reference types are enabled and the project emits XML documentation. Public members need `///` docs;
  files/classes that intentionally skip them use `#pragma warning disable 1591` at the top.
- Two serializers coexist: domain/DB/log models use Newtonsoft (`JsonProperty`,
  `Skybrud.Essentials.Json.Newtonsoft`), while anything crossing the Management API (`Models/Api`, and data type
  configuration) must use `System.Text.Json` attributes — Umbraco no longer uses Newtonsoft there.
- There is leftover `Console.WriteLine` debug output in `BorgerDkCache`, `BorgerDkCacheRefresher` and
  `BorgerDkArticleUpdatedHandler`. Don't add more; prefer `ILogger`.
