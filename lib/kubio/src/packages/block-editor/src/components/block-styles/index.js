/**
 * External dependencies
 */
import classnames from 'classnames';
//modified in kubio
import { debounce, noop } from 'lodash';

/**
 * WordPress dependencies
 */
import {
	Button,
	Popover,
	__experimentalTruncate as Truncate,
} from '@wordpress/components';
import { useViewportMatch } from '@wordpress/compose';
import deprecated from '@wordpress/deprecated';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import BlockStylesPreviewPanel from './preview-panel';
import useStylesForBlocks from './use-styles-for-block';

// Block Styles component for the Settings Sidebar.
function BlockStyles( { clientId, onSwitch = noop, onHoverClassName = noop } ) {
	const {
		onSelect,
		stylesToRender,
		activeStyle,
		genericPreviewBlock,
		className: previewClassName,
	} = useStylesForBlocks( {
		clientId,
		onSwitch,
	} );
	const [ hoveredStyle, setHoveredStyle ] = useState( null );
	const isMobileViewport = useViewportMatch( 'medium', '<' );

	if ( ! stylesToRender || stylesToRender.length === 0 ) {
		return null;
	}

	const debouncedSetHoveredStyle = debounce( setHoveredStyle, 250 );

	const onSelectStylePreview = ( style ) => {
		onSelect( style );
		onHoverClassName( null );
		setHoveredStyle( null );
		debouncedSetHoveredStyle.cancel();
	};

	const styleItemHandler = ( item ) => {
		if ( hoveredStyle === item ) {
			debouncedSetHoveredStyle.cancel();
			return;
		}
		debouncedSetHoveredStyle( item );
		onHoverClassName( item?.name ?? null );
	};

	//modified in kubio
	return (
		<div className="block-editor-block-styles">
			<div className="block-editor-block-styles__variants">
				{ stylesToRender.map( ( style ) => {
					const buttonText = style.isDefault
						? __( 'Default', 'kubio' )
						: style.label || style.name;

					return (
						<Button
							__next40pxDefaultSize
							className={ classnames(
								'block-editor-block-styles__item',
								{
									'is-active':
										activeStyle.name === style.name,
								}
							) }
							key={ style.name }
							variant="secondary"
							label={ buttonText }
							onMouseEnter={ () => styleItemHandler( style ) }
							onFocus={ () => styleItemHandler( style ) }
							onMouseLeave={ () => styleItemHandler( null ) }
							onBlur={ () => styleItemHandler( null ) }
							onClick={ () => onSelectStylePreview( style ) }
							aria-current={ activeStyle.name === style.name }
						>
							<Truncate
								numberOfLines={ 1 }
								className="block-editor-block-styles__item-text"
							>
								{ buttonText }
							</Truncate>
						</Button>
					);
				} ) }
			</div>
			{ hoveredStyle && ! isMobileViewport && (
				<Popover
					placement="left-start"
					offset={ 34 }
					focusOnMount={ false }
				>
					<div
						className="block-editor-block-styles__preview-panel"
						onMouseLeave={ () => styleItemHandler( null ) }
					>
						<BlockStylesPreviewPanel
							activeStyle={ activeStyle }
							className={ previewClassName }
							genericPreviewBlock={ genericPreviewBlock }
							style={ hoveredStyle }
						/>
					</div>
				</Popover>
			) }
		</div>
	);
}

export default BlockStyles;

BlockStyles.Slot = () => {
	deprecated( 'BlockStyles.Slot', {
		version: '6.4',
		since: '6.2',
	} );

	return null;
};
