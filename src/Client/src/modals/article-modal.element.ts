import { css, customElement, html, nothing, property, repeat, state, unsafeHTML } from '@umbraco-cms/backoffice/external/lit';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';
import { UMB_MODAL_MANAGER_CONTEXT } from '@umbraco-cms/backoffice/modal';
import type { UmbModalContext, UmbModalExtensionElement } from '@umbraco-cms/backoffice/modal';
import { getArticleByUrl } from '../api/borgerdk.api.js';
import { formatUnixDate } from '../utils/format.js';
import type { BorgerDkArticle, BorgerDkElement, BorgerDkPropertyValue } from '../types.js';
import { BORGERDK_SEARCH_MODAL } from './tokens.js';
import type { BorgerDkArticleModalData, BorgerDkArticleModalValue } from './tokens.js';

/**
 * Replaces the AngularJS `Overlay.html` view. The editor pastes (or searches for) the URL of a Borger.dk article,
 * and picks the elements of that article that should be rendered.
 *
 * Looking up an article also imports it into the local database on the server, which is how articles end up being
 * covered by the scheduled import in the first place.
 */
@customElement('limbo-borgerdk-article-modal')
export class LimboBorgerDkArticleModalElement
	extends UmbLitElement
	implements UmbModalExtensionElement<BorgerDkArticleModalData, BorgerDkArticleModalValue>
{
	@property({ attribute: false })
	modalContext?: UmbModalContext<BorgerDkArticleModalData, BorgerDkArticleModalValue>;

	@property({ attribute: false })
	data?: BorgerDkArticleModalData;

	@state()
	private _url = '';

	@state()
	private _article?: BorgerDkArticle;

	@state()
	private _elements: Array<BorgerDkElement> = [];

	@state()
	private _selection: Array<string> = [];

	@state()
	private _expanded: Array<string> = [];

	@state()
	private _loading = false;

	@state()
	private _error?: string;

	#debounce?: ReturnType<typeof setTimeout>;
	#initialized = false;

	/**
	 * The ID of the article `_selection` belongs to.
	 *
	 * [CHANGE: this used to track the URL and compare it against the URL the server returned, which are two
	 * different things - a stored "www.borger.dk/..." against a canonical "borger.dk/..." would silently wipe the
	 * editor's selection every time the modal opened. The AngularJS version compared article IDs, so do we.]
	 * Related: BorgerDkHtmlSanitizer.cs, PropertyEditors/BorgerDkValueConverter.cs,
	 * Scheduling/BorgerDkImportTask.cs, Client/src/modals/search-modal.element.ts
	 */
	#selectionArticleId?: number;

	/** Incremented per lookup so a slow response can't overwrite the result of a newer one. */
	#requestId = 0;

	/**
	 * `data` is assigned by the modal host, and there is no guarantee it is set before the element connects - so
	 * the initial lookup is kicked off the first time we actually see it.
	 */
	override willUpdate(changed: Map<string, unknown>) {
		super.willUpdate(changed);

		if (this.#initialized || !this.data) return;
		this.#initialized = true;

		const value = this.data.value;
		if (!value?.url) return;

		this._url = value.url;
		this._selection = [...(value.selection ?? [])];
		this.#selectionArticleId = value.id;

		void this.#load();
	}

	override disconnectedCallback() {
		super.disconnectedCallback();
		if (this.#debounce) clearTimeout(this.#debounce);
	}

	get #municipality(): number {
		return this.data?.config?.municipality ?? 0;
	}

	get #allowedTypes(): Array<string> {
		return this.data?.config?.allowedTypes ?? [];
	}

	get #isValidUrl(): boolean {
		// A naive "includes('borger.dk')" would also accept hosts such as "notborger.dk", so the host is parsed out
		try {
			const host = new URL(this._url).hostname.toLowerCase();
			return host === 'borger.dk' || host.endsWith('.borger.dk');
		} catch {
			return false;
		}
	}

	#onUrlInput(event: Event) {
		this._url = (event.target as HTMLInputElement).value;

		if (this.#debounce) clearTimeout(this.#debounce);

		if (!this.#isValidUrl) {
			this.#reset();
			return;
		}

		// Add a small delay so we don't call the API on each keystroke
		this.#debounce = setTimeout(() => void this.#load(), 300);
	}

	#reset() {
		this._article = undefined;
		this._elements = [];
		this._selection = [];
		this.#selectionArticleId = undefined;
		this._error = undefined;
	}

	/**
	 * Looks the article up. The current selection is kept only when the article that comes back is the one the
	 * selection belongs to, compared by article ID - the URL the editor typed and the URL Borger.dk considers
	 * canonical are not necessarily the same string.
	 */
	async #load() {
		if (!this.#isValidUrl) return;

		const requestId = ++this.#requestId;

		this._loading = true;
		this._error = undefined;

		const { data, error } = await getArticleByUrl(this._url, this.#municipality);

		// A newer lookup was started while this one was in flight, so its result is the one that counts
		if (requestId !== this.#requestId) return;

		this._loading = false;

		if (error || !data) {
			this._error = error ?? this.localize.term('borgerDk_articleNotFound');
			this._article = undefined;
			this._elements = [];
			return;
		}

		if (this.#selectionArticleId !== data.id) this._selection = [];
		this.#selectionArticleId = data.id;

		this._article = data;

		// An empty "allowedTypes" means every type is allowed
		const allowed = this.#allowedTypes;
		this._elements = allowed.length ? data.elements.filter((x) => allowed.includes(x.id)) : data.elements;
	}

	async #openSearch() {
		const modalManager = await this.getContext(UMB_MODAL_MANAGER_CONTEXT);
		if (!modalManager) return;

		const modal = modalManager.open(this, BORGERDK_SEARCH_MODAL);

		try {
			const { article } = await modal.onSubmit();
			this._url = article.url;
			this._selection = [];
			this.#selectionArticleId = undefined;
			await this.#load();
		} catch {
			// The editor closed the search without picking an article
		}
	}

	#isSelected(id: string): boolean {
		return this._selection.includes(id);
	}

	/**
	 * Selecting the "kernetekst" block selects every micro article of it, which is why the micro article toggles
	 * are disabled - and rendered as checked - while the block itself is selected.
	 */
	#isMicroArticleSelected(blockId: string, microId: string): boolean {
		return this.#isSelected(blockId) || this.#isSelected(microId);
	}

	#toggle(id: string) {
		this._selection = this.#isSelected(id)
			? this._selection.filter((x) => x !== id)
			: [...this._selection, id];
	}

	#toggleExpanded(id: string) {
		this._expanded = this._expanded.includes(id)
			? this._expanded.filter((x) => x !== id)
			: [...this._expanded, id];
	}

	/**
	 * Article content is HTML from Borger.dk and may contain links. Following one would navigate away from the
	 * backoffice, so clicks on anchors are swallowed - the AngularJS version did the same through a
	 * `prevent-default` attribute injected server side.
	 *
	 * The markup itself is rendered with `unsafeHTML`, which is only safe because `BorgerDkHtmlSanitizer` strips
	 * scriptable elements, inline event handlers and script URLs before the server hands it over.
	 */
	#onContentClick(event: Event) {
		const anchor = (event.target as HTMLElement)?.closest('a');
		if (anchor) event.preventDefault();
	}

	#submit() {
		if (!this._article || !this._selection.length) return;

		const value: BorgerDkPropertyValue = {
			id: this._article.id,
			url: this._url,
			domain: this._article.domain,
			municipality: this._article.municipality,
			title: this._article.title,
			header: this._article.header,
			byline: this._article.byline,
			selection: this._selection,
		};

		this.modalContext?.setValue(value);
		this.modalContext?.submit();
	}

	override render() {
		return html`
			<umb-body-layout headline=${this.localize.term('borgerDk_insertArticle')}>
				<uui-box>
					<umb-property-layout label=${this.localize.term('borgerDk_articleUrl')}>
						<div slot="editor" class="url">
							<uui-input
								type="url"
								.value=${this._url}
								label=${this.localize.term('borgerDk_articleUrl')}
								placeholder=${this.localize.term('borgerDk_articleUrlPlaceholder')}
								@input=${this.#onUrlInput}></uui-input>
							<uui-button
								look="outline"
								?disabled=${!this.#isValidUrl}
								label=${this.localize.term('borgerDk_reload')}
								title=${this.localize.term('borgerDk_reload')}
								@click=${() => void this.#load()}>
								<umb-icon name="icon-refresh"></umb-icon>
							</uui-button>
							<uui-button
								look="outline"
								label=${this.localize.term('borgerDk_searchForArticle')}
								@click=${() => void this.#openSearch()}>
								<umb-icon name="icon-search"></umb-icon>
								${this.localize.term('borgerDk_searchForArticle')}
							</uui-button>
						</div>
					</umb-property-layout>
					${this._error ? html`<div class="error">${this._error}</div>` : nothing}
					${this._loading ? html`<uui-loader></uui-loader>` : nothing}
					${this._article ? this.#renderArticle(this._article) : nothing}
				</uui-box>
				<div slot="actions">
					<uui-button
						label=${this.localize.term('general_close')}
						@click=${() => this.modalContext?.reject()}></uui-button>
					<uui-button
						look="primary"
						color="positive"
						?disabled=${!this._article || !this._selection.length}
						label=${this.localize.term('general_submit')}
						@click=${this.#submit}></uui-button>
				</div>
			</umb-body-layout>
		`;
	}

	#renderArticle(article: BorgerDkArticle) {
		return html`
			<h4>${this.localize.term('borgerDk_article')}</h4>
			<uui-table class="details">
				${this.#renderDetail('borgerDk_id', String(article.id))}
				${this.#renderDetail('borgerDk_published', formatUnixDate(article.publishDate))}
				${this.#renderDetail('borgerDk_updated', formatUnixDate(article.updateDate))}
				${this.#renderDetail('borgerDk_title', article.title)}
				${this.#renderDetail('borgerDk_teaser', article.header)}
				${this.#renderDetail('borgerDk_writtenBy', article.byline ?? '')}
			</uui-table>

			<h4>${this.localize.term('borgerDk_selectContent')}</h4>
			<div class="elements">
				${repeat(
					this._elements,
					(element) => element.id,
					(element) => (element.microArticles ? this.#renderBlock(element) : this.#renderTextElement(element)),
				)}
			</div>
		`;
	}

	#renderDetail(labelKey: string, value: string) {
		return html`
			<uui-table-row>
				<uui-table-cell class="label">${this.localize.term(labelKey)}</uui-table-cell>
				<uui-table-cell>${value}</uui-table-cell>
			</uui-table-row>
		`;
	}

	#renderBlock(element: BorgerDkElement) {
		return html`
			<div class="element">
				<uui-toggle
					label=${this.localize.term('borgerDk_microArticles')}
					.checked=${this.#isSelected(element.id)}
					@change=${() => this.#toggle(element.id)}>
					${this.localize.term('borgerDk_microArticles')}
				</uui-toggle>
			</div>
			${repeat(
				element.microArticles ?? [],
				(micro) => micro.id,
				(micro) => html`
					<div class="element micro">
						<div class="element-title">
							<uui-toggle
								label=${micro.title}
								?disabled=${this.#isSelected(element.id)}
								.checked=${this.#isMicroArticleSelected(element.id, micro.id)}
								@change=${() => this.#toggle(micro.id)}>
								${micro.title}
							</uui-toggle>
							<uui-button
								compact
								look="default"
								label=${this.localize.term(
									this._expanded.includes(micro.id) ? 'borgerDk_hideContent' : 'borgerDk_showContent',
								)}
								@click=${() => this.#toggleExpanded(micro.id)}></uui-button>
						</div>
						${this._expanded.includes(micro.id)
							? html`<div class="element-content" @click=${this.#onContentClick}>
									${unsafeHTML(micro.content)}
								</div>`
							: nothing}
					</div>
				`,
			)}
		`;
	}

	#renderTextElement(element: BorgerDkElement) {
		return html`
			<div class="element">
				<div class="element-title">
					<uui-toggle
						label=${element.title}
						.checked=${this.#isSelected(element.id)}
						@change=${() => this.#toggle(element.id)}>
						${element.title} <span class="element-id">(${element.id})</span>
					</uui-toggle>
					<uui-button
						compact
						look="default"
						label=${this.localize.term(
							this._expanded.includes(element.id) ? 'borgerDk_hideContent' : 'borgerDk_showContent',
						)}
						@click=${() => this.#toggleExpanded(element.id)}></uui-button>
				</div>
				${this._expanded.includes(element.id)
					? html`<div class="element-content" @click=${this.#onContentClick}>
							${unsafeHTML(element.content ?? '')}
						</div>`
					: nothing}
			</div>
		`;
	}

	static override styles = [
		css`
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
		`,
	];
}

export default LimboBorgerDkArticleModalElement;

declare global {
	interface HTMLElementTagNameMap {
		'limbo-borgerdk-article-modal': LimboBorgerDkArticleModalElement;
	}
}
