import { StatesPresetsEnum, StylesPresetsEnum } from '@kubio/style-manager';

import metadata from './block.json';
import { BackgroundUiUtils } from '@kubio/controls';
import { __ } from '@wordpress/i18n';

const StylesEnum = metadata.supports.kubio.elementsEnum;
const elementsByName = {
	[StylesEnum.CONTAINER]: {
		label: __('Container', 'kubio'),
		supports: {
			styles: [StylesEnum.TRANSITION].concat(
				StylesPresetsEnum.CONTAINERS
			),
			states: StatesPresetsEnum.BASIC,
			filters: BackgroundUiUtils.FiltersPreset.CONTAINER,
		},
	},
	[StylesEnum.CENTER]: {
		label: __('Center', 'kubio'),
		internal: true,
	},
	[StylesEnum.INNER]: {
		label: __('Inner', 'kubio'),
		internal: true,
	},
	[StylesEnum.OUTER_GAPS]: {
		internal: true,
	},
	[StylesEnum.INNER_GAPS]: {
		internal: true,
	},
};

export { StylesEnum, elementsByName };
