import type { UmbEntryPointOnInit, UmbEntryPointOnUnload } from '@umbraco-cms/backoffice/extension-api';
import { manifests } from './manifests.js';

export const onInit: UmbEntryPointOnInit = (_host, extensionRegistry) => {
	extensionRegistry.registerMany(manifests);
};

export const onUnload: UmbEntryPointOnUnload = (_host, extensionRegistry) => {
	manifests.forEach((manifest) => extensionRegistry.unregister(manifest.alias));
};
