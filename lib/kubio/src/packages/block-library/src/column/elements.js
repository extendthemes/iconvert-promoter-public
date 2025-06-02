import {
	StatesPresetsEnum,
	StylesEnum,
	StylesPresetsEnum,
} from '@kubio/style-manager';
import { BackgroundUiUtils } from '@kubio/controls';

import metadata from './block.json';
import { __ } from '@wordpress/i18n';

const ElementsEnum = metadata.supports.kubio.elementsEnum;

const elementsByName = {
	[ElementsEnum.INNER]: {
		label: __('Inner', 'kubio'),
		supports: {
			styles: [StylesEnum.TRANSITION].concat(
				StylesPresetsEnum.CONTAINERS
			),
			states: StatesPresetsEnum.BASIC,
			filters: {
				...BackgroundUiUtils.FiltersPreset.CONTAINER,
				transition: {
					manuallyEnabled: true,
				},
			},
		},
	},
	[ElementsEnum.CONTAINER]: {
		label: __('Container', 'kubio'),
		internal: true,
		supports: {
			styles: [StylesEnum.SPACING],
			states: StatesPresetsEnum.BASIC,
		},
	},
	[ElementsEnum.ALIGN]: {
		label: __('Align', 'kubio'),
		internal: true,
		supports: {
			styles: StylesPresetsEnum.ALL,
			states: StatesPresetsEnum.BASIC,
		},
	},
	[ElementsEnum.VSPACE]: {
		internal: true,
	},
};

export { ElementsEnum as ColumnElementsEnum, elementsByName };
