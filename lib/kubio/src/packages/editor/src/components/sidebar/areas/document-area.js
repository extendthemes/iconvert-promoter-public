import { __ } from '@wordpress/i18n';
import { usePageTitle } from '../../../hooks/use-page-title';
import SectionsList from '../sections-list';
import SidebarArea from '../sidebar-area';
import GeneralSettingsArea from './general-settings';
import MenusSettingsArea from './menus-settings';
import PageSettingsArea from './page-settings';
import { fromHtmlEntities } from '@kubio/utils';
import { BlogImportArea } from './blog-import';
import { UpgradeToPro } from '@kubio/pro';
import { useUIVersion } from '@kubio/core-hooks';

export default function DocumentArea({
	beforeSectionsList,
	afterSectionsList,
}) {
	const pageTitle = usePageTitle();
	const urlArgs = { source: 'sidebar', content: 'pro-upgrade' };
	const { uiVersion: KUBIO_UI_VERSION } = useUIVersion();

	return (
		<SidebarArea
			title={
				<>
					<span className="preview-notice">
						{__('You are editing', 'kubio')}
					</span>
					<span className="panel-title site-title">
						{fromHtmlEntities(pageTitle)}
					</span>
				</>
			}
			areaIdentifier="document"
		>
			{beforeSectionsList}
			{KUBIO_UI_VERSION === 1 && (
				<PageSettingsArea parentAreaIdentifier={'document'} />
			)}

			<BlogImportArea />

			<SectionsList />
			{KUBIO_UI_VERSION === 2 && (
				<PageSettingsArea parentAreaIdentifier={'document'} />
			)}

			<GeneralSettingsArea parentAreaIdentifier={'document'} />
			<MenusSettingsArea parentAreaIdentifier={'document'} />
			<UpgradeToPro urlArgs={urlArgs} />
			{afterSectionsList}
		</SidebarArea>
	);
}
