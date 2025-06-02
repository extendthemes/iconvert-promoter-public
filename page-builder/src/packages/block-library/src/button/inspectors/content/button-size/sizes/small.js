import { ElementsEnum } from '../../../../elements';

const typography = {
	size: {
		unit: 'px',
		value: '11',
	},
	weight: '600',
	lineHeight: {
		value: '1',
		unit: '',
	},
	transform: '',
	letterSpacing: {
		value: '1',
		unit: 'px',
	},
};

const verticalPadding = {
	unit: 'px',
	value: '8',
};

const horizontalSpacing = {
	unit: 'px',
	value: '20',
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
