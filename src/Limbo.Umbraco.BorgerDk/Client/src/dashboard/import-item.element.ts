import { css, customElement, html, nothing, property, repeat, state } from '@umbraco-cms/backoffice/external/lit';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';
import type { BorgerDkImportTask } from '../types.js';

/**
 * Replaces the AngularJS `limboBorgerdkItem` directive. Renders one node of the import result tree, and recurses
 * into its children.
 */
@customElement('limbo-borgerdk-import-item')
export class LimboBorgerDkImportItemElement extends UmbLitElement {
	@property({ attribute: false })
	item?: BorgerDkImportTask;

	@state()
	private _expanded?: boolean;

	override willUpdate(changed: Map<string, unknown>) {
		super.willUpdate(changed);

		// Jobs, and anything that didn't complete cleanly, start out expanded - the same defaults the AngularJS
		// directive used.
		if (changed.has('item') && this._expanded === undefined && this.item) {
			this._expanded = this.item.type === 'Job' || this.item.status !== 'Completed';
		}
	}

	get #icon(): { name: string; color: string } | undefined {
		switch (this.item?.status) {
			case 'Completed':
				switch (this.item.action) {
					case 'NotModified':
						return { name: 'icon-check', color: 'var(--uui-color-disabled-contrast)' };
					case 'Rejected':
						return { name: 'icon-stop-hand', color: 'var(--uui-color-warning-emphasis)' };
					default:
						return { name: 'icon-check', color: 'var(--uui-color-positive)' };
				}
			case 'Pending':
				return { name: 'icon-pause', color: 'var(--uui-color-disabled-contrast)' };
			case 'Failed':
				return { name: 'icon-delete', color: 'var(--uui-color-danger)' };
			default:
				return undefined;
		}
	}

	override render() {
		const item = this.item;
		if (!item) return nothing;

		const icon = this.#icon;
		const hasChildren = item.items.length > 0;

		return html`
			<li role="listitem">
				<div class="row">
					<div class="icon">
						${icon
							? html`<umb-icon name=${icon.name} style="--uui-icon-color: ${icon.color}"></umb-icon>`
							: nothing}
					</div>
					<div class="name">
						${item.name}
						${hasChildren
							? html`<uui-button
									compact
									look="default"
									label=${this.localize.term(this._expanded ? 'borgerDk_showLess' : 'borgerDk_showMore')}
									@click=${() => (this._expanded = !this._expanded)}></uui-button>`
							: nothing}
						${item.message ? html`<div class="message">${item.message}</div>` : nothing}
					</div>
					${item.duration != null
						? html`<div class="duration">${item.duration.toFixed(2)}s</div>`
						: nothing}
				</div>
				${item.exception
					? html`
							<div class="exception">
								<strong>${item.exception.type}</strong>
								<div>${item.exception.message}</div>
								${item.exception.stackTrace
									? html`<pre>${item.exception.stackTrace}</pre>`
									: nothing}
							</div>
						`
					: nothing}
				${hasChildren && this._expanded
					? html`
							<ul role="list">
								${repeat(
									item.items,
									(_child, index) => index,
									(child) => html`<limbo-borgerdk-import-item .item=${child}></limbo-borgerdk-import-item>`,
								)}
							</ul>
						`
					: nothing}
			</li>
		`;
	}

	static override styles = [
		css`
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
		`,
	];
}

export default LimboBorgerDkImportItemElement;

declare global {
	interface HTMLElementTagNameMap {
		'limbo-borgerdk-import-item': LimboBorgerDkImportItemElement;
	}
}
