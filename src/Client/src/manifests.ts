import {
	BORGERDK_ALLOWED_TYPES_UI_ALIAS,
	BORGERDK_MUNICIPALITY_UI_ALIAS,
	BORGERDK_PROPERTY_EDITOR_SCHEMA_ALIAS,
	BORGERDK_PROPERTY_EDITOR_UI_ALIAS,
} from './constants.js';
import { BORGERDK_ARTICLE_MODAL_ALIAS, BORGERDK_SEARCH_MODAL_ALIAS } from './modals/tokens.js';

/**
 * Every extension of this package is registered from the backoffice entry point rather than being listed in
 * `umbraco-package.json`. That keeps the manifests type checked, and lets the elements be lazy loaded.
 */
export const manifests: Array<UmbExtensionManifest> = [
	{
		type: 'propertyEditorUi',
		alias: BORGERDK_PROPERTY_EDITOR_UI_ALIAS,
		name: 'Limbo Borger.dk Property Editor UI',
		element: () => import('./property-editor/property-editor-ui.element.js'),
		meta: {
			label: '#borgerDk_propertyEditorLabel',
			icon: 'icon-school',
			group: 'pickers',
			propertyEditorSchemaAlias: BORGERDK_PROPERTY_EDITOR_SCHEMA_ALIAS,
			supportsReadOnly: true,
			settings: {
				properties: [
					{
						alias: 'municipality',
						label: '#borgerDk_municipality',
						description: '#borgerDk_municipalityDescription',
						propertyEditorUiAlias: BORGERDK_MUNICIPALITY_UI_ALIAS,
					},
					{
						alias: 'allowedTypes',
						label: '#borgerDk_allowedTypes',
						description: '#borgerDk_allowedTypesDescription',
						propertyEditorUiAlias: BORGERDK_ALLOWED_TYPES_UI_ALIAS,
					},
					// "hideLabel" is intentionally not offered here: Umbraco 14+ moved label hiding to the
					// document type property itself, so a data type level setting would do nothing.
				],
			},
		},
	},
	{
		type: 'propertyEditorUi',
		alias: BORGERDK_MUNICIPALITY_UI_ALIAS,
		name: 'Limbo Borger.dk Municipality Picker',
		element: () => import('./config/municipality.element.js'),
		meta: {
			label: '#borgerDk_municipality',
			icon: 'icon-map-location',
			group: 'pickers',
		},
	},
	{
		type: 'propertyEditorUi',
		alias: BORGERDK_ALLOWED_TYPES_UI_ALIAS,
		name: 'Limbo Borger.dk Allowed Types Picker',
		element: () => import('./config/allowed-types.element.js'),
		meta: {
			label: '#borgerDk_allowedTypes',
			icon: 'icon-list',
			group: 'lists',
		},
	},
	{
		type: 'modal',
		alias: BORGERDK_ARTICLE_MODAL_ALIAS,
		name: 'Limbo Borger.dk Article Modal',
		element: () => import('./modals/article-modal.element.js'),
	},
	{
		type: 'modal',
		alias: BORGERDK_SEARCH_MODAL_ALIAS,
		name: 'Limbo Borger.dk Search Modal',
		element: () => import('./modals/search-modal.element.js'),
	},
	{
		type: 'dashboard',
		alias: 'Limbo.Umbraco.BorgerDk.Dashboard',
		name: 'Limbo Borger.dk Dashboard',
		element: () => import('./dashboard/dashboard.element.js'),
		meta: {
			label: '#borgerDk_dashboardLabel',
			pathname: 'borgerdk',
		},
		conditions: [
			{
				alias: 'Umb.Condition.SectionAlias',
				match: 'Umb.Section.Settings',
			},
		],
	},
	{
		type: 'localization',
		alias: 'Limbo.Umbraco.BorgerDk.Localization.DaDk',
		name: 'Limbo Borger.dk Danish',
		weight: 0,
		meta: {
			// Language-only codes match both the bare language and every regional variant. "da-dk" would match
			// neither the "da" of the core Danish localization nor "da-DK", leaving the keys unresolved.
			culture: 'da',
		},
		js: () => import('./localization/da-dk.js'),
	},
	{
		type: 'localization',
		alias: 'Limbo.Umbraco.BorgerDk.Localization.EnUs',
		name: 'Limbo Borger.dk English',
		weight: 0,
		meta: {
			// "en" is also UMB_DEFAULT_LOCALIZATION_CULTURE, and therefore the fallback dictionary for any other
			// language the backoffice is running in.
			culture: 'en',
		},
		js: () => import('./localization/en-us.js'),
	},
];
