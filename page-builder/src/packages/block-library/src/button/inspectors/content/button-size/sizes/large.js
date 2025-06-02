import { ElementsEnum } from '../../../../elements';

const typography = {
	size: {
		unit: 'px',
		value: '14',
	},
	weight: '600',
	transform: 'uppercase',
	lineHeight: {
		value: '1',
		unit: '',
	},
	letterSpacing: {
		value: '1',
		unit: 'px',
	},
};

const verticalPadding = {
	unit: 'px',
	value: '15',
};

const horizontalSpacing = {
	unit: 'px',
	value: '30',
};
const padding = {
	top: verticalPadding,
	bottom: verticalPadding,
	left: horizontalSpacing,
	right: horizontalSpacing,
};

const iconSize = typography.size;

const defaultValue = {
	descendants: {
		[ ElementsEnum.LINK ]: {
			padding,
			typography,
		},
		[ ElementsEnum.ICON ]: {
			size: iconSize,
		},
	},
};
export { padding, typography, iconSize };
export default defaultValue;
