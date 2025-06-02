import { useSelect } from '@wordpress/data';
import { Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { wordpress } from '@wordpress/icons';
import { STORE_KEY } from '../../../store/constants';

function FullscreenModeClose({ icon }) {
	const isActive = useSelect((select) => {
		return select(STORE_KEY).isFeatureActive('fullscreenMode');
	}, []);

	if (!isActive) {
		return null;
	}

	const buttonIcon = icon || wordpress;

	return (
		<Button
			className="edit-site-fullscreen-mode-close"
			icon={buttonIcon}
			iconSize={36}
			href="index.php"
			label={__('Back', 'kubio')}
		/>
	);
}

export default FullscreenModeClose;
