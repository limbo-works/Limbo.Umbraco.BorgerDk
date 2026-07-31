import { html as o, nothing as D, css as w, property as _, state as A, customElement as E } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement as M } from "@umbraco-cms/backoffice/lit-element";
import { UmbChangeEvent as y } from "@umbraco-cms/backoffice/event";
import { UMB_MODAL_MANAGER_CONTEXT as z } from "@umbraco-cms/backoffice/modal";
import { B } from "./index-DIHERqRy.js";
var C = Object.defineProperty, O = Object.getOwnPropertyDescriptor, g = (e) => {
  throw TypeError(e);
}, p = (e, t, i, a) => {
  for (var r = a > 1 ? void 0 : a ? O(t, i) : t, c = e.length - 1, h; c >= 0; c--)
    (h = e[c]) && (r = (a ? h(t, i, r) : h(r)) || r);
  return a && r && C(t, i, r), r;
}, f = (e, t, i) => t.has(e) || g("Cannot " + i), b = (e, t, i) => (f(e, t, "read from private field"), i ? i.call(e) : t.get(e)), v = (e, t, i) => t.has(e) ? g("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), x = (e, t, i, a) => (f(e, t, "write to private field"), t.set(e, i), i), s = (e, t, i) => (f(e, t, "access private method"), i), m, l, d, k, $, u;
let n = class extends M {
  constructor() {
    super(...arguments), v(this, l), this._config = { municipality: 0, allowedTypes: [] }, v(this, m);
  }
  set config(e) {
    e && (x(this, m, e), this._config = {
      municipality: e.getValueByAlias("municipality") ?? 0,
      allowedTypes: e.getValueByAlias("allowedTypes") ?? []
    });
  }
  get config() {
    return b(this, m);
  }
  render() {
    return this.value ? o`
			<uui-table class="details">
				${s(this, l, u).call(this, "borgerDk_id", o`${this.value.id}`)}
				${s(this, l, u).call(this, "borgerDk_url", o`<a href=${this.value.url} target="_blank" rel="noopener noreferrer">
						${this.value.url} <umb-icon name="icon-out"></umb-icon>
					</a>`)}
				${s(this, l, u).call(this, "borgerDk_title", o`${this.value.title}`)}
				${s(this, l, u).call(this, "borgerDk_teaser", o`${this.value.header}`)}
				${s(this, l, u).call(this, "borgerDk_writtenBy", o`${this.value.byline ?? ""}`)}
				${s(this, l, u).call(this, "borgerDk_selectedContent", o`${b(this, l, $)}`)}
			</uui-table>
			${this.readonly ? D : o`
						<div class="actions">
							<uui-button
								look="secondary"
								label=${this.localize.term("borgerDk_edit")}
								@click=${() => {
      s(this, l, d).call(this);
    }}></uui-button>
							<uui-button
								look="secondary"
								color="danger"
								label=${this.localize.term("borgerDk_reset")}
								@click=${s(this, l, k)}></uui-button>
						</div>
					`}
		` : o`
				<uui-button
					look="placeholder"
					?disabled=${this.readonly}
					label=${this.localize.term("borgerDk_insertArticle")}
					@click=${() => {
      s(this, l, d).call(this);
    }}></uui-button>
			`;
  }
};
m = /* @__PURE__ */ new WeakMap();
l = /* @__PURE__ */ new WeakSet();
d = async function() {
  const e = await this.getContext(z);
  if (!e) return;
  const t = e.open(this, B, {
    data: { value: this.value, config: this._config }
  });
  try {
    this.value = await t.onSubmit(), this.dispatchEvent(new y());
  } catch {
  }
};
k = function() {
  this.value = void 0, this.dispatchEvent(new y());
};
$ = function() {
  const e = this.value?.selection ?? [];
  if (!e.length) return "";
  let t = !1, i = 0, a = 0;
  for (const h of e)
    h === "kernetekst" ? t = !0 : h.length === 36 ? i++ : a++;
  const r = [];
  t ? r.push(this.localize.term("borgerDk_summaryAllMicroArticles")) : i === 1 ? r.push(this.localize.term("borgerDk_summaryOneMicroArticle")) : i > 1 && r.push(`${i} ${this.localize.term("borgerDk_summaryManyMicroArticles")}`), a === 1 ? r.push(this.localize.term("borgerDk_summaryOneBox")) : a > 1 && r.push(`${a} ${this.localize.term("borgerDk_summaryManyBoxes")}`);
  const c = r.join(this.localize.term("borgerDk_summaryAnd"));
  return c ? c.charAt(0).toUpperCase() + c.slice(1) : "";
};
u = function(e, t) {
  return o`
			<uui-table-row>
				<uui-table-cell class="label">${this.localize.term(e)}</uui-table-cell>
				<uui-table-cell>${t}</uui-table-cell>
			</uui-table-row>
		`;
};
n.styles = [
  w`
			.details {
				width: 100%;
			}

			.details .label {
				width: 160px;
				font-weight: bold;
			}

			.actions {
				display: flex;
				gap: var(--uui-size-space-2);
				margin-top: var(--uui-size-space-3);
			}
		`
];
p([
  _({ type: Object })
], n.prototype, "value", 2);
p([
  _({ type: Boolean })
], n.prototype, "readonly", 2);
p([
  A()
], n.prototype, "_config", 2);
p([
  _({ attribute: !1 })
], n.prototype, "config", 1);
n = p([
  E("limbo-borgerdk-property-editor-ui")
], n);
const S = n;
export {
  n as LimboBorgerDkPropertyEditorUiElement,
  S as default
};
//# sourceMappingURL=property-editor-ui.element-C4f7fzPu.js.map
