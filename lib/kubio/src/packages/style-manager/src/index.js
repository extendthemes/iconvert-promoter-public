import {
	styleManagerInstance,
	clearManagers,
	removeManager,
	cssobj,
	updateAllStyleManagers,
} from './manager';
import { states, statesById, StatesEnum } from './states';
import * as HorizontalAlign from './props/horizontal-align';
// import * as VerticalAlign from './props/vertical-align';
import { default as Styles, BackgroundImage } from './styles';
import * as Utils from './utils';
import * as Media from './medias';
import { BlockStyleRender } from './block-style-render';
import { FlexAlign } from './core/properties/align';
import { GlobalStyleRender } from './global-style-render';
import CustomHeight, {
	HeightTypesEnum,
	computeStyle,
	computeHeightStyle,
	HeightTypes,
	defaultValue,
} from './props/custom-height';

const Height = {
	height: CustomHeight,
	HeightTypesEnum,
	computeStyle,
	computeHeightStyle,
	HeightTypes,
	defaultValue,
};

export * from './states/states';
export * from './style-groups';
export * from './props/custom-height';
export * from './props/horizontal-text-align';
export * from './props/horizontal-align';
export * from './props/horizontal-flex-align';
import separatorConfig from './props/separator/separator';
import * as columnWidth from './styles/column-width';

import { LayoutHelper } from './layout';
import { types, getFilteredTypes } from './types';
import { Utils as ParserUtils } from './core/utils';
import { LodashBasic } from './core/lodash-basic';
import { createWorkerPromise } from './worker';
import * as overlayConfig from './styles/background/overlay';

export * from './types/index';
export * from './dynamic-styles';
export { getMonochromaticColors } from './utils/color';
import * as BackgroundParserUtils from './styles/background';
export { typographyConfig } from './styles';
export {
	BackgroundParserUtils,
	columnWidth,
	types,
	getFilteredTypes,
	styleManagerInstance,
	Media,
	states,
	statesById,
	StatesEnum,
	Styles,
	Utils,
	Height,
	HorizontalAlign,
	// VerticalAlign,
	LayoutHelper,
	ParserUtils,
	separatorConfig,
	overlayConfig,
	FlexAlign,
	BackgroundImage,
	LodashBasic,
	BlockStyleRender,
	GlobalStyleRender,
	clearManagers as clearStyleManagers,
	removeManager as removeStyleManager,
	createWorkerPromise,
	cssobj,
	updateAllStyleManagers,
};
