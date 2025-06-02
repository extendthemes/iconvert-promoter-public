import border from './border';
import margin from './margin';
import padding from './padding';
import background, { BackgroundImage } from './background';
import typography from './typography';
import boxShadow from './box-shadow';
import transform from './transform';
import frameOptions from './frame-options';
import textShadow from './text-shadow';
import animation from './animation';
import stroke from './stroke';
import transition from './transition';
import opacity from './opacity';
import customHeight from '../props/custom-height';
import object from './object';
import valueUnitStyles from './value-unit-styles';
import maxWidth from './max-width';
import columnWidth from './column-width';
import size from './size';
import multipleImage from './multiple-image';
import gap from './gap';
import justifyContent from './justify-content';

export { BackgroundImage };
export { typographyConfig } from './typography';

export default {
	...valueUnitStyles,
	object,
	border,
	margin,
	padding,
	background,
	typography,
	boxShadow,
	transform,
	frameOptions,
	textShadow,
	animation,
	stroke,
	transition,
	opacity,
	customHeight,
	columnWidth,
	size,
	maxWidth,
	multipleImage,
	gap,
	justifyContent,
};
