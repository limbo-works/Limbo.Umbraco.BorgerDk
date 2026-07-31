import { nothing as k, html as h, repeat as C, css as z, property as E, state as f, customElement as M } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement as S } from "@umbraco-cms/backoffice/lit-element";
import { a as P } from "./borgerdk.api-BjUO_5xc.js";
import { f as y } from "./format-B9oWei8c.js";
var W = Object.defineProperty, L = Object.getOwnPropertyDescriptor, D = (e) => {
  throw TypeError(e);
}, c = (e, t, a, s) => {
  for (var i = s > 1 ? void 0 : s ? L(t, a) : t, b = e.length - 1, m; b >= 0; b--)
    (m = e[b]) && (i = (s ? m(t, a, i) : m(i)) || i);
  return s && i && W(t, a, i), i;
}, g = (e, t, a) => t.has(e) || D("Cannot " + a), o = (e, t, a) => (g(e, t, "read from private field"), t.get(e)), n = (e, t, a) => t.has(e) ? D("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, a), v = (e, t, a, s) => (g(e, t, "write to private field"), t.set(e, a), a), d = (e, t, a) => (g(e, t, "access private method"), a), O = (e, t, a, s) => ({
  set _(i) {
    v(e, t, i);
  },
  get _() {
    return o(e, t);
  }
}), _, l, p, u, $, w, x;
let r = class extends S {
  constructor() {
    super(...arguments), n(this, u), this._articles = [], this._loading = !1, n(this, _, ""), n(this, l), n(this, p, 0);
  }
  firstUpdated() {
    d(this, u, $).call(this);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), o(this, l) && clearTimeout(o(this, l));
  }
  render() {
    return h`
			<umb-body-layout headline=${this.localize.term("borgerDk_insertArticle")}>
				<uui-box>
					<uui-input
						type="search"
						label=${this.localize.term("borgerDk_searchPlaceholder")}
						placeholder=${this.localize.term("borgerDk_searchPlaceholder")}
						@input=${d(this, u, w)}></uui-input>
					${this._error ? h`<div class="error">${this._error}</div>` : k}
					<uui-table>
						<uui-table-head>
							<uui-table-head-cell>${this.localize.term("borgerDk_title")}</uui-table-head-cell>
							<uui-table-head-cell>${this.localize.term("borgerDk_published")}</uui-table-head-cell>
							<uui-table-head-cell>${this.localize.term("borgerDk_updated")}</uui-table-head-cell>
						</uui-table-head>
						${C(
      this._articles,
      (e) => e.id,
      (e) => h`
								<uui-table-row>
									<uui-table-cell>
										<uui-button
											compact
											look="default"
											label=${e.title}
											@click=${() => d(this, u, x).call(this, e)}></uui-button>
									</uui-table-cell>
									<uui-table-cell>${y(e.publishDate)}</uui-table-cell>
									<uui-table-cell>${y(e.updateDate)}</uui-table-cell>
								</uui-table-row>
							`
    )}
					</uui-table>
					${this._loading ? h`<uui-loader></uui-loader>` : k}
				</uui-box>
				<div slot="actions">
					<uui-button
						label=${this.localize.term("general_close")}
						@click=${() => this.modalContext?.reject()}></uui-button>
				</div>
			</umb-body-layout>
		`;
  }
};
_ = /* @__PURE__ */ new WeakMap();
l = /* @__PURE__ */ new WeakMap();
p = /* @__PURE__ */ new WeakMap();
u = /* @__PURE__ */ new WeakSet();
$ = async function() {
  const e = ++O(this, p)._;
  this._loading = !0, this._error = void 0;
  const { data: t, error: a } = await P(o(this, _));
  e === o(this, p) && (this._articles = t ?? [], this._error = a, this._loading = !1);
};
w = function(e) {
  v(this, _, e.target.value), o(this, l) && clearTimeout(o(this, l)), v(this, l, setTimeout(() => {
    d(this, u, $).call(this);
  }, 300));
};
x = function(e) {
  this.modalContext?.setValue({ article: e }), this.modalContext?.submit();
};
r.styles = [
  z`
			uui-input {
				width: 100%;
				margin-bottom: var(--uui-size-space-4);
			}

			uui-table {
				width: 100%;
			}

			.error {
				color: var(--uui-color-danger);
				margin-bottom: var(--uui-size-space-4);
			}
		`
];
c([
  E({ attribute: !1 })
], r.prototype, "modalContext", 2);
c([
  f()
], r.prototype, "_articles", 2);
c([
  f()
], r.prototype, "_loading", 2);
c([
  f()
], r.prototype, "_error", 2);
r = c([
  M("limbo-borgerdk-search-modal")
], r);
const U = r;
export {
  r as LimboBorgerDkSearchModalElement,
  U as default
};
//# sourceMappingURL=search-modal.element-DpiysZko.js.map
