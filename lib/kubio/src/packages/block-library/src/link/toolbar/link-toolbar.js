import { LinkControlWithData } from '@kubio/controls';
import { DataHelperContextFromClientId } from '@kubio/inspectors';
import { Popover, ToolbarButton, ToolbarGroup } from '@wordpress/components';
import { BlockControls } from '@wordpress/block-editor';
import { useRef, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { link, plusCircle } from '@wordpress/icons';

const LinkToolbarControl = ( props ) => {
	const { isSelected, clientId, dataHelper, withEditLink = true } = props;
	const [ isURLPickerOpen, setIsURLPickerOpen ] = useState( false );

	const openLinkControl = () => {
		setIsURLPickerOpen( true );
		return false; // prevents default behaviour for event
	};

	const anchorRef = useRef();

	const linkControl = isURLPickerOpen && isSelected && (
		<Popover
			position="center top"
			className={ 'kubio-color-popover' }
			onClose={ () => setIsURLPickerOpen( false ) }
			anchorRef={ anchorRef?.current }
		>
			<DataHelperContextFromClientId clientId={ clientId }>
				<LinkControlWithData />
			</DataHelperContextFromClientId>
		</Popover>
	);

	const addButton = () => {
		dataHelper.duplicate( { unlink: true } );
	};

	return (
		<>
			{ withEditLink && (
				<BlockControls>
					<ToolbarGroup>
						<ToolbarButton
							name="link"
							icon={ link }
							title={ __( 'Link', 'kubio' ) }
							onClick={ openLinkControl }
							ref={ anchorRef }
						/>
					</ToolbarGroup>
				</BlockControls>
			) }
			{ linkControl }
			<BlockControls>
				<ToolbarGroup>
					<ToolbarButton
						icon={ plusCircle }
						title={ __( 'Add', 'kubio' ) }
						onClick={ addButton }
					/>
				</ToolbarGroup>
			</BlockControls>
		</>
	);
};

export { LinkToolbarControl };
