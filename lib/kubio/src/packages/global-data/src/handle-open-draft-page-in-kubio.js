import { reactRender } from '@kubio/core';
import {
	Button,
	Modal,
	ToggleControl,
	__experimentalInputControl as InputControl,
} from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import { useCallback, useEffect, useState } from '@wordpress/element';
import { addAction } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

const EditDrafInKubioModal = ({ url }) => {
	const [isOpen, setIsOpen] = useState(true);
	const [isPrivate, setIsPrivate] = useState(false);
	const [isBusy, setIsBusy] = useState(false);

	const { savePost, editPost } = useDispatch('core/editor');

	const { initialTitle, isSaved, hasDirtyEntities } = useSelect((select) => {
		const status = select('core/editor').getEditedPostAttribute('status');
		return {
			initialTitle: select('core/editor').getEditedPostAttribute('title'),
			isSaved: status === 'publish' || status === 'private',
			hasDirtyEntities:
				select('core').__experimentalGetDirtyEntityRecords().length !==
				0,
		};
	}, []);

	const [title, setTitle] = useState(initialTitle);

	useEffect(() => {
		if (isBusy && isSaved && !hasDirtyEntities) {
			window.location = url;
		}
	}, [isBusy, isSaved, hasDirtyEntities]);

	const onFormSubmit = useCallback(
		(event) => {
			setIsBusy(true);
			event.preventDefault();
			editPost({
				status: isPrivate ? 'private' : 'publish',
				title,
			});
			savePost();
		},
		[isPrivate, title]
	);

	return (
		isOpen && (
			<Modal
				title={__('Edit page in Kubio', 'kubio')}
				onRequestClose={() => {
					setIsOpen(false);
				}}
			>
				<form
					onSubmit={onFormSubmit}
					style={{ display: 'flex', flexDirection: 'column' }}
				>
					<p>
						{__(
							'To edit this page with Kubio you need to publish the page first',
							'kubio'
						)}
					</p>
					<InputControl
						value={title}
						label={__('Page Title', 'kubio')}
						onKeyPress={(event) => setTitle(event.target.value)}
						onChange={(value) => setTitle(value)}
					/>
					<p></p>
					<ToggleControl
						label={__(
							'Make the page private, so only logged in users can see it',
							'kubio'
						)}
						checked={isPrivate}
						onChange={() => {
							setIsPrivate((state) => !state);
						}}
					/>
					<Button
						style={{ display: 'inline-block' }}
						variant="primary"
						type="submit"
						className="editor-post-taxonomies__hierarchical-terms-submit"
						isBusy={isBusy}
					>
						{__('Publish and edit with Kubio', 'kubio')}
					</Button>
				</form>
			</Modal>
		)
	);
};

const handleOpenDraftPageInKubio = ({ target, url }) => {
	const div = document.createElement('div');
	target.parentElement.appendChild(div);

	reactRender(<EditDrafInKubioModal url={url} />, div);
};

addAction(
	'kubio.post-edit.button-created',
	'kubio.post-edit.button-created',
	({ target, url }) => {
		const search = new URLSearchParams(window.location.search);

		if (search.get('kubio-publish-draft')) {
			handleOpenDraftPageInKubio({ target, url });
		}
	}
);

export { handleOpenDraftPageInKubio };
