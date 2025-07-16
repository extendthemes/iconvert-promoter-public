import {
	withColibriDataAutoSave,
	withDynamicStyles,
	withStyledElements,
	silentDispatch,
	useGroupDispatch,
	withBackground,
} from '@kubio/core';
import { Utils } from '@kubio/style-manager';
import { compose } from '@wordpress/compose';
import { useDispatch, useSelect, withSelect } from '@wordpress/data';

import {
	useBindOverlayDimensions,
	useKubioInnerBlockProps,
} from '@kubio/block-library';
import { dynamicStylesTransforms } from '@kubio/style-manager';
import { useEffect, useRef } from '@wordpress/element';
import { DEFAULT_PROMO } from './config';
import { ElementsEnum } from './elements';
import { SkeletonBackgroundHtml } from './skeleton-backround';
import { SkeletonBackgroundHeader } from './skeleton-backround/header';

const Component = ( props ) => {
	const {
		postMeta,
		computed,
		StyledElements,
		context,
		innerBlocksPropsOverwrite,
		shouldSelectPromoPopup,
		clientId,
		isSelected,
		dataHelper,
		attributes,
		Background,
	} = props;
	const {
		align,
		popupType,
		popupId,
		lock,
		wrapperClassName,

		currentNoticeState,
		showEffectClass,
		hideEffectClass,
	} = computed;

	const { postId } = context;
	const ref = useRef();
	const overlayBindRef = useRef();
	useBindOverlayDimensions( {
		clientId,
		containerRef: ref,
		bindToRef: overlayBindRef,
		offset: isSelected ? 1 : 0,
	} );

	const { selectBlock } = useDispatch( 'core/block-editor' );
	useEffect( () => {
		if ( shouldSelectPromoPopup ) {
			selectBlock( clientId );
		}
	}, [ clientId, selectBlock, shouldSelectPromoPopup ] );

	const applyGroupDispatch = useGroupDispatch();
	useEffect( () => {
		applyGroupDispatch( async () => {
			dataHelper.group( () => {
				if ( ! lock || lock?.remove === false ) {
					dataHelper.setAttribute( 'lock', {
						move: true,
						remove: true,
					} );
				}
			} );
		} );
	}, [ applyGroupDispatch, dataHelper, lock, lock?.remove ] );

	useEffect( () => {
		//Define popup * initial template width/height based on popup-type
		applyGroupDispatch( async () => {
			dataHelper.group(
				() => {
					if ( popupType === '' ) {
						dataHelper.setAttribute(
							'popup_type',
							postMeta?.popup_type || DEFAULT_PROMO
						);
						if (
							align === 'center' &&
							postMeta?.popup_type === 'floating-bar'
						) {
							dataHelper.setAttribute( 'align', 'start' );
						}
					}
					if ( popupId === '' ) {
						dataHelper.setAttribute( 'popup_id', postId );
					}
				},
				{ silentDispatch: true }
			);
		} );
	}, [
		align,
		applyGroupDispatch,
		dataHelper,
		popupId,
		popupType,
		postId,
		postMeta?.popup_type,
	] );
	const { isEmpty } = useSelect(
		( select ) => {
			const innerBlocks =
				select( 'core/block-editor' ).getBlocks( clientId );
			let emptyBlocks = false;
			if ( innerBlocks.length === 0 ) {
				emptyBlocks = true;
			}
			if (
				innerBlocks.length === 1 &&
				innerBlocks[ 0 ] &&
				innerBlocks[ 0 ].name === 'cspromo/promopopupclose'
			) {
				emptyBlocks = true;
			}

			return {
				isEmpty: emptyBlocks,
			};
		},
		[ clientId ]
	);
	const innerBlocksProps = useKubioInnerBlockProps(
		{},
		{
			templateLock: false,
			// style: ElementsEnum.CONTAINER,
			overRidesEmpty: isEmpty,
			...innerBlocksPropsOverwrite,
		}
	);
	const refreshAnimationKey = dataHelper.getContextProp(
		'refreshAnimationKey'
	);
	const refreshAnimationKeyRef = useRef( refreshAnimationKey );

	useEffect( () => {
		if (
			refreshAnimationKey &&
			refreshAnimationKeyRef.current !== refreshAnimationKey &&
			overlayBindRef.current
		) {
			refreshAnimationKeyRef.current = refreshAnimationKey;

			// we copy the current ref in other variable to avoid changing the ref on cleanup
			const el = overlayBindRef.current;

			let playEffect = '';
			if ( currentNoticeState === 'show' ) {
				playEffect = showEffectClass;
			} else if ( currentNoticeState === 'hide' ) {
				playEffect = hideEffectClass;
			}

			el.classList.add( playEffect );

			const removeClassListener = () => {
				el.classList.remove( showEffectClass, hideEffectClass );
			};

			el.addEventListener( 'animationend', removeClassListener );

			return () => {
				el?.removeEventListener( 'animationend', removeClassListener );
			};
		}
	}, [
		refreshAnimationKey,
		currentNoticeState,
		showEffectClass,
		hideEffectClass,
	] );

	const {
		className: innerBlocksPropsClassName,
		children: innerBlocksPropsChildren,
		ref: innerBlocksPropsRef,
		...innerBlocksPropsRest
	} = innerBlocksProps;

	return (
		<>
			<SkeletonBackgroundHeader className={ wrapperClassName } />
			<div
				dangerouslySetInnerHTML={ {
					__html: `<style>${ attributes.additionalCSS }</style>`,
				} }
			/>
			<StyledElements.Outer>
				<StyledElements.WrapperContainer>
					<StyledElements.Container
						{ ...innerBlocksPropsRest }
						ref={ overlayBindRef }
						children={
							<>
								<Background />
								<div
									ref={ innerBlocksPropsRef }
									className={ `${ innerBlocksPropsClassName } h-y-container` }
								>
									{ innerBlocksPropsChildren }
								</div>
							</>
						}
					></StyledElements.Container>
				</StyledElements.WrapperContainer>
			</StyledElements.Outer>
			<SkeletonBackgroundHtml className={ wrapperClassName } />
		</>
	);
};

