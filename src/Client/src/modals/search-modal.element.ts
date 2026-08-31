import { css, customElement, html, nothing, property, repeat, state } from '@umbraco-cms/backoffice/external/lit';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';
import type { UmbModalContext, UmbModalExtensionElement } from '@umbraco-cms/backoffice/modal';
import { getArticles } from '../api/borgerdk.api.js';
import { formatUnixDate } from '../utils/format.js';
import type { BorgerDkArticleListItem } from '../types.js';
import type { BorgerDkSearchModalValue } from './tokens.js';

/**
 * Replaces the AngularJS `SearchOverlay.html` view. Lists the articles of the default Borger.dk endpoint and lets
 * the editor filter them by title.
 */
@customElement('limbo-borgerdk-search-modal')
export class LimboBorgerDkSearchModalElement
	extends UmbLitElement
	implements UmbModalExtensionElement<never, BorgerDkSearchModalValue>
{
	@property({ attribute: false })
	modalContext?: UmbModalContext<never, BorgerDkSearchModalValue>;

	@state()
	private _articles: Array<BorgerDkArticleListItem> = [];

	@state()
	private _loading = false;

	@state()
	private _error?: string;

	#text = '';
	#debounce?: ReturnType<typeof setTimeout>;

	/**
	 * Incremented per search so a slow response can't overwrite the result of a newer one.
	 *
	 * [CHANGE: debouncing only limits how often a search starts - two searches can still be in flight at once, and
	 * the slower (older) one would otherwise win and leave stale articles on screen]
	 * Related: BorgerDkHtmlSanitizer.cs, PropertyEditors/BorgerDkValueConverter.cs,
	 * Scheduling/BorgerDkImportTask.cs, Client/src/modals/article-modal.element.ts
	 */
	#requestId = 0;

	override firstUpdated() {
		// "connectedCallback" would re-run on every re-attachment to the DOM
		void this.#search();
	}

	override disconnectedCallback() {
		super.disconnectedCallback();
		if (this.#debounce) clearTimeout(this.#debounce);
	}

	async #search() {
		const requestId = ++this.#requestId;

		this._loading = true;
		this._error = undefined;

		const { data, error } = await getArticles(this.#text);

		// A newer search was started while this one was in flight, so its result is the one that counts
		if (requestId !== this.#requestId) return;

		this._articles = data ?? [];
		this._error = error;
		this._loading = false;
	}

	#onInput(event: Event) {
		this.#text = (event.target as HTMLInputElement).value;

		// Add a small delay so we don't call the API on each keystroke
		if (this.#debounce) clearTimeout(this.#debounce);
		this.#debounce = setTimeout(() => void this.#search(), 300);
	}

	#onSelect(article: BorgerDkArticleListItem) {
		this.modalContext?.setValue({ article });
		this.modalContext?.submit();
	}

	override render() {
		return html`
			<umb-body-layout headline=${this.localize.term('borgerDk_insertArticle')}>
				<uui-box>
					<uui-input
						type="search"
						label=${this.localize.term('borgerDk_searchPlaceholder')}
						placeholder=${this.localize.term('borgerDk_searchPlaceholder')}
						@input=${this.#onInput}></uui-input>
					${this._error ? html`<div class="error">${this._error}</div>` : nothing}
					<uui-table>
						<uui-table-head>
							<uui-table-head-cell>${this.localize.term('borgerDk_title')}</uui-table-head-cell>
							<uui-table-head-cell>${this.localize.term('borgerDk_published')}</uui-table-head-cell>
							<uui-table-head-cell>${this.localize.term('borgerDk_updated')}</uui-table-head-cell>
						</uui-table-head>
						${repeat(
							this._articles,
							(article) => article.id,
							(article) => html`
								<uui-table-row>
									<uui-table-cell>
										<uui-button
											compact
											look="default"
											label=${article.title}
											@click=${() => this.#onSelect(article)}></uui-button>
									</uui-table-cell>
									<uui-table-cell>${formatUnixDate(article.publishDate)}</uui-table-cell>
									<uui-table-cell>${formatUnixDate(article.updateDate)}</uui-table-cell>
								</uui-table-row>
							`,
						)}
					</uui-table>
					${this._loading ? html`<uui-loader></uui-loader>` : nothing}
				</uui-box>
				<div slot="actions">
					<uui-button
						label=${this.localize.term('general_close')}
						@click=${() => this.modalContext?.reject()}></uui-button>
				</div>
			</umb-body-layout>
		`;
	}

	static override styles = [
		css`
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
		`,
	];
}

export default LimboBorgerDkSearchModalElement;

declare global {
	interface HTMLElementTagNameMap {
		'limbo-borgerdk-search-modal': LimboBorgerDkSearchModalElement;
	}
}
