import { umbHttpClient as o } from "@umbraco-cms/backoffice/http-client";
import { b as n } from "./index-DIHERqRy.js";
const s = [{ type: "http", scheme: "bearer" }];
async function i(t, e, a) {
  try {
    const { data: r } = await o[t]({
      url: e,
      query: a,
      security: [...s]
    });
    return { data: r };
  } catch (r) {
    return { error: c(r) };
  }
}
function c(t) {
  if (typeof t == "string" && t.length) return t;
  if (t && typeof t == "object") {
    const e = t;
    return e.detail ?? e.title ?? e.message ?? "Der skete en fejl i kaldet til Borger.dk.";
  }
  return "Der skete en fejl i kaldet til Borger.dk.";
}
function f() {
  return i("post", `${n}/import`);
}
function d(t, e) {
  return i("get", `${n}/articles`, {
    text: t || void 0,
    domain: void 0
  });
}
function g(t, e) {
  return i("get", `${n}/article`, { url: t, municipality: e });
}
export {
  d as a,
  g,
  f as r
};
//# sourceMappingURL=borgerdk.api-BjUO_5xc.js.map
