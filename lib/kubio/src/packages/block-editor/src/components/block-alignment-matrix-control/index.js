/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { DOWN } from '@wordpress/keycodes';
import {
	ToolbarButton,
	Dropdown,
	AlignmentMatrixControl as __AlignmentMatrixControl,
  	__experimentalAlignmentMatrixControl,
} from '@wordpress/components';


const AlignmentMatrixControl = __AlignmentMatrixControl || __experimentalAlignmentMatrixControl

const noop = () => {};

function BlockAlignmentMatrixControl( props ) {
	const {
		label = __( 'Change matrix alignment' ),
		onChange = noop,
		value = 'center',
		isDisabled,
	} = props;

	const icon = <AlignmentMatrixControl.Icon value={ value } />;

	return (
		<Dropdown
			position="bottom right"
			popoverProps={ { placement: 'bottom-start' } }
			renderToggle={ ( { onToggle, isOpen } ) => {
				const openOnArrowDown = ( event ) => {
					if ( ! isOpen && event.keyCode === DOWN ) {
						event.preventDefault();
						onToggle();
					}
				};

				return (
					<ToolbarButton
						onClick={ onToggle }
						aria-haspopup="true"
						aria-expanded={ isOpen }
						onKeyDown={ openOnArrowDown }
						label={ label }
						icon={ icon }
						showTooltip
						disabled={ isDisabled }
					/>
				);
			} }
			renderContent={ () => (
				<AlignmentMatrixControl
					hasFocusBorder={ false }
					onChange={ onChange }
					value={ value }
				/>
			) }
		/>
	);
}

export default BlockAlignmentMatrixControl;
