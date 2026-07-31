import { css as _, property as k, state as u, customElement as g, nothing as a, html as s, repeat as w } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement as f } from "@umbraco-cms/backoffice/lit-element";
import { r as D } from "./borgerdk.api-BjUO_5xc.js";
var z = Object.defineProperty, C = Object.getOwnPropertyDescriptor, b = (e) => {
  throw TypeError(e);
}, v = (e, t, r, o) => {
  for (var i = o > 1 ? void 0 : o ? C(t, r) : t, l = e.length - 1, n; l >= 0; l--)
    (n = e[l]) && (i = (o ? n(t, r, i) : n(i)) || i);
  return o && i && z(t, r, i), i;
}, E = (e, t, r) => t.has(e) || b("Cannot " + r), P = (e, t, r) => (E(e, t, "read from private field"), r ? r.call(e) : t.get(e)), L = (e, t, r) => t.has(e) ? b("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, r), m, $;
let d = class extends f {
  constructor() {
    super(...arguments), L(this, m);
  }
  willUpdate(e) {
    super.willUpdate(e), e.has("item") && this._expanded === void 0 && this.item && (this._expanded = this.item.type === "Job" || this.item.status !== "Completed");
  }
  render() {
    const e = this.item;
    if (!e) return a;
    const t = P(this, m, $), r = e.items.length > 0;
    return s`
			<li role="listitem">
				<div class="row">
					<div class="icon">
						${t ? s`<umb-icon name=${t.name} style="--uui-icon-color: ${t.color}"></umb-icon>` : a}
					</div>
					<div class="name">
						${e.name}
						${r ? s`<uui-button
									compact
									look="default"
									label=${this.localize.term(this._expanded ? "borgerDk_showLess" : "borgerDk_showMore")}
									@click=${() => this._expanded = !this._expanded}></uui-button>` : a}
						${e.message ? s`<div class="message">${e.message}</div>` : a}
					</div>
					${e.duration != null ? s`<div class="duration">${e.duration.toFixed(2)}s</div>` : a}
				</div>
				${e.exception ? s`
							<div class="exception">
								<strong>${e.exception.type}</strong>
								<div>${e.exception.message}</div>
								${e.exception.stackTrace ? s`<pre>${e.exception.stackTrace}</pre>` : a}
							</div>
						` : a}
				${r && this._expanded ? s`
							<ul role="list">
								${w(
      e.items,
      (o, i) => i,
      (o) => s`<limbo-borgerdk-import-item .item=${o}></limbo-borgerdk-import-item>`
    )}
							</ul>
						` : a}
			</li>
		`;
  }
};
m = /* @__PURE__ */ new WeakSet();
$ = function() {
  switch (this.item?.status) {
    case "Completed":
      switch (this.item.action) {
        case "NotModified":
          return { name: "icon-check", color: "var(--uui-color-disabled-contrast)" };
        case "Rejected":
          return { name: "icon-stop-hand", color: "var(--uui-color-warning-emphasis)" };
        default:
          return { name: "icon-check", color: "var(--uui-color-positive)" };
      }
    case "Pending":
      return { name: "icon-pause", color: "var(--uui-color-disabled-contrast)" };
    case "Failed":
      return { name: "icon-delete", color: "var(--uui-color-danger)" };
    default:
      return;
  }
};
d.styles = [
  _`
			:host {
				display: block;
			}

			ul {
				list-style: none;
				margin: 0;
				padding-left: var(--uui-size-space-5);
			}

			.row {
				display: flex;
				gap: var(--uui-size-space-2);
				align-items: flex-start;
				padding: var(--uui-size-space-1) 0;
			}

			.name {
				flex: 1;
			}

			.message {
				white-space: pre-wrap;
				color: var(--uui-color-text-alt);
				font-size: var(--uui-type-small-size);
			}

			.duration {
				color: var(--uui-color-text-alt);
				font-size: var(--uui-type-small-size);
			}

			.exception {
				border-left: 2px solid var(--uui-color-danger);
				padding-left: var(--uui-size-space-4);
				margin: var(--uui-size-space-2) 0;
			}

			.exception pre {
				overflow-x: auto;
				font-size: var(--uui-type-small-size);
			}
		`
];
v([
  k({ attribute: !1 })
], d.prototype, "item", 2);
v([
  u()
], d.prototype, "_expanded", 2);
d = v([
  g("limbo-borgerdk-import-item")
], d);
var O = Object.defineProperty, I = Object.getOwnPropertyDescriptor, x = (e) => {
  throw TypeError(e);
}, p = (e, t, r, o) => {
  for (var i = o > 1 ? void 0 : o ? I(t, r) : t, l = e.length - 1, n; l >= 0; l--)
    (n = e[l]) && (i = (o ? n(t, r, i) : n(i)) || i);
  return o && i && O(t, r, i), i;
}, B = (e, t, r) => t.has(e) || x("Cannot " + r), S = (e, t, r) => t.has(e) ? x("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, r), T = (e, t, r) => (B(e, t, "access private method"), r), h, y;
let c = class extends f {
  constructor() {
    super(...arguments), S(this, h);
  }
  render() {
    return s`
			<uui-box headline=${this.localize.term("borgerDk_dashboardLabel")}>
					<uui-button
						look="primary"
						color="positive"
						.state=${this._state}
						label=${this.localize.term("borgerDk_startImport")}
						@click=${() => {
      T(this, h, y).call(this);
    }}></uui-button>
					${this._error ? s`<div class="error">${this._error}</div>` : a}
					${this._result ? s`
								<h4>${this.localize.term("borgerDk_importResult")}</h4>
								<ul role="list">
									<limbo-borgerdk-import-item .item=${this._result}></limbo-borgerdk-import-item>
								</ul>
							` : a}
			</uui-box>
		`;
  }
};
h = /* @__PURE__ */ new WeakSet();
y = async function() {
  this._result = void 0, this._error = void 0, this._state = "waiting";
  const { data: e, error: t } = await D();
  if (t || !e) {
    this._error = t ?? this.localize.term("borgerDk_importFailed"), this._state = "failed";
    return;
  }
  this._result = e, this._state = "success";
};
c.styles = [
  _`
			ul {
				list-style: none;
				margin: 0;
				padding: 0;
			}

			.error {
				color: var(--uui-color-danger);
				margin-top: var(--uui-size-space-3);
			}
		`
];
p([
  u()
], c.prototype, "_result", 2);
p([
  u()
], c.prototype, "_state", 2);
p([
  u()
], c.prototype, "_error", 2);
c = p([
  g("limbo-borgerdk-dashboard")
], c);
const U = c;
export {
  c as LimboBorgerDkDashboardElement,
  U as default
};
//# sourceMappingURL=dashboard.element-EaOd1jwX.js.map
