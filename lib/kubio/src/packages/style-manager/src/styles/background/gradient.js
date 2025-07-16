// import tinycolor from 'tinycolor2';
// import { serializeGradient } from '@colibri/packages/from-gutenberg/custom-gradient-picker/serializer';
//
// const defaultValue = {
// 	angle: 0,
// 	steps: [
// 		{
// 			position: 0,
// 			color: 'rgba(244,59,71,0.80)',
// 		},
// 		{
// 			position: 100,
// 			color: 'rgba(69,58,148,0.80)',
// 		},
// 	],
// };
//
// const applyGradientAlpha = function ( gradient, alpha = 0.8 ) {
// 	_.each( gradient.steps, ( value, key ) => {
// 		value.color = tinycolor( value.color ).setAlpha( alpha ).toRgbString();
// 	} );
// 	return gradient;
// };
//
// const getGradientCss = function ( style ) {
// 	return serializeGradient( style );
// };
//
// export { defaultValue, getGradientCss, applyGradientAlpha };
