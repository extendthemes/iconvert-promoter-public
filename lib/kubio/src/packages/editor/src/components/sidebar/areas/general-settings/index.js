import { __ } from '@wordpress/i18n';
import SubSidebarArea from '../../subsidebar-area';
import AdditionalCSS from './additional-css';
import ColorSchemeArea from './color-scheme-area';
import GlobalEffectsArea from './effects-area';
import { GlobalFormStyle } from './global-form-style';
import GlobalTypography from './global-typography';
import SiteIdentity from './site-identity';
import GlobalSpacingArea from './spacing-area';

export default function GeneralSettingsArea({ parentAreaIdentifier }) {
	const AREA_IDENTIFIER = `${parentAreaIdentifier}/general-settings`;

	return (
		<>
			<SubSidebarArea
				title={__('General Settings', 'kubio')}
				areaIdentifier={AREA_IDENTIFIER}
			>
				<SiteIdentity parentAreaIdentifier={AREA_IDENTIFIER} />
				<GlobalTypography parentAreaIdentifier={AREA_IDENTIFIER} />
				<GlobalFormStyle parentAreaIdentifier={AREA_IDENTIFIER} />
				{/* <Templates parentAreaIdentifier={AREA_IDENTIFIER} /> */}
				<ColorSchemeArea parentAreaIdentifier={AREA_IDENTIFIER} />
				<GlobalSpacingArea parentAreaIdentifier={AREA_IDENTIFIER} />
				<GlobalEffectsArea parentAreaIdentifier={AREA_IDENTIFIER} />
				<AdditionalCSS parentAreaIdentifier={AREA_IDENTIFIER} />
				{/*<CoreGlobalStylesArea parentAreaIdentifier={AREA_IDENTIFIER} />*/}
			</SubSidebarArea>
		</>
	);
}
