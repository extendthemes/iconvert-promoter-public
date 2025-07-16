import { ElementsEnum } from '../../../../elements';

const typography = {
	size: {
		unit: 'px',
		value: '12',
	},
	weight: '600',
	lineHeight: {
		value: '1',
		unit: '',
	},
	transform: 'uppercase',
	letterSpacing: {
		value: '1',
		unit: 'px',
	},
};

const verticalPadding = {
	unit: 'px',
	value: '12',
};

const horizontalSpacing = {
	unit: 'px',
	value: '24',
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
		[ElementsEnum.LINK]: {
			padding,
			typography,
		},
		[ElementsEnum.ICON]: {
			size: iconSize,
		},
	},
};
export { padding, typography, iconSize };
export default defaultValue;
