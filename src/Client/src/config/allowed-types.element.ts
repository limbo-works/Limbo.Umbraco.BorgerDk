import { css, customElement, html, nothing, property, repeat } from '@umbraco-cms/backoffice/external/lit';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';
import { UmbChangeEvent } from '@umbraco-cms/backoffice/event';
import type { UmbPropertyEditorUiElement } from '@umbraco-cms/backoffice/property-editor';
import { BORGERDK_ELEMENT_TYPES } from '../data/element-types.js';

/**
 * Replaces the AngularJS `AllowedTypes.html` configuration view. An empty value means every element type is
 * allowed, which is why the "all" toggle simply clears the array.
 */
@customElement('limbo-borgerdk-allowed-types-picker')
export class LimboBorgerDkAllowedTypesPickerElement extends UmbLitElement implements UmbPropertyEditorUiElement {
	@property({ type: Array })
	value?: Array<string>;

	@property({ type: Boolean })
	readonly?: boolean;

	get #all(): boolean {
		return !this.value?.length;
	}

	#onToggleAll() {
		// Going from "all" to a specific selection starts out with every type selected, so the editor can uncheck
		// the ones they don't want rather than having to check everything.
		this.value = this.#all ? BORGERDK_ELEMENT_TYPES.map((x) => x.alias) : [];
		this.dispatchEvent(new UmbChangeEvent());
	}

	#onToggleType(alias: string) {
		const current = this.value ?? [];
		this.value = current.includes(alias) ? current.filter((x) => x !== alias) : [...current, alias];
		this.dispatchEvent(new UmbChangeEvent());
	}

	override render() {
		return html`
			<uui-toggle
				?disabled=${this.readonly}
				.checked=${this.#all}
				label=${this.localize.term('borgerDk_allTypes')}
				@change=${this.#onToggleAll}>
				${this.localize.term('borgerDk_allTypes')}
			</uui-toggle>
			${this.#all
				? nothing
				: html`
						<hr />
						<div class="types">
							${repeat(
								BORGERDK_ELEMENT_TYPES,
								(type) => type.alias,
								(type) => html`
									<uui-toggle
										?disabled=${this.readonly}
										.checked=${this.value?.includes(type.alias) ?? false}
										label=${type.name}
										@change=${() => this.#onToggleType(type.alias)}>
										${type.name} <small>(${type.typeName})</small>
									</uui-toggle>
								`,
							)}
						</div>
					`}
		`;
	}

	static override styles = [
		css`
			.types {
				display: flex;
				flex-direction: column;
			}

			small {
				color: var(--uui-color-text-alt);
			}
		`,
	];
}

export default LimboBorgerDkAllowedTypesPickerElement;

declare global {
	interface HTMLElementTagNameMap {
		'limbo-borgerdk-allowed-types-picker': LimboBorgerDkAllowedTypesPickerElement;
	}
}
