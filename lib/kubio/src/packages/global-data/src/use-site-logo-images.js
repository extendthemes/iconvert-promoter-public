import { useSelect, useDispatch } from '@wordpress/data';
import useGlobalAlternateLogo from './use-global-alternate-logo';
import { defaultAssetURL } from '@kubio/utils';
import { useCallback } from '@wordpress/element';

const useSiteLogoImages = () => {
	const {
		alternateLogo: alternateLogoImage,
		setAlternateLogo: setAlternateLogoImage,
	} = useGlobalAlternateLogo();

	const { logoImage, title } = useSelect((select) => {
		const siteSettings = select('core').getEditedEntityRecord(
			'root',
			'site'
		);

		// look for both site_logo and sitelogo options. Seems that site_logo is a newer prop
		const siteLogo = siteSettings?.site_logo || siteSettings?.sitelogo;

		const mediaItem =
			siteLogo &&
			select('core').getEntityRecord('root', 'media', siteLogo);
		return {
			logoImage: mediaItem?.source_url,
			title: siteSettings?.title,
		};
	}, []);

	const { editEntityRecord } = useDispatch('core');
	const setLogoImage = useCallback(
		(newValue) =>
			editEntityRecord('root', 'site', undefined, {
				site_logo: parseInt(newValue) ?? undefined,
			}),
		[]
	);

	return {
		title,
		logoImage: logoImage || defaultAssetURL('/logo-fallback.png'),
		alternateLogoImage:
			alternateLogoImage ||
			logoImage ||
			defaultAssetURL('/logo-fallback.png'),
		setLogoImage,
		setAlternateLogoImage,
		rawAlternateLogoImage: alternateLogoImage,
	};
};

export default useSiteLogoImages;
