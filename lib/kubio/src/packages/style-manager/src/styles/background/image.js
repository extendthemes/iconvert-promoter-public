import { defaultAssetURL } from '@kubio/utils';
import _ from 'lodash';

import { LodashBasic } from '../../core/lodash-basic';
import { types } from '../../types';
import { isNotEmptyButCanBeZero, toValueUnitString } from '../../utils';

const defaultValue = _.merge( [], types.props.background.image.default, [
	{
		source: {
			url: defaultAssetURL( '/background-image-1.jpg' ),
		},
	},
] );
class BackgroundImage {
	constructor( value ) {
		this.value = value;
	}

	getBackgroundImage( source ) {
		switch ( source.type ) {
			case 'image':
				return 'url("' + source.url + '")';
			case 'gradient':
				return source.gradient;
		}
		return '';
	}

	computeCustomSizeStyle( computedStyle = {}, customSize ) {
		const bgSizeX = toValueUnitString( customSize?.x, 'auto' );
		const bgSizeY = toValueUnitString( customSize?.y, 'auto' );
		computedStyle.backgroundSize = `${ bgSizeX } ${ bgSizeY }`;
	}

	toStyle() {
		const computedStyle = {};
		computedStyle.backgroundImage = this.getBackgroundImage(
			this.value.source
		);
		computedStyle.backgroundAttachment = this.value.attachment;

		if ( this.value.source.type === 'gradient' ) {
			return computedStyle;
		}

		if ( isNotEmptyButCanBeZero( this.value.size ) ) {
			if ( this.value.size === 'custom' ) {
				this.computeCustomSizeStyle(
					computedStyle,
					this.value.sizeCustom
				);
			} else {
				computedStyle.backgroundSize = this.value.size;
			}
		}

		let position = this.value.position;
		if ( ! LodashBasic.isString( position ) ) {
			position = `${ this.value.position.x }% ${ this.value.position.y }%`;
		}
		computedStyle.backgroundPosition = position;
		computedStyle.backgroundRepeat = this.value.repeat;

		return computedStyle;
	}
}

export { BackgroundImage, defaultValue };
