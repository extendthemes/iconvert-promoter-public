import {
	BackgroundImage as BackgroundImageParser,
	BackgroundParserUtils,
	LodashBasic,
} from '@kubio/style-manager';
import { useSelect } from '@wordpress/data';
import {
	useCallback,
	useLayoutEffect,
	useMemo,
	useRef,
} from '@wordpress/element';
import classnames from 'classnames';
import { useDeepMemo } from '../../../hooks';
import { useJSComponentProps } from '../../../hooks/use-js-component';
import { useFrontEndComponent } from '../../use-frontend-component';

const BackgroundImage = ( { value } ) => {
	const ref = useRef();

	const mergedValue = useDeepMemo(
		() =>
			LodashBasic.merge( [], BackgroundParserUtils.imageDefault, value ),
		[ value ]
	);

	const getValue = useCallback(
		( path ) => {
			return LodashBasic.get( mergedValue, path );
		},
		[ mergedValue ]
	);

	const isUsingParallaxScript = getValue( '0.useParallax' );
	const isUsingFeaturedImage = getValue( '0.useFeaturedImage' );
	const isForcingBackgroundLayer = getValue( '0.forceBackgroundLayer' );

	const featuredImageUrl = useSelect( ( select ) => {
		if ( isUsingFeaturedImage ) {
			const featuredImageId =
				select( 'core/editor' ).getEditedPostAttribute(
					'featured_media'
				);

			let featuredImageData = null;
			if ( parseInt( featuredImageId ) ) {
				featuredImageData =
					select( 'core' ).getMedia( featuredImageId );
				featuredImageData = LodashBasic.get(
					featuredImageData,
					'source_url'
				);
			}

			return featuredImageData;
		}

		return '';
	} );

	const staticImage = getValue( '0.source.url' );

	const url = useMemo( () => {
		if ( isUsingFeaturedImage && featuredImageUrl ) {
			return featuredImageUrl;
		}

		return staticImage;
	}, [ featuredImageUrl, staticImage, isUsingFeaturedImage ] );

	const className = useMemo( () => {
		const classList = [ 'background-layer' ];
		if ( isUsingParallaxScript ) {
			classList.push( 'paraxify' );
		}
		if ( isForcingBackgroundLayer ) {
			classList.push( 'forceBackgroundLayer' );
		}

		return classList;
	}, [ isForcingBackgroundLayer, isUsingParallaxScript ] );

	const { getFrontendComponentFunction } = useFrontEndComponent( {
		ref,
		componentName: 'parallax',
	} );

	const restart = getFrontendComponentFunction( 'restart', 10 );

	const imageLayerStyle = useMemo( () => {
		let style = {};

		if ( isUsingParallaxScript || isUsingFeaturedImage ) {
			style.backgroundImage = `url(${ url })`;
		} else {
			const image = getValue( '0' );
			style = new BackgroundImageParser( image ).toStyle();
		}

		return style;
	}, [ getValue, isUsingFeaturedImage, url, isUsingParallaxScript ] );

	useLayoutEffect( () => {
		if ( isUsingParallaxScript ) {
			restart();
		}
	}, [ imageLayerStyle, isUsingParallaxScript, restart ] );

	return (
		<div
			ref={ ref }
			style={ imageLayerStyle }
			className={ classnames( className ) }
			{ ...useJSComponentProps( 'parallax', {
				enabled: isUsingParallaxScript,
			} ) }
		/>
	);
};

export { BackgroundImage };
