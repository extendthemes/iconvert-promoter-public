import { createGroup } from '../utils';

const defaultValue = {
	angle: 0,
	widthPercentage: 20,
	topPercentage: 0,
	leftPercentage: 0,
	zIndex: 0,
};

const getFrameOptionsCss = (
	style = {},
	{ angle, widthPercentage, topPercentage, leftPercentage, zIndex } = {}
) => {
	style.transform = `rotate(${ angle }deg)`;
	style.width = `${ widthPercentage }%`;
	style.top = `${ topPercentage }%`;
	style.left = `${ leftPercentage }%`;
	style.zIndex = `${ zIndex }`;
	style.position = `absolute`;
	style.height = `auto`;
	return style;
};

export default createGroup( {
	groupName: 'multipleImage',
	toStyle: getFrameOptionsCss,
	default: defaultValue,
} );
