import { css, customElement, html, nothing, property, state } from '@umbraco-cms/backoffice/external/lit';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';
import { UmbChangeEvent } from '@umbraco-cms/backoffice/event';
import { UMB_MODAL_MANAGER_CONTEXT } from '@umbraco-cms/backoffice/modal';
import type { UmbPropertyEditorConfigCollection, UmbPropertyEditorUiElement } from '@umbraco-cms/backoffice/property-editor';
import { BORGERDK_ARTICLE_MODAL } from '../modals/tokens.js';
import type { BorgerDkPropertyConfig, BorgerDkPropertyValue } from '../types.js';

/**
 * Replaces the AngularJS `Editor.html` view and its controller. Shows a summary of the selected article, and opens
 * the article modal for picking or changing it.
 */
@customElement('limbo-borgerdk-property-editor-ui')
export class LimboBorgerDkPropertyEditorUiElement extends UmbLitElement implements UmbPropertyEditorUiElement {
	@property({ type: Object })
	value?: BorgerDkPropertyValue;

	@property({ type: Boolean })
	readonly?: boolean;

	@state()
	private _config: BorgerDkPropertyConfig = { municipality: 0, allowedTypes: [] };

	#configCollection?: UmbPropertyEditorConfigCollection;

	@property({ attribute: false })
	public set config(config: UmbPropertyEditorConfigCollection | undefined) {
		if (!config) return;
		this.#configCollection = config;
		this._config = {
			municipality: config.getValueByAlias<number>('municipality') ?? 0,
			allowedTypes: config.getValueByAlias<Array<string>>('allowedTypes') ?? [],
		};
	}

	public get config(): UmbPropertyEditorConfigCollection | undefined {
		return this.#configCollection;
	}

	async #edit() {
		const modalManager = await this.getContext(UMB_MODAL_MANAGER_CONTEXT);
		if (!modalManager) return;

		const modal = modalManager.open(this, BORGERDK_ARTICLE_MODAL, {
			data: { value: this.value, config: this._config },
		});

		try {
			this.value = await modal.onSubmit();
			this.dispatchEvent(new UmbChangeEvent());
		} catch {
			// The editor closed the modal without submitting
		}
	}

	#reset() {
		this.value = undefined;
		this.dispatchEvent(new UmbChangeEvent());
	}

	/**
	 * Summarizes the selection the same way the AngularJS controller did: "kernetekst" means every micro article,
	 * a 36 character ID is a single micro article, and anything else is one of the boxes.
	 */
	get #summary(): string {
		const selection = this.value?.selection ?? [];
		if (!selection.length) return '';

		let allMicroArticles = false;
		let microArticles = 0;
		let blocks = 0;

		for (const id of selection) {
			if (id === 'kernetekst') {
				allMicroArticles = true;
			} else if (id.length === 36) {
				microArticles++;
			} else {
				blocks++;
			}
		}

		const parts: Array<string> = [];

		if (allMicroArticles) {
			parts.push(this.localize.term('borgerDk_summaryAllMicroArticles'));
		} else if (microArticles === 1) {
			parts.push(this.localize.term('borgerDk_summaryOneMicroArticle'));
		} else if (microArticles > 1) {
			parts.push(`${microArticles} ${this.localize.term('borgerDk_summaryManyMicroArticles')}`);
		}

		if (blocks === 1) {
			parts.push(this.localize.term('borgerDk_summaryOneBox'));
		} else if (blocks > 1) {
			parts.push(`${blocks} ${this.localize.term('borgerDk_summaryManyBoxes')}`);
		}

		const summary = parts.join(this.localize.term('borgerDk_summaryAnd'));

		return summary ? summary.charAt(0).toUpperCase() + summary.slice(1) : '';
	}

	override render() {
		if (!this.value) {
			return html`
				<uui-button
					look="placeholder"
					?disabled=${this.readonly}
					label=${this.localize.term('borgerDk_insertArticle')}
					@click=${() => void this.#edit()}></uui-button>
			`;
		}

		return html`
			<uui-table class="details">
				${this.#renderDetail('borgerDk_id', html`${this.value.id}`)}
				${this.#renderDetail(
					'borgerDk_url',
					html`<a href=${this.value.url} target="_blank" rel="noopener noreferrer">
						${this.value.url} <umb-icon name="icon-out"></umb-icon>
					</a>`,
				)}
				${this.#renderDetail('borgerDk_title', html`${this.value.title}`)}
				${this.#renderDetail('borgerDk_teaser', html`${this.value.header}`)}
				${this.#renderDetail('borgerDk_writtenBy', html`${this.value.byline ?? ''}`)}
				${this.#renderDetail('borgerDk_selectedContent', html`${this.#summary}`)}
			</uui-table>
			${this.readonly
				? nothing
				: html`
						<div class="actions">
							<uui-button
								look="secondary"
								label=${this.localize.term('borgerDk_edit')}
								@click=${() => void this.#edit()}></uui-button>
							<uui-button
								look="secondary"
								color="danger"
								label=${this.localize.term('borgerDk_reset')}
								@click=${this.#reset}></uui-button>
						</div>
					`}
		`;
	}

	#renderDetail(labelKey: string, value: unknown) {
		return html`
			<uui-table-row>
				<uui-table-cell class="label">${this.localize.term(labelKey)}</uui-table-cell>
				<uui-table-cell>${value}</uui-table-cell>
			</uui-table-row>
		`;
	}

	static override styles = [
		css`
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
		`,
	];
}

export default LimboBorgerDkPropertyEditorUiElement;

declare global {
	interface HTMLElementTagNameMap {
		'limbo-borgerdk-property-editor-ui': LimboBorgerDkPropertyEditorUiElement;
	}
}
