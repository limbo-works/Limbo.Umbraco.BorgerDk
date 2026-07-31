# Limbo Borger.dk

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/limbo-works/Limbo.Umbraco.BorgerDk/blob/v13/main/LICENSE.md)
[![NuGet](https://img.shields.io/nuget/v/Limbo.Umbraco.BorgerDk.svg)](https://www.nuget.org/packages/Limbo.Umbraco.BorgerDk)
[![NuGet](https://img.shields.io/nuget/dt/Limbo.Umbraco.BorgerDk.svg)](https://www.nuget.org/packages/Limbo.Umbraco.BorgerDk)
[![Limbo.Umbraco.BorgerDk at packages.limbo.works](https://img.shields.io/badge/limbo-packages-blue)](https://packages.limbo.works/limbo.umbraco.borgerdk/)
[![Umbraco Marketplace](https://img.shields.io/badge/umbraco-marketplace-%233544B1)](https://marketplace.umbraco.com/package/limbo.umbraco.borgerdk)

**Limbo.Umbraco.BorgerDk** is an Umbraco package serving as an integration between our [**Limbo.Integrations.BorgerDk**](https://github.com/limbo-works/Limbo.Integrations.BorgerDk) package and Umbraco. This gives editors the option to insert Borger.dk articles as part of their content in their own pages in Umbraco.





<br /><br /><br />

## Installation

### Umbraco 17

Version 17 of this package is built against Umbraco 17 and targets `net10.0`. It is currently an alpha release, and only available via [**NuGet**](https://www.nuget.org/packages/Limbo.Umbraco.BorgerDk). To install the package, you can use either the .NET CLI:

```
dotnet add package Limbo.Umbraco.BorgerDk --version 17.0.0-alpha000
```

or the NuGet Package Manager:

```
Install-Package Limbo.Umbraco.BorgerDk -Version 17.0.0-alpha000
```

### Other versions of Umbraco

- [**`v13/main`**](https://github.com/limbo-works/Limbo.Umbraco.BorgerDk/tree/v13/main) Umbraco 13
- [**`v10/main`**](https://github.com/limbo-works/Limbo.Umbraco.BorgerDk/tree/v10/main) Umbraco 10




<br /><br />

## Upgrading from Umbraco 13

The backoffice UI was rewritten from AngularJS to Lit/TypeScript, the backoffice controller was replaced by
Management API endpoints, and `BorgerDkConfiguration.Municipality` is now an `int`. See
[**documentation/UMBRACO-17-UPGRADE.md**](documentation/UMBRACO-17-UPGRADE.md) for the full recap.





<br /><br />

### Documentation

- [See the documentation at **packages.limbo.works**](https://packages.limbo.works/limbo.umbraco.borgerdk/docs/)
