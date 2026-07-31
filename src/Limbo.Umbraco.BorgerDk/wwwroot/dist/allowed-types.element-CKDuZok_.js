import { nothing as _, repeat as E, html as c, css as $, property as y, customElement as x } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement as T } from "@umbraco-cms/backoffice/lit-element";
import { UmbChangeEvent as u } from "@umbraco-cms/backoffice/event";
const d = [
  { alias: "kernetekst", name: "Kernetekst", type: "content", typeName: "mikroartikler" },
  { alias: "selvbetjeningslinks", name: "Selvbetjeningslinks", type: "box", typeName: "infoboks" },
  { alias: "anbefaler", name: "Anbefaler", type: "box", typeName: "infoboks" },
  { alias: "huskeliste", name: "Huskeliste", type: "box", typeName: "infoboks" },
  { alias: "lovgivning", name: "Lovgivning", type: "box", typeName: "infoboks" },
  { alias: "faktaboks", name: "Faktaboks", type: "box", typeName: "infoboks" },
  { alias: "regler", name: "Regler", type: "box", typeName: "infoboks" },
  { alias: "byline", name: "Skrevet af", type: "box", typeName: "byline" }
];
var w = Object.defineProperty, N = Object.getOwnPropertyDescriptor, g = (e) => {
  throw TypeError(e);
}, h = (e, t, a, n) => {
  for (var l = n > 1 ? void 0 : n ? N(t, a) : t, r = e.length - 1, p; r >= 0; r--)
    (p = e[r]) && (l = (n ? p(t, a, l) : p(l)) || l);
  return n && l && w(t, a, l), l;
}, f = (e, t, a) => t.has(e) || g("Cannot " + a), m = (e, t, a) => (f(e, t, "read from private field"), a ? a.call(e) : t.get(e)), D = (e, t, a) => t.has(e) ? g("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, a), v = (e, t, a) => (f(e, t, "access private method"), a), s, o, k, b;
let i = class extends T {
  constructor() {
    super(...arguments), D(this, s);
  }
  render() {
    return c`
			<uui-toggle
				?disabled=${this.readonly}
				.checked=${m(this, s, o)}
				label=${this.localize.term("borgerDk_allTypes")}
				@change=${v(this, s, k)}>
				${this.localize.term("borgerDk_allTypes")}
			</uui-toggle>
			${m(this, s, o) ? _ : c`
						<hr />
						<div class="types">
							${E(
      d,
      (e) => e.alias,
      (e) => c`
									<uui-toggle
										?disabled=${this.readonly}
										.checked=${this.value?.includes(e.alias) ?? !1}
										label=${e.name}
										@change=${() => v(this, s, b).call(this, e.alias)}>
										${e.name} <small>(${e.typeName})</small>
									</uui-toggle>
								`
    )}
						</div>
					`}
		`;
  }
};
s = /* @__PURE__ */ new WeakSet();
o = function() {
  return !this.value?.length;
};
k = function() {
  this.value = m(this, s, o) ? d.map((e) => e.alias) : [], this.dispatchEvent(new u());
};
b = function(e) {
  const t = this.value ?? [];
  this.value = t.includes(e) ? t.filter((a) => a !== e) : [...t, e], this.dispatchEvent(new u());
};
i.styles = [
  $`
			.types {
				display: flex;
				flex-direction: column;
			}

			small {
				color: var(--uui-color-text-alt);
			}
		`
];
h([
  y({ type: Array })
], i.prototype, "value", 2);
h([
  y({ type: Boolean })
], i.prototype, "readonly", 2);
i = h([
  x("limbo-borgerdk-allowed-types-picker")
], i);
const B = i;
export {
  i as LimboBorgerDkAllowedTypesPickerElement,
  B as default
};
//# sourceMappingURL=allowed-types.element-CKDuZok_.js.map
