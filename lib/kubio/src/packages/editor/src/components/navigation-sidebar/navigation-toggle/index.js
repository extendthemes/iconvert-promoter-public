/**
 * WordPress dependencies
 */
import { HamburgerMenu } from '@kubio/icons';
import { Button, Icon } from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { STORE_KEY } from '../../../store/constants';

function NavigationToggle({ isOpen }) {
	const { isActive } = useSelect((select) => {
		const { isFeatureActive } = select(STORE_KEY);
		return {
			isActive: isFeatureActive('fullscreenMode'),
		};
	}, []);

	const { setIsNavigationPanelOpened } = useDispatch(STORE_KEY);

	if (!isActive) {
		return null;
	}

	const buttonIcon = <Icon size="36px" icon={HamburgerMenu} />;

	return (
		<div
			className={
				'edit-site-navigation-toggle' + (isOpen ? ' is-open' : '')
			}
		>
			<Button
				className="edit-site-navigation-toggle__button has-icon"
				label={__('Toggle navigation', 'kubio')}
				onClick={() => setIsNavigationPanelOpened(!isOpen)}
				showTooltip
			>
				{buttonIcon}
			</Button>
		</div>
	);
}

export default NavigationToggle;
