import {
	Utils,
	types,
	BackgroundParserUtils,
	LodashBasic,
} from '@kubio/style-manager';
import classnames from 'classnames';
import { prefixClassNames } from '../../../utils/prefixes';
import { useJSComponentProps } from '../../../hooks/use-js-component';
import { useMemo } from '@wordpress/element';

const { toValueUnitString } = Utils;

const getSlideStyle = ( slide, index ) => {
	const style = {
		backgroundImage: `url('${ slide?.url }')`,
		zIndex: index,
	};
	return style;
};

const BackgroundSlideshow = ( { value = {} } ) => {
	const merged = LodashBasic.merge(
		{},
		BackgroundParserUtils.slideShowDefault,
		value
	);

	const { slides, duration, speed } = useMemo( () => {
		if ( value?.slides ) {
			merged.slides = value.slides;
		}

		return merged;
	}, [ merged, value?.slides ] );

	const durationStr = toValueUnitString( duration );
	const speedStr = toValueUnitString( speed );
	return (
		<div
			className={ classnames( [
				'background-layer',
				prefixClassNames( 'slideshow' ),
			] ) }
			{ ...useJSComponentProps( 'slideshow', {
				speed: speedStr,
				duration: durationStr,
			} ) }
		>
			{ ( slides || [] ).map( ( slide, index ) => {
				return (
					<div
						key={ `slide-${ index }` }
						style={ getSlideStyle( slide, index ) }
						className="slideshow-image"
					/>
				);
			} ) }
		</div>
	);
};

export { BackgroundSlideshow };
