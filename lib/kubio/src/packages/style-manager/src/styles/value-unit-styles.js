import { createUnitValueGroup } from '../utils';
import { LodashBasic } from '../core/lodash-basic';
const unitGroups = [
	'width',
	//'maxWidth', implemented separately

	'height',
	'maxHeight',
	'minHeight',

	'opacity',

	'left',
	'right',
	'top',
	'bottom',

	'fontSize',
	'size',

	'gap',
];
const percentageDefault = {
	unit: '%',
};
const pxDefault = {
	unit: 'px',
};
const defaultValueByGroup = {
	left: percentageDefault,
	right: percentageDefault,
	top: percentageDefault,
	bottom: percentageDefault,
	width: pxDefault,
	height: pxDefault,
	maxWidth: pxDefault,
	maxHeight: pxDefault,
	opacity: { unit: '' },
};

const groups = {};

unitGroups.forEach( ( item ) => {
	const defaultValue = LodashBasic.get( defaultValueByGroup, item );
	groups[ item ] = createUnitValueGroup( {
		groupName: item,
		default: defaultValue,
	} );
} );

export default groups;
