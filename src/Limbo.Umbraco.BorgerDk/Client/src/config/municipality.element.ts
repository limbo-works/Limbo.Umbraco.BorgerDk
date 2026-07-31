import { customElement, html, property } from '@umbraco-cms/backoffice/external/lit';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';
import { UmbChangeEvent } from '@umbraco-cms/backoffice/event';
import type { UmbPropertyEditorUiElement } from '@umbraco-cms/backoffice/property-editor';
import { BORGERDK_MUNICIPALITIES } from '../data/municipalities.js';

/**
 * Replaces the AngularJS `Municipality.html` configuration view. The value is the numeric municipality code, which
 * is what `BorgerDkConfiguration.Municipality` expects on the server.
 */
@customElement('limbo-borgerdk-municipality-picker')
export class LimboBorgerDkMunicipalityPickerElement extends UmbLitElement implements UmbPropertyEditorUiElement {
	@property({ type: Number })
	value?: number;

	@property({ type: Boolean })
	readonly?: boolean;

	get #options(): Array<Option> {
		const selected = this.value ?? 0;
		return BORGERDK_MUNICIPALITIES.map((municipality) => ({
			name: municipality.name,
			value: String(municipality.code),
			selected: municipality.code === selected,
		}));
	}

	#onChange(event: Event) {
		const value = (event.target as HTMLElement & { value?: string }).value;
		this.value = Number(value ?? 0);
		this.dispatchEvent(new UmbChangeEvent());
	}

	override render() {
		return html`
			<uui-select
				?disabled=${this.readonly}
				label=${this.localize.term('borgerDk_municipality')}
				.options=${this.#options}
				@change=${this.#onChange}></uui-select>
		`;
	}
}

export default LimboBorgerDkMunicipalityPickerElement;

declare global {
	interface HTMLElementTagNameMap {
		'limbo-borgerdk-municipality-picker': LimboBorgerDkMunicipalityPickerElement;
	}
}
