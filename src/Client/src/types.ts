/**
 * The models below mirror the API models in `Models/Api` on the server. The package doesn't ship a generated
 * OpenAPI client - generating one requires a running site - so the contract is kept in sync by hand.
 */

export interface BorgerDkMicroArticle {
	id: string;
	title: string;
	content: string;
}

export interface BorgerDkElement {
	id: string;
	title: string;
	content?: string | null;
	microArticles?: Array<BorgerDkMicroArticle> | null;
}

export interface BorgerDkArticle {
	id: number;
	url: string;
	domain: string;
	municipality: number;
	title: string;
	header: string;
	byline?: string | null;
	publishDate: number;
	updateDate: number;
	elements: Array<BorgerDkElement>;
}

export interface BorgerDkArticleListItem {
	id: number;
	url: string;
	title: string;
	publishDate: number;
	updateDate: number;
}

export interface BorgerDkImportException {
	type: string;
	message: string;
	stackTrace?: string | null;
}

export interface BorgerDkImportTask {
	type: string;
	name?: string | null;
	duration?: number | null;
	message?: string | null;
	status: string;
	action: string;
	exception?: BorgerDkImportException | null;
	items: Array<BorgerDkImportTask>;
}

/** The value stored by the property editor. */
export interface BorgerDkPropertyValue {
	id?: number;
	url: string;
	domain?: string;
	municipality?: number;
	title?: string;
	header?: string;
	byline?: string | null;
	selection: Array<string>;
}

/** The data type configuration of the property editor. */
export interface BorgerDkPropertyConfig {
	municipality: number;
	allowedTypes: Array<string>;
}
