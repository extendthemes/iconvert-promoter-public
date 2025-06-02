import { ControlNotice, ToggleControl } from '@kubio/controls';
import { useGlobalDataSetting } from '@kubio/global-data';
import { __ } from '@wordpress/i18n';

const GoogleFontsSettings = () => {
	const [value, setValue] = useGlobalDataSetting(`googleFonts.serveLocally`);

	return (
		<>
			<ToggleControl
				label={__('Serve Google Fonts locally', 'kubio')}
				value={value}
				onChange={setValue}
			/>

			<ControlNotice
				className={'notice-general-settings no-padding'}
				content={__(
					'When this option is turned on the Google Fonts used in your site will be downloaded and served from your server instead of the Google server. This will minimize the DNS requests, reduce the Cumulative Layout Shift and serve your Google Fonts in a 100% GDPR compliant way.',
					'kubio'
				)}
			/>
		</>
	);
};

export { GoogleFontsSettings };
