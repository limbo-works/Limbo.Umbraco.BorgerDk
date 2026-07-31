import { UmbModalToken as i } from "@umbraco-cms/backoffice/modal";
const n = "Limbo.Umbraco.BorgerDk", p = "Limbo.Umbraco.BorgerDk.PropertyEditorUi", e = "Limbo.Umbraco.BorgerDk.MunicipalityPicker", r = "Limbo.Umbraco.BorgerDk.AllowedTypesPicker", b = "/umbraco/management/api/v1/borgerdk", a = "Limbo.Umbraco.BorgerDk.ArticleModal", t = "Limbo.Umbraco.BorgerDk.SearchModal", d = new i(
  a,
  {
    modal: {
      type: "sidebar",
      size: "medium"
    }
  }
), D = new i(t, {
  modal: {
    type: "sidebar",
    size: "medium"
  }
}), l = [
  {
    type: "propertyEditorUi",
    alias: p,
    name: "Limbo Borger.dk Property Editor UI",
    element: () => import("./property-editor-ui.element-C4f7fzPu.js"),
    meta: {
      label: "#borgerDk_propertyEditorLabel",
      icon: "icon-school",
      group: "pickers",
      propertyEditorSchemaAlias: n,
      supportsReadOnly: !0,
      settings: {
        properties: [
          {
            alias: "municipality",
            label: "#borgerDk_municipality",
            description: "#borgerDk_municipalityDescription",
            propertyEditorUiAlias: e
          },
          {
            alias: "allowedTypes",
            label: "#borgerDk_allowedTypes",
            description: "#borgerDk_allowedTypesDescription",
            propertyEditorUiAlias: r
          }
          // "hideLabel" is intentionally not offered here: Umbraco 14+ moved label hiding to the
          // document type property itself, so a data type level setting would do nothing.
        ]
      }
    }
  },
  {
    type: "propertyEditorUi",
    alias: e,
    name: "Limbo Borger.dk Municipality Picker",
    element: () => import("./municipality.element-BsiNroSo.js"),
    meta: {
      label: "#borgerDk_municipality",
      icon: "icon-map-location",
      group: "pickers"
    }
  },
  {
    type: "propertyEditorUi",
    alias: r,
    name: "Limbo Borger.dk Allowed Types Picker",
    element: () => import("./allowed-types.element-CKDuZok_.js"),
    meta: {
      label: "#borgerDk_allowedTypes",
      icon: "icon-list",
      group: "lists"
    }
  },
  {
    type: "modal",
    alias: a,
    name: "Limbo Borger.dk Article Modal",
    element: () => import("./article-modal.element-BaeEHxwA.js")
  },
  {
    type: "modal",
    alias: t,
    name: "Limbo Borger.dk Search Modal",
    element: () => import("./search-modal.element-DpiysZko.js")
  },
  {
    type: "dashboard",
    alias: "Limbo.Umbraco.BorgerDk.Dashboard",
    name: "Limbo Borger.dk Dashboard",
    element: () => import("./dashboard.element-EaOd1jwX.js"),
    meta: {
      label: "#borgerDk_dashboardLabel",
      pathname: "borgerdk"
    },
    conditions: [
      {
        alias: "Umb.Condition.SectionAlias",
        match: "Umb.Section.Settings"
      }
    ]
  },
  {
    type: "localization",
    alias: "Limbo.Umbraco.BorgerDk.Localization.DaDk",
    name: "Limbo Borger.dk Danish",
    weight: 0,
    meta: {
      // Language-only codes match both the bare language and every regional variant. "da-dk" would match
      // neither the "da" of the core Danish localization nor "da-DK", leaving the keys unresolved.
      culture: "da"
    },
    js: () => import("./da-dk-e81gsAQA.js")
  },
  {
    type: "localization",
    alias: "Limbo.Umbraco.BorgerDk.Localization.EnUs",
    name: "Limbo Borger.dk English",
    weight: 0,
    meta: {
      // "en" is also UMB_DEFAULT_LOCALIZATION_CULTURE, and therefore the fallback dictionary for any other
      // language the backoffice is running in.
      culture: "en"
    },
    js: () => import("./en-us-XzkZgkFy.js")
  }
], g = (m, o) => {
  o.registerMany(l);
}, _ = (m, o) => {
  l.forEach((s) => o.unregister(s.alias));
};
export {
  d as B,
  D as a,
  b,
  _ as c,
  g as o
};
//# sourceMappingURL=index-DIHERqRy.js.map
