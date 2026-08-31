/**
 * The element types a Borger.dk article may consist of, ported verbatim from the AngularJS `borgerDkService` of
 * the Umbraco 13 version of this package. Used by the "allowed types" data type configuration.
 */
export interface BorgerDkElementType {
	alias: string;
	name: string;
	type: string;
	typeName: string;
}

export const BORGERDK_ELEMENT_TYPES: ReadonlyArray<BorgerDkElementType> = [
	{ alias: 'kernetekst', name: 'Kernetekst', type: 'content', typeName: 'mikroartikler' },
	{ alias: 'selvbetjeningslinks', name: 'Selvbetjeningslinks', type: 'box', typeName: 'infoboks' },
	{ alias: 'anbefaler', name: 'Anbefaler', type: 'box', typeName: 'infoboks' },
	{ alias: 'huskeliste', name: 'Huskeliste', type: 'box', typeName: 'infoboks' },
	{ alias: 'lovgivning', name: 'Lovgivning', type: 'box', typeName: 'infoboks' },
	{ alias: 'faktaboks', name: 'Faktaboks', type: 'box', typeName: 'infoboks' },
	{ alias: 'regler', name: 'Regler', type: 'box', typeName: 'infoboks' },
	{ alias: 'byline', name: 'Skrevet af', type: 'box', typeName: 'byline' },
];
