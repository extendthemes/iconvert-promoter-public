import { useGlobalSessionProp } from '@kubio/editor-data';
import { Button, ButtonGroup, Modal } from '@wordpress/components';
import { useDispatch } from '@wordpress/data';
import { useCallback, useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { importKubioBlog } from './import-kubio-blog';
import { useIsThirdPartyBlog } from './use-is-3rd-party-blog';
const KubioBlogTemplate = ({ children, templateId, templateType, page }) => {
	const [displayModal, setDisplayModal] = useState(false);
	const [isInstalling, setIsInstalling] = useState(false);

	const isThirdPartyBlog = useIsThirdPartyBlog();

	const [
		wasThirdPartyBlogInstalled,
		setThirdPartyBlogImported,
	] = useGlobalSessionProp('thirdPartyBlockInstalled', false);

	const { createSuccessNotice } = useDispatch('core/notices');

	useEffect(() => {
		setDisplayModal(isThirdPartyBlog);
	}, [isThirdPartyBlog, templateId, templateType, page]);

	const closeModal = useCallback(() => {
		if (isInstalling) {
			return;
		}

		setDisplayModal(false);
	}, [isInstalling]);

	const handleImportBlog = useCallback(async () => {
		setIsInstalling(true);
		try {
			await importKubioBlog();
		} catch (e) {}
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
		setDisplayModal(false);
	}, []);

	return (
		<>
			{displayModal && !wasThirdPartyBlogInstalled && (
				<Modal
					title={__('💫 Start with the Kubio blog!', 'kubio')}
					onRequestClose={closeModal}
					shouldCloseOnEsc={false}
					shouldCloseOnClickOutside={false}
					isDismissible={!isInstalling}
				>
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
					<ButtonGroup
						className={'h-template-part-modal__button-group'}
					>
						{!isInstalling && (
							<Button isLink onClick={closeModal}>
								{__('Maybe later', 'kubio')}
							</Button>
						)}
						<Button
							isPrimary
							isBusy={isInstalling}
							onClick={handleImportBlog}
						>
							{!isInstalling && __('Import Kubio blog', 'kubio')}
							{isInstalling &&
								__('Importing Kubio blog…', 'kubio')}
						</Button>
					</ButtonGroup>
				</Modal>
			)}
			{children}
		</>
	);
};

export { KubioBlogTemplate };
