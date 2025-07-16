import { Button } from '@wordpress/components';
import { useDispatch } from '@wordpress/data';
import { useCallback, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { importKubioBlog } from '../../../kubio-blog-template/import-kubio-blog';
import { useGlobalSessionProp } from '@kubio/editor-data';
import { useIsThirdPartyBlog } from '../../../kubio-blog-template/use-is-3rd-party-blog';

const BlogImportArea = () => {
	const [isInstalling, setIsInstalling] = useState(false);

	const [
		wasThirdPartyBlogInstalled,
		setThirdPartyBlogImported,
	] = useGlobalSessionProp('thirdPartyBlockInstalled', false);

	const isThirdPartyBlog = useIsThirdPartyBlog();

	const { createSuccessNotice, createErrorNotice } = useDispatch(
		'core/notices'
	);

	const handleImportBlog = useCallback(async () => {
		setIsInstalling(true);
		try {
			await importKubioBlog();
		} catch (e) {
			createErrorNotice(
				__(
					'There was an error while importing the Kubio blog. Please try again',
					'kubio'
				)
			);
			return;
		}
		setThirdPartyBlogImported(true);
		createSuccessNotice(
			__(
				'Kubio blog templates were imported successfully! Refresh the editor to enjoy the full site editing experience',
				'kubio'
			),
			{
				isDismissible: true,
				actions: [
					{
						label: __('Refresh page now', 'kubio'),
						onClick: () => window.location.reload(),
					},
				],
			}
		);

		setIsInstalling(false);
	}, []);

	if (!isThirdPartyBlog || (isThirdPartyBlog && wasThirdPartyBlogInstalled)) {
		return <></>;
	}

	return (
		<div className="kubio-sidebar-blog-area-import">
			<h2>{__('💫 Start with the Kubio blog!', 'kubio')}</h2>
			<p>
				{__(
					'Kubio comes with a fully customizable blog area for your site.',
					'kubio'
				)}
				<br />
				{__(
					'Would you like to use the Kubio blog templates? ',
					'kubio'
				)}
			</p>
			<Button isPrimary isBusy={isInstalling} onClick={handleImportBlog}>
				{!isInstalling && __('Import Kubio blog', 'kubio')}
				{isInstalling && __('Importing Kubio blog…', 'kubio')}
			</Button>
		</div>
	);
};

export { BlogImportArea };
