import { umbHttpClient } from '@umbraco-cms/backoffice/http-client';
import { BORGERDK_API_BASE } from '../constants.js';
import type { BorgerDkArticle, BorgerDkArticleListItem, BorgerDkImportTask } from '../types.js';

/**
 * Result of a call to the Borger.dk Management API. `error` holds a message suitable for showing to the editor -
 * the server returns problem details whose `detail` field carries the Danish message for the errors an editor can
 * actually act on.
 */
export interface BorgerDkApiResult<T> {
	data?: T;
	error?: string;
}

const security = [{ type: 'http', scheme: 'bearer' }] as const;

async function request<T>(
	method: 'get' | 'post',
	url: string,
	query?: Record<string, string | number | undefined>,
): Promise<BorgerDkApiResult<T>> {
	try {
		// "umbHttpClient" is configured with "throwOnError", so failures surface as exceptions rather than as an
		// "error" on the result.
		const { data } = await umbHttpClient[method]<T>({
			url,
			query,
			security: [...security],
		});

		return { data: data as T };
	} catch (err) {
		return { error: toMessage(err) };
	}
}

function toMessage(error: unknown): string {
	if (typeof error === 'string' && error.length) return error;
	if (error && typeof error === 'object') {
		const candidate = error as { detail?: string; title?: string; message?: string };
		return candidate.detail ?? candidate.title ?? candidate.message ?? 'Der skete en fejl i kaldet til Borger.dk.';
	}
	return 'Der skete en fejl i kaldet til Borger.dk.';
}

/** Runs a new import from the Borger.dk web services. */
export function runImport(): Promise<BorgerDkApiResult<BorgerDkImportTask>> {
	return request<BorgerDkImportTask>('post', `${BORGERDK_API_BASE}/import`);
}

/** Returns the articles of an endpoint, optionally filtered by `text`. */
export function getArticles(text?: string, domain?: string): Promise<BorgerDkApiResult<Array<BorgerDkArticleListItem>>> {
	return request<Array<BorgerDkArticleListItem>>('get', `${BORGERDK_API_BASE}/articles`, {
		text: text || undefined,
		domain: domain || undefined,
	});
}

/** Looks up - and imports - the article with the specified `url`. */
export function getArticleByUrl(url: string, municipality: number): Promise<BorgerDkApiResult<BorgerDkArticle>> {
	return request<BorgerDkArticle>('get', `${BORGERDK_API_BASE}/article`, { url, municipality });
}
