/**
 * WordPress dependencies
 */
import { ToolbarButton } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { useImageEditingContext } from './context';

export default function FormControls() {
	const { isInProgress, apply, cancel } = useImageEditingContext();
	return (
		<>
			<ToolbarButton onClick={ apply } disabled={ isInProgress }>
				{ __( 'Apply', 'kubio' ) }
			</ToolbarButton>
			<ToolbarButton onClick={ cancel }>
				{ __( 'Cancel', 'kubio' ) }
			</ToolbarButton>
		</>
	);
}
