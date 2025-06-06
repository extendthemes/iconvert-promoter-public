/**
 * WordPress dependencies
 */
import {
	createSlotFill,
	ToolbarButton,
	ToolbarGroup,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { withDispatch } from '@wordpress/data';
import { cog } from '@wordpress/icons';

const { Fill, Slot } = createSlotFill( 'SettingsToolbarButton' );

const SettingsButton = ( { openGeneralSidebar } ) => (
	<ToolbarGroup>
		<ToolbarButton
			title={ __( 'Open Settings', 'kubio' ) }
			icon={ cog }
			onClick={ openGeneralSidebar }
		/>
	</ToolbarGroup>
);

const SettingsButtonFill = ( props ) => (
	<Fill>
		<SettingsButton { ...props } />
	</Fill>
);

const SettingsToolbarButton = withDispatch( ( dispatch ) => {
	const { openGeneralSidebar } = dispatch( 'core/edit-post' );

	return {
		openGeneralSidebar: () => openGeneralSidebar( 'edit-post/block' ),
	};
} )( SettingsButtonFill );

SettingsToolbarButton.Slot = Slot;

export default SettingsToolbarButton;
