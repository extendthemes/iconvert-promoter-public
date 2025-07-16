import { __ } from '@wordpress/i18n';

import { fromHtmlEntities } from '@kubio/utils';
import { SidebarComponents, usePageTitle } from '@kubio/editor';
import GeneralSettingsArea from './general-settings';
const { SectionsList, SidebarArea } = SidebarComponents;

export default function DocumentArea( {
	beforeSectionsList,
	afterSectionsList,
} ) {
	const pageTitle = usePageTitle();

	return (
		<SidebarArea
			title={
				<>
					<span className="preview-notice">
						{ __( 'You are editing', 'iconvert-promoter' ) }
					</span>
					<span className="panel-title site-title">
						{ fromHtmlEntities( pageTitle ) }
					</span>
				</>
			}
			areaIdentifier="document"
		>
			{ beforeSectionsList }
			{ /*<SectionsList />*/ }
			<GeneralSettingsArea parentAreaIdentifier={ 'document' } />
			{ afterSectionsList }
		</SidebarArea>
	);
}
