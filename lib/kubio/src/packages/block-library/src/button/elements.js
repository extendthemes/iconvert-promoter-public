import metadata from './block.json';
const ElementsEnum = metadata.supports.kubio.elementsEnum;

import { __ } from '@wordpress/i18n';
import { StatesPresetsEnum } from '@kubio/style-manager';
import { elementsByName as linkElementsByName } from '../link/elements';
import { mergeNoArrays } from '@kubio/utils';

const elementsByName = mergeNoArrays({}, linkElementsByName, {
	[ElementsEnum.LINK]: {
		label: __('Button', 'kubio'),
		supports: {
			states: StatesPresetsEnum.BUTTON,
		},
	},
	[ElementsEnum.ICON]: {
		label: __('Icon', 'kubio'),
		supports: {
			states: StatesPresetsEnum.BUTTON,
		},
	},
});

export { ElementsEnum, elementsByName };
