import {
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	Button,
	ButtonGroup,
	Popover,
	Placeholder,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useRef } from '@wordpress/element';
import { useOnClickOutside } from '@kubio/utils';
import { closeSmall } from '@wordpress/icons';
import {
	dispatch as globalDispatch,
	select as globalSelect,
} from '@wordpress/data';
import { STORE_KEY as KUBIO_STORE_KEY } from '@kubio/constants';

const PATTERNS_KEY = '__experimentalBlockPatterns';
const RemoveSectionPopover = ( { containerRef, pattern, onClose } ) => {
	const onClickDelete = async () => {
		await removeCustomPattern( pattern?.name );
		onClose();
	};

	const innerRef = useRef();
	useOnClickOutside( innerRef, onClose );

	return (
		<Popover
			className={ 'kubio-options-popover kubio-remove-section-popover' }
			anchorRef={ containerRef }
			position={ 'top center' }
			offset={ 6 }
		>
			<div
				className={ 'kubio-remove-section-popover-inner' }
				role={ 'button' }
				tabIndex={ 0 }
				ref={ innerRef }
				onMouseDown={ ( event ) => {
					event.stopPropagation();
				} }
			>
				<Placeholder className="wp-block-navigation-placeholder kubio-remove-section-placeholder">
					{ pattern?.title && (
						<div className="kubio-remove-section-popover__header">
							<h1 className="kubio-remove-section-popover__header-heading">
								{ __( 'Remove ', 'kubio' ) +
									pattern?.title +
									__( ' section?', 'kubio' ) }
							</h1>
							<Button onClick={ onClose } icon={ closeSmall } />
						</div>
					) }
					<p>
						{ __(
							'This will permanently delete the custom section.',
							'kubio'
						) }
					</p>
					<ButtonGroup
						className={
							'kubio-remove-section-popover__button-group'
						}
					>
						<Button isLink onClick={ onClose }>
							{ __( 'Cancel', 'kubio' ) }
						</Button>
						<Button isPrimary onClick={ onClickDelete }>
							{ __( 'Delete', 'kubio' ) }
						</Button>
					</ButtonGroup>
				</Placeholder>
			</div>
		</Popover>
	);
};

const removeCustomPattern = ( sectionName ) => {
	const id = sectionName.split( '/' ).pop();

	globalDispatch( 'core' ).deleteEntityRecord(
		'postType',
		'kubio_section',
		parseInt( id )
	);

	const settings = globalSelect( KUBIO_STORE_KEY ).getSettings();
	const patterns = settings[ PATTERNS_KEY ];
	const nextPatterns = patterns.filter(
		( pattern ) => pattern.name !== sectionName
	);

	const { updateSettings } = globalDispatch( KUBIO_STORE_KEY );

	updateSettings( {
		...settings,
		[ PATTERNS_KEY ]: nextPatterns,
	} );
};

export { RemoveSectionPopover };
