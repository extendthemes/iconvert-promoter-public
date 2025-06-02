import { useSetGlobalSessionProp } from '@kubio/editor-data';
import { ProItem } from '@kubio/pro';
import { parse } from '@wordpress/blocks';
import {
	Button,
	Tooltip,
	VisuallyHidden,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__unstableComposite as Composite,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__unstableCompositeItem as CompositeItem,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__unstableUseCompositeState as useCompositeState,
} from '@wordpress/components';
import { useInstanceId } from '@wordpress/compose';
import { useCallback, useMemo, useRef, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import classnames from 'classnames';
import _, { get, isArray, isString } from 'lodash';
import BlockPreview from '../block-preview';
import InserterDraggableBlocks from '../inserter-draggable-blocks';
import { useSelect } from '@wordpress/data';
import { STORE_KEY as KUBIO_STORE_KEY } from '@kubio/constants';
import { DeleteItemIcon } from '@kubio/icons';
import { RemoveSectionPopover } from './remove-section-popover';
import { decodeEntities } from '@wordpress/html-entities';

function BlockPattern( { pattern, onClick, composite, isFrontPage } ) {
	const { content, viewportWidth, isGutentagPattern } = pattern;

	const { currentThemeName } = useSelect( ( select ) => {
		const { getCurrentTheme } = select( 'core' );

		return {
			currentThemeName: getCurrentTheme()?.stylesheet,
		};
	}, [] );
	const blocks = useMemo( () => {
		if ( pattern.isGutentagPattern ) {
			return content;
		}

		if ( pattern.blocks ) {
			return pattern.blocks;
		}

		return isString( content ) ? parse( content ) : content;
	}, [ content ] );
	const instanceId = useInstanceId( BlockPattern );
	const descriptionId = `block-editor-block-patterns-list__item-description-${ instanceId }`;

	const handlePatternClick = () => {
		const templatePartsBlocks = [
			'kubio/header',
			'kubio/footer',
			'kubio/sidebar',
		];
		const blockName = blocks[ 0 ];
		const blockAttribute = blocks[ 1 ];

		//update current theme for template part blocks
		if ( templatePartsBlocks.includes( blockName ) ) {
			_.set( blockAttribute, 'theme', currentThemeName );
			_.unset( blockAttribute, 'slug' );
		}
		onClick( pattern, blocks );
	};

	const containerRef = useRef();

	const [ isRSPopoverVisible, setIsRSPopoverVisible ] = useState( false );

	const toggleRSVisibility = useCallback( () => {
		if ( ! isRSPopoverVisible ) {
			setIsRSPopoverVisible( true );
		} else {
			setIsRSPopoverVisible( false );
		}
	}, [ isRSPopoverVisible, setIsRSPopoverVisible ] );

	let urlSource = 'section-inserter';

	if ( isArray( pattern.content ) ) {
		const containerBlock = get( pattern, 'content.0', null );

		if ( containerBlock ) {
			urlSource = containerBlock.replace( 'kubio/', '' ) + '-inserter';
		}
	}

	const preview = useMemo(
		() => (
			<>
				<ProItem
					tag={ CompositeItem }
					item={ pattern }
					role="option"
					as="div"
					{ ...composite }
					className={ classnames(
						'block-editor-block-patterns-list__item',
						pattern.isCustomSection ? 'custom-section-item' : ''
					) }
					urlArgs={ {
						source: urlSource,
						content: pattern.title,
					} }
					onClick={ handlePatternClick }
				>
					{ isGutentagPattern && pattern?.screenshot && (
						<>
							<img
								alt={ pattern.title }
								src={ pattern?.screenshot }
								draggable="false"
								className={
									'block-editor-block-patterns-list__item__screenshot'
								}
							/>
						</>
					) }
					{ isGutentagPattern && pattern?.isCustomSection && (
						<>
							<div className="block-editor-block-patterns-list__item-title">
								<span className="title">
									{ decodeEntities( pattern?.title ) }
								</span>
								<Button
									isSmall
									icon={ DeleteItemIcon }
									className={ 'icon-close' }
									onClick={ ( event ) => {
										event.stopPropagation();
										toggleRSVisibility();
									} }
									showTooltip
									tooltipPosition={ 'top left' }
									label={ __( 'Remove section', 'kubio' ) }
								/>
							</div>
						</>
					) }
					{ ! isGutentagPattern && (
						<>
							<BlockPreview
								blocks={ blocks }
								viewportWidth={ viewportWidth }
							/>
							<div className="block-editor-block-patterns-list__item-title">
								{ pattern.title }
							</div>
							{ !! pattern.description && (
								<VisuallyHidden id={ descriptionId }>
									{ pattern.description }
								</VisuallyHidden>
							) }
						</>
					) }
				</ProItem>
			</>
		),
		[]
	);

	return (
		<InserterDraggableBlocks
			isEnabled={ ! isGutentagPattern }
			blocks={ blocks }
		>
			{ ( { draggable, onDragStart, onDragEnd } ) => (
				<>
					<Tooltip text={ pattern.title }>
						<div
							ref={ containerRef }
							className={ classnames(
								'block-editor-block-patterns-list__list-item'
							) }
							aria-label={ pattern.title }
							aria-describedby={
								pattern.description ? descriptionId : undefined
							}
							draggable={ draggable }
							onDragStart={ onDragStart }
							onDragEnd={ onDragEnd }
						>
							{ preview }
						</div>
					</Tooltip>
					{ isRSPopoverVisible && (
						<RemoveSectionPopover
							containerRef={ containerRef?.current }
							pattern={ pattern }
							onClose={ () => setIsRSPopoverVisible( false ) }
						/>
					) }
				</>
			) }
		</InserterDraggableBlocks>
	);
}
function useIsFrontPage() {
	const isFrontPage = useSelect( ( select ) => {
		const { getIsFrontPage = _.noop } = select( KUBIO_STORE_KEY ) || {};
		const _isFrontPage = getIsFrontPage();
		return _isFrontPage;
	}, [] );

	return isFrontPage;
}
function BlockPatternList( {
	blockPatterns = [],
	onClickPattern,
	orientation,
	label = __( 'Block Patterns', 'kubio' ),
} ) {
	const composite = useCompositeState( { orientation } );

	const isFrontPage = useIsFrontPage();

	return (
		<Composite
			{ ...composite }
			role="listbox"
			className="block-editor-block-patterns-list"
			aria-label={ label }
		>
			{ blockPatterns.map( ( pattern ) => (
				<BlockPattern
					key={ pattern.name }
					pattern={ pattern }
					onClick={ onClickPattern }
					composite={ composite }
					isFrontPage={ isFrontPage }
				/>
			) ) }
		</Composite>
	);
}

export default BlockPatternList;
