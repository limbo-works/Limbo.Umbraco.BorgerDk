import { UmbModalToken } from '@umbraco-cms/backoffice/modal';
import type { BorgerDkArticleListItem, BorgerDkPropertyConfig, BorgerDkPropertyValue } from '../types.js';

export const BORGERDK_ARTICLE_MODAL_ALIAS = 'Limbo.Umbraco.BorgerDk.ArticleModal';
export const BORGERDK_SEARCH_MODAL_ALIAS = 'Limbo.Umbraco.BorgerDk.SearchModal';

export interface BorgerDkArticleModalData {
	value?: BorgerDkPropertyValue;
	config: BorgerDkPropertyConfig;
}

export type BorgerDkArticleModalValue = BorgerDkPropertyValue;

/** Modal for picking a Borger.dk article and the elements of it that should be shown. */
export const BORGERDK_ARTICLE_MODAL = new UmbModalToken<BorgerDkArticleModalData, BorgerDkArticleModalValue>(
	BORGERDK_ARTICLE_MODAL_ALIAS,
	{
		modal: {
			type: 'sidebar',
			size: 'medium',
		},
	},
);

export interface BorgerDkSearchModalValue {
	article: BorgerDkArticleListItem;
}

/** Modal for searching the article list of a Borger.dk endpoint. */
export const BORGERDK_SEARCH_MODAL = new UmbModalToken<never, BorgerDkSearchModalValue>(BORGERDK_SEARCH_MODAL_ALIAS, {
	modal: {
		type: 'sidebar',
		size: 'medium',
	},
});