const dynamicStyling = ( dataHelper ) => {
	const spaceByMedia = dataHelper.getPropByMedia( 'vSpace', {} );

	return {
		[ ElementsEnum.VSPACE ]: dynamicStylesTransforms.vSpace( spaceByMedia ),
	};
};
const useStylesMapper = ( { computed } = {} ) => {
	const {
		align,
		alignH,
		popupType,
		showEffectClass,
		hideEffectClass,
		contentPosition,
		hiddenByMedia,
	} = computed;

	const hiddenClasses = Utils.mapHideClassesByMedia( hiddenByMedia );

	return {
		[ ElementsEnum.OUTER ]: {
			className: () => {
				return [
					'cs-popup',
					`align-items-${ align }`,
					`justify-content-${ alignH }`,
					`cs-fb-position-${ contentPosition }`,
					`cs-outer-popup-container-type-${ popupType }`,
					hiddenClasses,
				];
			},
		},
		[ ElementsEnum.CONTAINER ]: {
			className: () => {
				return [ 'animated', 'animate__animated' /* playEffect */ ];
			},
			'data-show-effect': showEffectClass,
			'data-exit-effect': hideEffectClass,
		},
	};
};

const computed = ( dataHelper ) => {
	const scriptData = {
		inEditor: true,
	};
	const containerOptions = { styledComponent: ElementsEnum.CONTAINER };
	const defaultTemplateWidth = dataHelper.getAttribute(
		'defaultTemplateWidth',
		''
	);
	const defaultTemplateHeight = dataHelper.getAttribute(
		'defaultTemplateHeight',
		''
	);

	const align = dataHelper.getAttribute( 'align', '' );
	const alignH = dataHelper.getAttribute( 'alignH', '' );
	const contentPosition = dataHelper.getAttribute( 'contentPosition', '' );
	const popupType = dataHelper.getAttribute( 'popup_type', DEFAULT_PROMO );
	const popupId = dataHelper.getAttribute( 'popup_id', '' );
	const width = dataHelper.getStyle( 'width', '', containerOptions );
	const height = dataHelper.getStyle( 'minHeight', '', containerOptions );
	const lock = dataHelper.getAttribute( 'lock' );
	const wrapperClassName = `promo-wrapper-${ popupType } promo-align-items-${ align } promo-wrapper-${ contentPosition }`;

	let showEffectClass, hideEffectClass;
	const showEffectActive = dataHelper.getAttribute(
		'showNotice.effectActive',
		''
	);
	if ( showEffectActive ) {
		showEffectClass = dataHelper.getAttribute(
			`showNotice.${ showEffectActive }`,
			''
		);
	}
	const hideEffectActive = dataHelper.getAttribute(
		'hideNotice.effectActive',
		''
	);
	if ( hideEffectActive ) {
		hideEffectClass = dataHelper.getAttribute(
			`hideNotice.${ hideEffectActive }`,
			''
		);
	}

	const currentNoticeState = dataHelper.getContextProp(
		'curentNotice',
		'show'
	);

	const hiddenByMedia =
		dataHelper?.getPropByMedia( 'isHidden', false, { fromRoot: true } ) ||
		{};

	return {
		scriptData,
		currentNoticeState,
		align,
		alignH,
		contentPosition,
		width,
		height,
		popupType,
		popupId,
		showEffectClass,
		hideEffectClass,
		containerOptions,
		defaultTemplateWidth,
		defaultTemplateHeight,
		lock,
		wrapperClassName,
		dataHelper,
		hiddenByMedia,
	};
};

const DividerCompose = compose(
	withSelect( ( select ) => {
		const postmeta =
			select( 'core/editor' ).getEditedPostAttribute( 'meta' );
		return { postMeta: postmeta };
	} ),
	withSelect( ( select ) => {
		const { getSelectedBlock } = select( 'core/block-editor' );
		const selectedBlock = getSelectedBlock();
		const shouldSelectPromoPopup =
			selectedBlock?.name === 'core/post-content' || ! selectedBlock;
		return {
			shouldSelectPromoPopup,
		};
	} ),
	withColibriDataAutoSave( computed ),
	withDynamicStyles( dynamicStyling ),
	withStyledElements( useStylesMapper ),
	withBackground()
);
const Base = DividerCompose( Component );
export { Base };
