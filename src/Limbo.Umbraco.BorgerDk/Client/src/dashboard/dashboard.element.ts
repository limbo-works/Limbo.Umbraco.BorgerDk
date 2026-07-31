import { css, customElement, html, nothing, state } from '@umbraco-cms/backoffice/external/lit';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';
import { runImport } from '../api/borgerdk.api.js';
import type { BorgerDkImportTask } from '../types.js';
import './import-item.element.js';

/**
 * Replaces the AngularJS `Dashboard.html` view. Lets an editor kick off an import manually and shows the resulting
 * job tree.
 */
@customElement('limbo-borgerdk-dashboard')
export class LimboBorgerDkDashboardElement extends UmbLitElement {
	@state()
	private _result?: BorgerDkImportTask;

	@state()
	private _state?: 'waiting' | 'success' | 'failed';

	@state()
	private _error?: string;

	async #import() {
		this._result = undefined;
		this._error = undefined;
		this._state = 'waiting';

		const { data, error } = await runImport();

		if (error || !data) {
			this._error = error ?? this.localize.term('borgerDk_importFailed');
			this._state = 'failed';
			return;
		}

		this._result = data;
		this._state = 'success';
	}

	override render() {
		return html`
			<uui-box headline=${this.localize.term('borgerDk_dashboardLabel')}>
					<uui-button
						look="primary"
						color="positive"
						.state=${this._state}
						label=${this.localize.term('borgerDk_startImport')}
						@click=${() => void this.#import()}></uui-button>
					${this._error ? html`<div class="error">${this._error}</div>` : nothing}
					${this._result
						? html`
								<h4>${this.localize.term('borgerDk_importResult')}</h4>
								<ul role="list">
									<limbo-borgerdk-import-item .item=${this._result}></limbo-borgerdk-import-item>
								</ul>
							`
						: nothing}
			</uui-box>
		`;
	}

	static override styles = [
		css`
			ul {
				list-style: none;
				margin: 0;
				padding: 0;
			}

			.error {
				color: var(--uui-color-danger);
				margin-top: var(--uui-size-space-3);
			}
		`,
	];
}

export default LimboBorgerDkDashboardElement;

declare global {
	interface HTMLElementTagNameMap {
		'limbo-borgerdk-dashboard': LimboBorgerDkDashboardElement;
	}
}
