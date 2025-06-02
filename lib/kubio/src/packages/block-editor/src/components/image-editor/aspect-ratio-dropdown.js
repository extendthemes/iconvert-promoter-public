/**
 * WordPress dependencies
 */
import { check, aspectRatio as aspectRatioIcon } from '@wordpress/icons';
import { DropdownMenu, MenuGroup, MenuItem } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { POPOVER_PROPS } from './constants';
import { useImageEditingContext } from './context';

function AspectGroup( { aspectRatios, isDisabled, label, onClick, value } ) {
	return (
		<MenuGroup label={ label }>
			{ aspectRatios.map( ( { title, aspect } ) => (
				<MenuItem
					key={ aspect }
					disabled={ isDisabled }
					onClick={ () => {
						onClick( aspect );
					} }
					role="menuitemradio"
					isSelected={ aspect === value }
					icon={ aspect === value ? check : undefined }
				>
					{ title }
				</MenuItem>
			) ) }
		</MenuGroup>
	);
}

export default function AspectRatioDropdown( { toggleProps } ) {
	const { isInProgress, aspect, setAspect, defaultAspect } =
		useImageEditingContext();

	return (
		<DropdownMenu
			icon={ aspectRatioIcon }
			label={ __( 'Aspect Ratio', 'kubio' ) }
			popoverProps={ POPOVER_PROPS }
			toggleProps={ toggleProps }
			className="wp-block-image__aspect-ratio"
		>
			{ ( { onClose } ) => (
				<>
					<AspectGroup
						isDisabled={ isInProgress }
						onClick={ ( newAspect ) => {
							setAspect( newAspect );
							onClose();
						} }
						value={ aspect }
						aspectRatios={ [
							// All ratios should be mirrored in AspectRatioTool in @wordpress/block-editor.
							{
								title: __( 'Original', 'kubio' ),
								aspect: defaultAspect,
							},
							{
								title: __( 'Square', 'kubio' ),
								aspect: 1,
							},
						] }
					/>
					<AspectGroup
						label={ __( 'Landscape', 'kubio' ) }
						isDisabled={ isInProgress }
						onClick={ ( newAspect ) => {
							setAspect( newAspect );
							onClose();
						} }
						value={ aspect }
						aspectRatios={ [
							{
								title: __( '16:9', 'kubio' ),
								aspect: 16 / 9,
							},
							{
								title: __( '4:3', 'kubio' ),
								aspect: 4 / 3,
							},
							{
								title: __( '3:2', 'kubio' ),
								aspect: 3 / 2,
							},
						] }
					/>
					<AspectGroup
						label={ __( 'Portrait', 'kubio' ) }
						isDisabled={ isInProgress }
						onClick={ ( newAspect ) => {
							setAspect( newAspect );
							onClose();
						} }
						value={ aspect }
						aspectRatios={ [
							{
								title: __( '9:16', 'kubio' ),
								aspect: 9 / 16,
							},
							{
								title: __( '3:4', 'kubio' ),
								aspect: 3 / 4,
							},
							{
								title: __( '2:3', 'kubio' ),
								aspect: 2 / 3,
							},
						] }
					/>
				</>
			) }
		</DropdownMenu>
	);
}
