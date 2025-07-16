import { LodashBasic } from '../../core/lodash-basic';
import { types } from '../../types';
import { BackgroundImage, defaultValue as imageDefault } from './image';
import {
	computeOverlayShapeStyle,
	overlayDefaultValue as overlayDefault,
	ShapesValues,
} from './overlay';
import { defaultValue as slideShowDefault } from './slideshow';
import { defaultValue as videoDefault } from './video';

const BackgroundTypesEnum = types.enums.backgroundTypes;

const defaultValue = {
	...types.props.background.default,
	image: imageDefault,
	video: videoDefault,
	overlay: overlayDefault,
	slideshow: slideShowDefault,
};

const getBackgroundNoneCss = ( colorIsSet ) => {
	const computedStyle = {};
	if ( ! colorIsSet ) {
		computedStyle.backgroundColor = 'unset';
	}
	computedStyle.backgroundImage = 'none';

	return computedStyle;
};

export {
	BackgroundTypesEnum,
	computeOverlayShapeStyle,
	overlayDefault as overlayDefaultValue,
	ShapesValues,
	BackgroundImage,
	defaultValue,
	imageDefault,
	videoDefault,
	overlayDefault,
	slideShowDefault,
};

export default {
	name: 'background',
	parser( value, { node } = {} ) {
		const unsetColorOnEmpty = false;
		//merge no array but ignore the image array(just merge the image array normally)
		const background = LodashBasic.mergeWith(
			{},
			{ ...defaultValue, type: '' },
			value,
			( objValue, srcValue ) => {
				if (
					LodashBasic.isArray( objValue ) &&
					LodashBasic.isArray( srcValue ) &&
					//the background image is an array, skip it
					! LodashBasic.get( objValue, '[0].attachment' ) &&
					srcValue.length
				) {
					return srcValue;
				}
			}
		);

		let style = {};
		let colorIsSet = false;
		if ( background.color ) {
			style.backgroundColor = background.color;
			colorIsSet = true;
		}

		if (
			! unsetColorOnEmpty &&
			! colorIsSet &&
			background.type !== BackgroundTypesEnum.GRADIENT
		) {
			colorIsSet = true;
		}

		switch ( background.type ) {
			case BackgroundTypesEnum.IMAGE:
			case BackgroundTypesEnum.GRADIENT:
				{
					//add source to image object directly, to be compatible with multiple backgrounds in the feature//
					const image = LodashBasic.merge(
						{ source: { type: background.type } },
						background.image[ 0 ]
					);
					style = LodashBasic.merge(
						style,
						new BackgroundImage( image ).toStyle()
					);
				}
				break;
			case BackgroundTypesEnum.NONE:
				style = LodashBasic.merge(
					style,
					getBackgroundNoneCss( colorIsSet )
				);
				break;
		}

		return style;
	},
	default: defaultValue,
};
