/**
 * WordPress dependencies
 */
import { useEffect } from '@wordpress/element';
import { useDispatch, useSelect } from '@wordpress/data';
import {
	Modal,
	Button,
	__experimentalHStack as HStack,
} from '@wordpress/components';
import { __, _n } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { store as blockEditorStore } from '../../store';
import { unlock } from '../../lock-unlock';

export function BlockRemovalWarningModal( { rules } ) {
	const {
		clientIds,
		selectPrevious,
		blockNamesForPrompt,
		messageType,
		message,
	} = useSelect( ( select ) =>
		unlock( select( blockEditorStore ) ).getRemovalPromptData()
	);

	const {
		clearBlockRemovalPrompt,
		setBlockRemovalRules,
		privateRemoveBlocks,
	} = unlock( useDispatch( blockEditorStore ) );

	// Load block removal rules, simultaneously signalling that the block
	// removal prompt is in place.
	useEffect( () => {
		setBlockRemovalRules( rules );
		return () => {
			setBlockRemovalRules();
		};
	}, [ rules, setBlockRemovalRules ] );
	let realMessage = message;

	if ( ! message ) {
		if ( ! blockNamesForPrompt ) {
			return;
		}

		realMessage =
			messageType === 'templates'
				? _n(
						'Deleting this block will stop your post or page content from displaying on this template. It is not recommended.',
						'Deleting these blocks will stop your post or page content from displaying on this template. It is not recommended.',
						blockNamesForPrompt.length,
						'kubio'
				  )
				: _n(
						'Deleting this block could break patterns on your site that have content linked to it. Are you sure you want to delete it?',
						'Deleting these blocks could break patterns on your site that have content linked to them. Are you sure you want to delete them?',
						blockNamesForPrompt.length,
						'kubio'
				  );
	}

	const onConfirmRemoval = () => {
		privateRemoveBlocks( clientIds, selectPrevious, /* force */ true );
		clearBlockRemovalPrompt();
	};

	return (
		<Modal
			title={ __( 'Be careful!', 'kubio' ) }
			onRequestClose={ clearBlockRemovalPrompt }
			size="medium"
		>
			<p>{ realMessage }</p>
			<HStack justify="right">
				<Button
					variant="tertiary"
					onClick={ clearBlockRemovalPrompt }
					__next40pxDefaultSize
				>
					{ __( 'Cancel' ) }
				</Button>
				<Button
					variant="primary"
					onClick={ onConfirmRemoval }
					__next40pxDefaultSize
				>
					{ __( 'Delete' ) }
				</Button>
			</HStack>
		</Modal>
	);
}
