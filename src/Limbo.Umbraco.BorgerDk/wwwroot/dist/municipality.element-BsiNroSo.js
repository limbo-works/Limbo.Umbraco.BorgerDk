import { html as v, property as t, customElement as p } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement as b } from "@umbraco-cms/backoffice/lit-element";
import { UmbChangeEvent as h } from "@umbraco-cms/backoffice/event";
const k = [
  { code: 0, name: "Ingen kommune" },
  { code: 580, name: "Aabenraa Kommune" },
  { code: 851, name: "Aalborg Kommune" },
  { code: 751, name: "Aarhus Kommune" },
  { code: 165, name: "Albertslund Kommune" },
  { code: 201, name: "Allerød Kommune" },
  { code: 420, name: "Assens Kommune" },
  { code: 151, name: "Ballerup Kommune" },
  { code: 530, name: "Billund Kommune" },
  { code: 400, name: "Bornholms Regionskommune" },
  { code: 153, name: "Brøndby Kommune" },
  { code: 810, name: "Brønderslev Kommune" },
  { code: 155, name: "Dragør Kommune" },
  { code: 240, name: "Egedal Kommune" },
  { code: 561, name: "Esbjerg Kommune" },
  { code: 430, name: "Faaborg-Midtfyn Kommune" },
  { code: 563, name: "Fanø Kommune" },
  { code: 710, name: "Favrskov Kommune" },
  { code: 320, name: "Faxe Kommune" },
  { code: 210, name: "Fredensborg Kommune" },
  { code: 607, name: "Fredericia Kommune" },
  { code: 147, name: "Frederiksberg Kommune" },
  { code: 813, name: "Frederikshavn Kommune" },
  { code: 250, name: "Frederikssund Kommune" },
  { code: 190, name: "Furesø Kommune" },
  { code: 157, name: "Gentofte Kommune" },
  { code: 159, name: "Gladsaxe Kommune" },
  { code: 161, name: "Glostrup Kommune" },
  { code: 253, name: "Greve Kommune" },
  { code: 270, name: "Gribskov Kommune" },
  { code: 376, name: "Guldborgsund Kommune" },
  { code: 510, name: "Haderslev Kommune" },
  { code: 260, name: "Halsnæs Kommune" },
  { code: 766, name: "Hedensted Kommune" },
  { code: 217, name: "Helsingør Kommune" },
  { code: 163, name: "Herlev Kommune" },
  { code: 657, name: "Herning Kommune" },
  { code: 219, name: "Hillerød Kommune" },
  { code: 860, name: "Hjørring Kommune" },
  { code: 169, name: "Høje-Taastrup Kommune" },
  { code: 316, name: "Holbæk Kommune" },
  { code: 661, name: "Holstebro Kommune" },
  { code: 615, name: "Horsens Kommune" },
  { code: 223, name: "Hørsholm Kommune" },
  { code: 167, name: "Hvidovre Kommune" },
  { code: 756, name: "Ikast-Brande Kommune" },
  { code: 183, name: "Ishøj Kommune" },
  { code: 849, name: "Jammerbugt Kommune" },
  { code: 326, name: "Kalundborg Kommune" },
  { code: 440, name: "Kerteminde Kommune" },
  { code: 101, name: "Københavns Kommune" },
  { code: 259, name: "Køge Kommune" },
  { code: 621, name: "Kolding Kommune" },
  { code: 825, name: "Læsø Kommune" },
  { code: 482, name: "Langeland Kommune" },
  { code: 350, name: "Lejre Kommune" },
  { code: 665, name: "Lemvig Kommune" },
  { code: 360, name: "Lolland Kommune" },
  { code: 173, name: "Lyngby-Taarbæk Kommune" },
  { code: 846, name: "Mariagerfjord Kommune" },
  { code: 410, name: "Middelfart Kommune" },
  { code: 773, name: "Morsø Kommune" },
  { code: 370, name: "Næstved Kommune" },
  { code: 707, name: "Norddjurs Kommune" },
  { code: 480, name: "Nordfyns Kommune" },
  { code: 450, name: "Nyborg Kommune" },
  { code: 727, name: "Odder Kommune" },
  { code: 461, name: "Odense Kommune" },
  { code: 306, name: "Odsherred Kommune" },
  { code: 730, name: "Randers Kommune" },
  { code: 840, name: "Rebild Kommune" },
  { code: 760, name: "Ringkøbing-Skjern Kommune" },
  { code: 329, name: "Ringsted Kommune" },
  { code: 175, name: "Rødovre Kommune" },
  { code: 265, name: "Roskilde Kommune" },
  { code: 230, name: "Rudersdal Kommune" },
  { code: 741, name: "Samsø Kommune" },
  { code: 740, name: "Silkeborg Kommune" },
  { code: 746, name: "Skanderborg Kommune" },
  { code: 779, name: "Skive Kommune" },
  { code: 330, name: "Slagelse Kommune" },
  { code: 269, name: "Solrød Kommune" },
  { code: 540, name: "Sønderborg Kommune" },
  { code: 340, name: "Sorø Kommune" },
  { code: 336, name: "Stevns Kommune" },
  { code: 671, name: "Struer Kommune" },
  { code: 479, name: "Svendborg Kommune" },
  { code: 706, name: "Syddjurs Kommune" },
  { code: 185, name: "Tårnby Kommune" },
  { code: 787, name: "Thisted Kommune" },
  { code: 550, name: "Tønder Kommune" },
  { code: 187, name: "Vallensbæk Kommune" },
  { code: 573, name: "Varde Kommune" },
  { code: 575, name: "Vejen Kommune" },
  { code: 630, name: "Vejle Kommune" },
  { code: 820, name: "Vesthimmerlands Kommune" },
  { code: 791, name: "Viborg Kommune" },
  { code: 390, name: "Vordingborg Kommune" },
  { code: 492, name: "Ærø Kommune" }
];
var _ = Object.defineProperty, f = Object.getOwnPropertyDescriptor, s = (m) => {
  throw TypeError(m);
}, K = (m, e, n, d) => {
  for (var o = d > 1 ? void 0 : d ? f(e, n) : e, u = m.length - 1, c; u >= 0; u--)
    (c = m[u]) && (o = (d ? c(e, n, o) : c(o)) || o);
  return d && o && _(e, n, o), o;
}, l = (m, e, n) => e.has(m) || s("Cannot " + n), y = (m, e, n) => (l(m, e, "read from private field"), n ? n.call(m) : e.get(m)), S = (m, e, n) => e.has(m) ? s("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(m) : e.set(m, n), H = (m, e, n) => (l(m, e, "access private method"), n), r, i, g;
let a = class extends b {
  constructor() {
    super(...arguments), S(this, r);
  }
  render() {
    return v`
			<uui-select
				?disabled=${this.readonly}
				label=${this.localize.term("borgerDk_municipality")}
				.options=${y(this, r, i)}
				@change=${H(this, r, g)}></uui-select>
		`;
  }
};
r = /* @__PURE__ */ new WeakSet();
i = function() {
  const m = this.value ?? 0;
  return k.map((e) => ({
    name: e.name,
    value: String(e.code),
    selected: e.code === m
  }));
};
g = function(m) {
  const e = m.target.value;
  this.value = Number(e ?? 0), this.dispatchEvent(new h());
};
K([
  t({ type: Number })
], a.prototype, "value", 2);
K([
  t({ type: Boolean })
], a.prototype, "readonly", 2);
a = K([
  p("limbo-borgerdk-municipality-picker")
], a);
const F = a;
export {
  a as LimboBorgerDkMunicipalityPickerElement,
  F as default
};
//# sourceMappingURL=municipality.element-BsiNroSo.js.map
