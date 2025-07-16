import { compose } from '@wordpress/compose';

import { ElementsEnum } from './elements';
import {
	useBlockElementProps,
	withColibriDataAutoSave,
	withStyledElements,
	withCallbackOnEmptyInnerBlocks,
} from '@kubio/core';
import { Disabled } from '@wordpress/components';
import { properties, getAspectRatioClass } from './config';
import { generateUrl, getInternalUrlAttributes } from './computed';
import NamesOfBlocks from '../blocks-list';
import { PosterContentDefault } from './generators/inner-block-default';
import { useKubioInnerBlockProps } from '../common/hooks/use-kubio-inner-block-props';
import { Fragment, useCallback } from '@wordpress/element';
import { useDispatch, useSelect } from '@wordpress/data';
import { useCurrentInspectorTab } from '@kubio/inspectors';
import { useUIOverlayFocus } from '../common/hooks/use-ui-overlay-focus';
import _ from 'lodash';
import { STORE_KEY } from '@kubio/constants';

const ALLOWED_BLOCKS = [
	NamesOfBlocks.ICON,
	NamesOfBlocks.BUTTON,
	NamesOfBlocks.BUTTON_GROUP,
];

const KUBIO_ICON = 'kubio/icon';
const KUBIO_BUTTON = 'kubio/button';

const template = [ PosterContentDefault ];

const Component = ( props ) => {
	const { computed, StyledElements } = props;

	const {
		isInternal,
		displayAsPosterImage,
		displayAsLightbox,
		url,
		attributes,
		childIsSelected,
		posterImage,
	} = computed;

	const [ , setDisplayedTab ] = useCurrentInspectorTab();
	const { debouncedShowOverlay } = useUIOverlayFocus( {
		scrollInView: true,
	} );
	const { openSidebar = _.noop } = useDispatch( STORE_KEY ) || {};

	const getInnerWrapper = () => {
		//make children not intractable when they are not selected. They should be selectable only from video panel
		if ( ! childIsSelected ) {
			return Disabled;
		}
		return Fragment;
	};
	const InnerWrapper = getInnerWrapper();

	const handleClick = useCallback( ( e ) => {
		const element = e.target.closest( '.block-editor-block-list__block' )
			.dataset.kubio;

		if ( element === KUBIO_ICON || element === KUBIO_BUTTON ) {
			openSidebar( 'block-inspector' );
			setDisplayedTab( 'content' );
			debouncedShowOverlay( '.video-options-customize-play__container' );
		}
	}, [] );

	const innerBlocksProps = useKubioInnerBlockProps(
		{ onClick: handleClick },
		{
			renderAppender: false,
			templateLock: false,
			orientation: 'horizontal',
			allowedBlocks: ALLOWED_BLOCKS,
			template,
		}
	);

	const videoProps = useBlockElementProps( ElementsEnum.VIDEO );
	return (
		<StyledElements.Outer>
			<InnerWrapper>
				{ displayAsPosterImage && (
					<StyledElements.Poster { ...innerBlocksProps } />
				) }
				{ displayAsLightbox && (
					<StyledElements.Lightbox { ...innerBlocksProps } />
				) }
			</InnerWrapper>
			{ ! displayAsLightbox &&
				( isInternal ? (
					<div { ...videoProps }>
						<video
							className="h-video-main"
							{ ...attributes }
							src={ url }
							poster={ posterImage.url }
						/>
					</div>
				) : (
					<div { ...videoProps }>
						{ /* eslint-disable-next-line jsx-a11y/iframe-has-title */ }
						<iframe src={ url } className="h-video-main" />
					</div>
				) ) }
		</StyledElements.Outer>
	);
};
const editorStyleMapper = ( { computed } ) => {
	return {
		[ ElementsEnum.VIDEO ]: {
			className: () => {
				return [ 'h-pointer-event-none' ];
			},
		},
	};
};
const stylesMapper = ( { computed } = {} ) => {
	const { posterImage } = computed;
	return {
		[ ElementsEnum.OUTER ]: {
			className: () => {
				const { aspectRatio, displayAsLightbox } = computed;
				const classes = [];
				if ( ! displayAsLightbox ) {
					classes.push( getAspectRatioClass( aspectRatio ) );
				}
				return classes;
			},
		},
		[ ElementsEnum.POSTER ]: {
			className: () => {
				const sizeSlug = posterImage?.sizeSlug;
				return {
					[ `size-${ sizeSlug }` ]: sizeSlug,
				};
			},
			style: {
				backgroundImage: `url('${ posterImage?.url }')`,
			},
		},
	};
};

const computed = ( dataHelper, ownProps ) => {
	const aspectRatio = dataHelper.getAttribute( 'aspectRatio' );
	const parametersNames = [
		'internalUrl',
		'youtubeUrl',
		'vimeoUrl',
		'videoCategory',
		'displayAs',
		'playerOptions',
	];
	let parameters = dataHelper.getAttributes( parametersNames );

	const { displayAs, videoCategory } = parameters;
	const displayAsValues = properties.videoDisplayAs.values;

	const displayAsVideo = displayAs === displayAsValues.VIDEO;
	const displayAsPosterImage = displayAs === displayAsValues.POSTER_IMAGE;
	const displayAsLightbox = displayAs === displayAsValues.ICON_WITH_LIGHTBOX;
	const isInternal =
		videoCategory === properties.videoCategory.values.INTERNAL;
	parameters = Object.assign( {}, parameters, {
		displayAsVideo,
		displayAsPosterImage,
		displayAsLightbox,
		isInternal,
	} );
	const url = generateUrl( parameters );
	const selectedBlockClientId = useSelect( ( select ) => {
		return select( 'core/block-editor' ).getSelectedBlockClientId();
	} );
	const childrenClientIds = dataHelper
		.withChildren()
		.map( ( childDataHelper ) => childDataHelper?.clientId );

	const childIsSelected = childrenClientIds.includes( selectedBlockClientId );

	return {
		displayAsVideo,
		displayAsPosterImage,
		displayAsLightbox,
		url,
		isInternal,
		aspectRatio,
		posterImage: dataHelper.getAttribute( 'posterImage' ),
		attributes: getInternalUrlAttributes( parameters ),
		childIsSelected,
	};
};

const onDeleteVideoChild = ( hooks, { dataHelper } ) => {
	const { selectBlock } = hooks;
	dataHelper.setAttribute( 'displayAs', 'video' );
	selectBlock( dataHelper?.clientId );
};

const VideoCompose = compose(
	withColibriDataAutoSave( computed ),
	withStyledElements( stylesMapper, editorStyleMapper ),
	withCallbackOnEmptyInnerBlocks( onDeleteVideoChild )
);

const Video = VideoCompose( Component );

export { Video };
