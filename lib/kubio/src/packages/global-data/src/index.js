import useGlobalDataEntity from './use-global-data-entity';
import useGlobalDataColors, {
	generateVariants,
	normalizePalette,
} from './use-global-data-colors';
import useGlobalDataStyle from './use-global-data-style';
import useGlobalDataFonts from './use-global-data-fonts';
import useGlobalAlternateLogo from './use-global-alternate-logo';
import useSiteLogoImages from './use-site-logo-images';
import useGlobalPageTitleTemplates from './use-page-title-templates';
import useGlobalDataMenuLocations from './use-global-data-menu-locations';
import useGlobalAdditionalCSS from './use-global-additional-css';
import useGlobalDataSetting from './use-global-data-settings';

import styleInitialize from './global-style-initializer';
import './with-global-style/filters';
import { addAction } from '@wordpress/hooks';
import { handleOpenDraftPageInKubio } from './handle-open-draft-page-in-kubio';

styleInitialize();

addAction(
	'kubio.post-edit.open-draft-page',
	'kubio.post-edit.open-draft-page',
	handleOpenDraftPageInKubio
);

export * from './use-inherited-data';
export * from './with-global-style/global-style-context';
export * from './with-global-style/inherited-style-context';
export * from './with-global-style/global-data-context';
export * from './use-get-form-data-with-inherited';

export {
	useGlobalDataEntity,
	useGlobalDataStyle,
	useGlobalDataColors,
	useGlobalDataFonts,
	useGlobalAlternateLogo,
	useSiteLogoImages,
	useGlobalPageTitleTemplates,
	useGlobalDataMenuLocations,
	useGlobalAdditionalCSS,
	generateVariants as generateColorVariants,
	normalizePalette as normalizeColorPalette,
	useGlobalDataSetting,
};
