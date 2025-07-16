import { types, Media, ParserUtils, LodashBasic } from '@kubio/style-manager';
import { BackgroundOverlay } from './overlay';
import { createHigherOrderComponent } from '@wordpress/compose';
import classnames from 'classnames';
import { BackgroundVideo } from './video';
import { BackgroundSlideshow } from './slideshow';
import { memo, useMemo } from '@wordpress/element';
import { getBlockDefaultElement } from '../../../utils';
import { BackgroundImage } from './image';
import { useKubioBlockContext } from '../../../context';

const { mediasById } = Media;
const BackgroundTypesEnum = types.props.background.enums.types;

const backgroundOnMediaClass = ( media ) => {
	const className = ParserUtils.composeClassForMedia(
		media,
		'',
		'background-layer-media-container',
		true
	);
	return [ 'background-layer', className ];
};
const backgroundsByType = {
	[ BackgroundTypesEnum.VIDEO ]: BackgroundVideo,
	[ BackgroundTypesEnum.SLIDESHOW ]: BackgroundSlideshow,
	[ BackgroundTypesEnum.IMAGE ]: BackgroundImage,
};

const backgroundLayerIsEnabled = ( background ) => {
	switch ( background.type ) {
		case 'image':
			const bgImage = LodashBasic.get( background, 'image.0', {} );
			return (
				bgImage.useParallax ||
				bgImage.useFeaturedImage ||
				bgImage.forceBackgroundLayer
			);
		default:
			return true;
	}
};
const BackgroundOnMedia = memo( ( { media, value } ) => {
	let BackgroundComponent = backgroundsByType[ value.type ];
	if ( ! backgroundLayerIsEnabled( value ) ) {
		BackgroundComponent = null;
	}

	return (
		<div className={ classnames( backgroundOnMediaClass( media ) ) }>
			<BackgroundOverlay value={ value.overlay } />
			{ BackgroundComponent && (
				<BackgroundComponent value={ value[ value.type ] } />
			) }
		</div>
	);
} );
const BackgroundWrapper = memo( ( { backgroundByMedia } ) => {
	return (
		<div className="background-wrapper">
			{ Object.keys( mediasById ).map( ( media ) => {
				return (
					backgroundByMedia[ media ] && (
						<BackgroundOnMedia
							key={ media }
							media={ media }
							value={ backgroundByMedia[ media ] }
						/>
					)
				);
			} ) }
		</div>
	);
} );

const BackgroundRender_ = ( backgroundByMedia ) => {
	return () => {
		return <BackgroundWrapper backgroundByMedia={ backgroundByMedia } />;
	};
};

const withBackground = () => {
	return createHigherOrderComponent(
		( WrappedComponent ) => ( ownProps ) => {
			const { name } = ownProps;
			const { dataHelper } = useKubioBlockContext();
			const styledComponent = getBlockDefaultElement( name )?.name;
			const backgroundByMedia = dataHelper.getStyleByMedia(
				'background',
				{},
				{
					styledComponent,
				}
			);
			const Background = useMemo(
				() => BackgroundRender_( backgroundByMedia ),
				[ JSON.stringify( backgroundByMedia ) ]
			);
			return (
				<>
					<WrappedComponent
						{ ...ownProps }
						Background={ Background }
					/>
				</>
			);
		},
		'withBackground'
	);
};
export { withBackground };
export { BackgroundWrapper };
export { BackgroundOverlay };
