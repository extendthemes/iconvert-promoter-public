/**
 * WordPress dependencies
 */
import { ToolbarDropdownMenu, ToolbarGroup } from '@wordpress/components';
import {
	justifyLeft,
	justifyCenter,
	justifyRight,
	justifySpaceBetween,
	justifyStretch,
} from '@wordpress/icons';
import { __ } from '@wordpress/i18n';

const icons = {
	left: justifyLeft,
	center: justifyCenter,
	right: justifyRight,
	'space-between': justifySpaceBetween,
	stretch: justifyStretch,
};

function JustifyContentUI( {
	allowedControls = [ 'left', 'center', 'right', 'space-between' ],
	isCollapsed = true,
	onChange,
	value,
	popoverProps,
	isToolbar,
} ) {
	// If the control is already selected we want a click
	// again on the control to deselect the item, so we
	// call onChange( undefined )
	const handleClick = ( next ) => {
		if ( next === value ) {
			onChange( undefined );
		} else {
			onChange( next );
		}
	};

	const icon = value ? icons[ value ] : icons.left;
	const allControls = [
		{
			name: 'left',
			icon: justifyLeft,
			title: __( 'Justify items left', 'kubio' ),
			isActive: 'left' === value,
			onClick: () => handleClick( 'left' ),
		},
		{
			name: 'center',
			icon: justifyCenter,
			title: __( 'Justify items center', 'kubio' ),
			isActive: 'center' === value,
			onClick: () => handleClick( 'center' ),
		},
		{
			name: 'right',
			icon: justifyRight,
			title: __( 'Justify items right', 'kubio' ),
			isActive: 'right' === value,
			onClick: () => handleClick( 'right' ),
		},
		{
			name: 'space-between',
			icon: justifySpaceBetween,
			title: __( 'Space between items', 'kubio' ),
			isActive: 'space-between' === value,
			onClick: () => handleClick( 'space-between' ),
		},
		{
			name: 'stretch',
			icon: justifyStretch,
			title: __( 'Stretch items', 'kubio' ),
			isActive: 'stretch' === value,
			onClick: () => handleClick( 'stretch' ),
		},
	];

	const UIComponent = isToolbar ? ToolbarGroup : ToolbarDropdownMenu;
	const extraProps = isToolbar ? { isCollapsed } : {};

	return (
		<UIComponent
			icon={ icon }
			popoverProps={ popoverProps }
			label={ __( 'Change items justification', 'kubio' ) }
			controls={ allControls.filter( ( elem ) =>
				allowedControls.includes( elem.name )
			) }
			{ ...extraProps }
		/>
	);
}

export default JustifyContentUI;
