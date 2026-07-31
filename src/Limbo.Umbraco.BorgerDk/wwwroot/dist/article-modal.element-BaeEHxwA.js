import { nothing as g, html as c, repeat as E, unsafeHTML as U, css as q, property as T, state as f, customElement as H } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement as V } from "@umbraco-cms/backoffice/lit-element";
import { UMB_MODAL_MANAGER_CONTEXT as K } from "@umbraco-cms/backoffice/modal";
import { g as X } from "./borgerdk.api-BjUO_5xc.js";
import { f as M } from "./format-B9oWei8c.js";
import { a as J } from "./index-DIHERqRy.js";
var Q = Object.defineProperty, Y = Object.getOwnPropertyDescriptor, L = (t) => {
  throw TypeError(t);
}, u = (t, e, s, n) => {
  for (var o = n > 1 ? void 0 : n ? Y(e, s) : e, x = t.length - 1, w; x >= 0; x--)
    (w = t[x]) && (o = (n ? w(e, s, o) : w(o)) || o);
  return n && o && Q(e, s, o), o;
}, z = (t, e, s) => e.has(t) || L("Cannot " + s), r = (t, e, s) => (z(t, e, "read from private field"), s ? s.call(t) : e.get(t)), m = (t, e, s) => e.has(t) ? L("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(t) : e.set(t, s), _ = (t, e, s, n) => (z(t, e, "write to private field"), e.set(t, s), s), l = (t, e, s) => (z(t, e, "access private method"), s), Z = (t, e, s, n) => ({
  set _(o) {
    _(t, e, o);
  },
  get _() {
    return r(t, e, n);
  }
}), d, $, p, k, i, S, B, D, O, W, v, P, b, R, y, C, A, I, F, h, G, N;
let a = class extends V {
  constructor() {
    super(...arguments), m(this, i), this._url = "", this._elements = [], this._selection = [], this._expanded = [], this._loading = !1, m(this, d), m(this, $, !1), m(this, p), m(this, k, 0);
  }
  /**
   * `data` is assigned by the modal host, and there is no guarantee it is set before the element connects - so
   * the initial lookup is kicked off the first time we actually see it.
   */
  willUpdate(t) {
    if (super.willUpdate(t), r(this, $) || !this.data) return;
    _(this, $, !0);
    const e = this.data.value;
    e?.url && (this._url = e.url, this._selection = [...e.selection ?? []], _(this, p, e.id), l(this, i, v).call(this));
  }
  disconnectedCallback() {
    super.disconnectedCallback(), r(this, d) && clearTimeout(r(this, d));
  }
  render() {
    return c`
			<umb-body-layout headline=${this.localize.term("borgerDk_insertArticle")}>
				<uui-box>
					<umb-property-layout label=${this.localize.term("borgerDk_articleUrl")}>
						<div slot="editor" class="url">
							<uui-input
								type="url"
								.value=${this._url}
								label=${this.localize.term("borgerDk_articleUrl")}
								placeholder=${this.localize.term("borgerDk_articleUrlPlaceholder")}
								@input=${l(this, i, O)}></uui-input>
							<uui-button
								look="outline"
								?disabled=${!r(this, i, D)}
								label=${this.localize.term("borgerDk_reload")}
								title=${this.localize.term("borgerDk_reload")}
								@click=${() => {
      l(this, i, v).call(this);
    }}>
								<umb-icon name="icon-refresh"></umb-icon>
							</uui-button>
							<uui-button
								look="outline"
								label=${this.localize.term("borgerDk_searchForArticle")}
								@click=${() => {
      l(this, i, P).call(this);
    }}>
								<umb-icon name="icon-search"></umb-icon>
								${this.localize.term("borgerDk_searchForArticle")}
							</uui-button>
						</div>
					</umb-property-layout>
					${this._error ? c`<div class="error">${this._error}</div>` : g}
					${this._loading ? c`<uui-loader></uui-loader>` : g}
					${this._article ? l(this, i, F).call(this, this._article) : g}
				</uui-box>
				<div slot="actions">
					<uui-button
						label=${this.localize.term("general_close")}
						@click=${() => this.modalContext?.reject()}></uui-button>
					<uui-button
						look="primary"
						color="positive"
						?disabled=${!this._article || !this._selection.length}
						label=${this.localize.term("general_submit")}
						@click=${l(this, i, I)}></uui-button>
				</div>
			</umb-body-layout>
		`;
  }
};
d = /* @__PURE__ */ new WeakMap();
$ = /* @__PURE__ */ new WeakMap();
p = /* @__PURE__ */ new WeakMap();
k = /* @__PURE__ */ new WeakMap();
i = /* @__PURE__ */ new WeakSet();
S = function() {
  return this.data?.config?.municipality ?? 0;
};
B = function() {
  return this.data?.config?.allowedTypes ?? [];
};
D = function() {
  try {
    const t = new URL(this._url).hostname.toLowerCase();
    return t === "borger.dk" || t.endsWith(".borger.dk");
  } catch {
    return !1;
  }
};
O = function(t) {
  if (this._url = t.target.value, r(this, d) && clearTimeout(r(this, d)), !r(this, i, D)) {
    l(this, i, W).call(this);
    return;
  }
  _(this, d, setTimeout(() => {
    l(this, i, v).call(this);
  }, 300));
};
W = function() {
  this._article = void 0, this._elements = [], this._selection = [], _(this, p, void 0), this._error = void 0;
};
v = async function() {
  if (!r(this, i, D)) return;
  const t = ++Z(this, k)._;
  this._loading = !0, this._error = void 0;
  const { data: e, error: s } = await X(this._url, r(this, i, S));
  if (t !== r(this, k)) return;
  if (this._loading = !1, s || !e) {
    this._error = s ?? this.localize.term("borgerDk_articleNotFound"), this._article = void 0, this._elements = [];
    return;
  }
  r(this, p) !== e.id && (this._selection = []), _(this, p, e.id), this._article = e;
  const n = r(this, i, B);
  this._elements = n.length ? e.elements.filter((o) => n.includes(o.id)) : e.elements;
};
P = async function() {
  const t = await this.getContext(K);
  if (!t) return;
  const e = t.open(this, J);
  try {
    const { article: s } = await e.onSubmit();
    this._url = s.url, this._selection = [], _(this, p, void 0), await l(this, i, v).call(this);
  } catch {
  }
};
b = function(t) {
  return this._selection.includes(t);
};
R = function(t, e) {
  return l(this, i, b).call(this, t) || l(this, i, b).call(this, e);
};
y = function(t) {
  this._selection = l(this, i, b).call(this, t) ? this._selection.filter((e) => e !== t) : [...this._selection, t];
};
C = function(t) {
  this._expanded = this._expanded.includes(t) ? this._expanded.filter((e) => e !== t) : [...this._expanded, t];
};
A = function(t) {
  t.target?.closest("a") && t.preventDefault();
};
I = function() {
  if (!this._article || !this._selection.length) return;
  const t = {
    id: this._article.id,
    url: this._url,
    domain: this._article.domain,
    municipality: this._article.municipality,
    title: this._article.title,
    header: this._article.header,
    byline: this._article.byline,
    selection: this._selection
  };
  this.modalContext?.setValue(t), this.modalContext?.submit();
};
F = function(t) {
  return c`
			<h4>${this.localize.term("borgerDk_article")}</h4>
			<uui-table class="details">
				${l(this, i, h).call(this, "borgerDk_id", String(t.id))}
				${l(this, i, h).call(this, "borgerDk_published", M(t.publishDate))}
				${l(this, i, h).call(this, "borgerDk_updated", M(t.updateDate))}
				${l(this, i, h).call(this, "borgerDk_title", t.title)}
				${l(this, i, h).call(this, "borgerDk_teaser", t.header)}
				${l(this, i, h).call(this, "borgerDk_writtenBy", t.byline ?? "")}
			</uui-table>

			<h4>${this.localize.term("borgerDk_selectContent")}</h4>
			<div class="elements">
				${E(
    this._elements,
    (e) => e.id,
    (e) => e.microArticles ? l(this, i, G).call(this, e) : l(this, i, N).call(this, e)
  )}
			</div>
		`;
};
h = function(t, e) {
  return c`
			<uui-table-row>
				<uui-table-cell class="label">${this.localize.term(t)}</uui-table-cell>
				<uui-table-cell>${e}</uui-table-cell>
			</uui-table-row>
		`;
};
G = function(t) {
  return c`
			<div class="element">
				<uui-toggle
					label=${this.localize.term("borgerDk_microArticles")}
					.checked=${l(this, i, b).call(this, t.id)}
					@change=${() => l(this, i, y).call(this, t.id)}>
					${this.localize.term("borgerDk_microArticles")}
				</uui-toggle>
			</div>
			${E(
    t.microArticles ?? [],
    (e) => e.id,
    (e) => c`
					<div class="element micro">
						<div class="element-title">
							<uui-toggle
								label=${e.title}
								?disabled=${l(this, i, b).call(this, t.id)}
								.checked=${l(this, i, R).call(this, t.id, e.id)}
								@change=${() => l(this, i, y).call(this, e.id)}>
								${e.title}
							</uui-toggle>
							<uui-button
								compact
								look="default"
								label=${this.localize.term(
      this._expanded.includes(e.id) ? "borgerDk_hideContent" : "borgerDk_showContent"
    )}
								@click=${() => l(this, i, C).call(this, e.id)}></uui-button>
						</div>
						${this._expanded.includes(e.id) ? c`<div class="element-content" @click=${l(this, i, A)}>
									${U(e.content)}
								</div>` : g}
					</div>
				`
  )}
		`;
};
N = function(t) {
  return c`
			<div class="element">
				<div class="element-title">
					<uui-toggle
						label=${t.title}
						.checked=${l(this, i, b).call(this, t.id)}
						@change=${() => l(this, i, y).call(this, t.id)}>
						${t.title} <span class="element-id">(${t.id})</span>
					</uui-toggle>
					<uui-button
						compact
						look="default"
						label=${this.localize.term(
    this._expanded.includes(t.id) ? "borgerDk_hideContent" : "borgerDk_showContent"
  )}
						@click=${() => l(this, i, C).call(this, t.id)}></uui-button>
				</div>
				${this._expanded.includes(t.id) ? c`<div class="element-content" @click=${l(this, i, A)}>
							${U(t.content ?? "")}
						</div>` : g}
			</div>
		`;
};
a.styles = [
  q`
			.url {
				display: flex;
				gap: var(--uui-size-space-2);
				align-items: center;
			}

			.url uui-input {
				flex: 1;
			}

			.details {
				width: 100%;
				margin-bottom: var(--uui-size-space-4);
			}

			.details .label {
				width: 160px;
				font-weight: bold;
			}

			.elements {
				display: flex;
				flex-direction: column;
				gap: var(--uui-size-space-2);
			}

			.element-title {
				display: flex;
				justify-content: space-between;
				align-items: center;
				gap: var(--uui-size-space-3);
			}

			.element.micro {
				padding-left: var(--uui-size-space-5);
			}

			.element-id {
				color: var(--uui-color-text-alt);
			}

			.element-content {
				border-left: 2px solid var(--uui-color-divider-standalone);
				padding-left: var(--uui-size-space-4);
				margin: var(--uui-size-space-2) 0;
			}

			.error {
				color: var(--uui-color-danger);
				margin: var(--uui-size-space-3) 0;
			}
		`
];
u([
  T({ attribute: !1 })
], a.prototype, "modalContext", 2);
u([
  T({ attribute: !1 })
], a.prototype, "data", 2);
u([
  f()
], a.prototype, "_url", 2);
u([
  f()
], a.prototype, "_article", 2);
u([
  f()
], a.prototype, "_elements", 2);
u([
  f()
], a.prototype, "_selection", 2);
u([
  f()
], a.prototype, "_expanded", 2);
u([
  f()
], a.prototype, "_loading", 2);
u([
  f()
], a.prototype, "_error", 2);
a = u([
  H("limbo-borgerdk-article-modal")
], a);
const rt = a;
export {
  a as LimboBorgerDkArticleModalElement,
  rt as default
};
//# sourceMappingURL=article-modal.element-BaeEHxwA.js.map
