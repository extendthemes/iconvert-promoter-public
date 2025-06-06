import { Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { withDispatch } from '@wordpress/data';

const SettingsHeader = ({
	openDocumentSettings,
	openBlockSettings,
	sidebarName,
}) => {
	const blockLabel = __('Block', 'kubio');
	const [documentAriaLabel, documentActiveClass] =
		sidebarName === 'edit-post/document'
			? // translators: ARIA label for the Document sidebar tab, selected.
			  [__('Document (selected)', 'kubio'), 'is-active']
			: // translators: ARIA label for the Document sidebar tab, not selected.
			  [__('Document', 'kubio'), ''];

	const [blockAriaLabel, blockActiveClass] =
		sidebarName === 'edit-post/block'
			? // translators: ARIA label for the Settings Sidebar tab, selected.
			  [__('Block (selected)', 'kubio'), 'is-active']
			: // translators: ARIA label for the Settings Sidebar tab, not selected.
			  [__('Block', 'kubio'), ''];

	/* Use a list so screen readers will announce how many tabs there are. */
	return (
		<ul>
			<li>
				<Button
					onClick={openDocumentSettings}
					className={`edit-post-sidebar__panel-tab ${documentActiveClass}`}
					aria-label={documentAriaLabel}
					data-label={__('Document', 'kubio')}
				>
					{__('Document', 'kubio')}
				</Button>
			</li>
			<li>
				<Button
					onClick={openBlockSettings}
					className={`edit-post-sidebar__panel-tab ${blockActiveClass}`}
					aria-label={blockAriaLabel}
					data-label={blockLabel}
				>
					{blockLabel}
				</Button>
			</li>
		</ul>
	);
};

export default withDispatch((dispatch) => {
	const { openGeneralSidebar } = dispatch('core/edit-post');
	return {
		openDocumentSettings() {
			openGeneralSidebar('edit-post/document');
		},
		openBlockSettings() {
			openGeneralSidebar('edit-post/block');
		},
	};
})(SettingsHeader);
