import { __ } from '@wordpress/i18n';
import { SidebarComponents } from '@kubio/editor';

const { SubSidebarArea, AdditionalCSS, ColorSchemeArea, GlobalTypography } =
	SidebarComponents;

export default function GeneralSettingsArea( { parentAreaIdentifier } ) {
	const AREA_IDENTIFIER = `${ parentAreaIdentifier }/general-settings`;

	return (
		<>
			<SubSidebarArea
				title={ __( 'General Settings', 'iconvert-promoter' ) }
				areaIdentifier={ AREA_IDENTIFIER }
			>
				<GlobalTypography parentAreaIdentifier={ AREA_IDENTIFIER } />
				<ColorSchemeArea parentAreaIdentifier={ AREA_IDENTIFIER } />
				<AdditionalCSS />
			</SubSidebarArea>
		</>
	);
}
