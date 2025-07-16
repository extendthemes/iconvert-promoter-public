/**
 * WordPress dependencies
 */
import { KubioLogo } from '@kubio/icons';
import { Button, Icon } from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { STORE_KEY } from '@kubio/editor';

function NavigationToggle( { isOpen } ) {
	const { isActive } = useSelect( ( select ) => {
		const { isFeatureActive } = select( STORE_KEY );
		return {
			isActive: isFeatureActive( 'fullscreenMode' ),
		};
	}, [] );

	const { setIsNavigationPanelOpened } = useDispatch( STORE_KEY );

	if ( ! isActive ) {
		return null;
	}

	return (
		<div
			className={
				'edit-site-navigation-toggle' + ( isOpen ? ' is-open' : '' )
			}
		>
			<Button
				className="edit-site-navigation-toggle__button has-icon"
				label={ __( 'My Popups', 'iconvert-promoter' ) }
				//onClick={() => setIsNavigationPanelOpened(!isOpen)}
				href="admin.php?page=iconvertpr-promoter"
				showTooltip
			>
				<Icon size="56px" icon="arrow-left-alt" />
			</Button>
		</div>
	);
}

export default NavigationToggle;
