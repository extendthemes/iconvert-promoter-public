import { InputControl } from '@kubio/controls';
import { useKubioNotices } from '@kubio/core';
import {
	Button,
	Modal,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalSpacer as Spacer,
} from '@wordpress/components';
import { dispatch as globalDispatch } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { sprintf, __ } from '@wordpress/i18n';

const DuplicatePageModal = ({ post, onCloseModal, onClickDuplicate }) => {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { createErrorNotice, createSuccessNotice } = useKubioNotices();
	const [addNewTitle, setAddNewTitle] = useState('');
	const { saveEntityRecord } = globalDispatch('core');

	const onNewRecord = async (kind, entity, currentTitle) => {
		setIsSubmitting(true);

		const newRecordData = {
			title: currentTitle || addNewTitle,
			status: 'publish',
			content: post?.content,
			excerpt: post?.excerpt,
			meta: {
				...(post?.meta || {}),
				saved_in_kubio: true,
			},
			template: post?.template,
		};

		let newRecordObject = false;

		try {
			newRecordObject = await saveEntityRecord(
				kind,
				entity,
				newRecordData
			);

			createSuccessNotice(
				sprintf(
					// eslint-disable-next-line @wordpress/i18n-translator-comments
					__('%s saved successfully!', 'kubio'),
					newRecordData.title
				)
			);
		} catch (e) {
			// eslint-disable-next-line no-console
			console.error(e);
			createErrorNotice(
				sprintf(
					// eslint-disable-next-line @wordpress/i18n-translator-comments
					__('An error occurred. %s was not saved!', 'kubio'),
					newRecordData.title
				)
			);
		}

		if (newRecordObject) {
			onClickDuplicate(newRecordObject);
		}
	};

	return (
		<Modal
			title={__('Duplicate page', 'kubio')}
			onRequestClose={(event) => {
				event.stopPropagation();
				onCloseModal();
			}}
			className="block-editor-block-new-entity-modal"
			shouldCloseOnEsc={!isSubmitting}
			shouldCloseOnClickOutside={!isSubmitting}
			isDismissible={!isSubmitting}
		>
			<div className={'popover__content'}>
				<InputControl
					value={addNewTitle}
					onChange={(value) => setAddNewTitle(value)}
					label={__('Title', 'kubio')}
					// eslint-disable-next-line jsx-a11y/no-autofocus
					autoFocus={true}
					onKeyPress={(event) => {
						if (event.key === 'Enter') {
							onNewRecord(
								'postType',
								post.type,
								event.target.value
							);
						}
					}}
				/>
				<Spacer margin={3} />
				<Button
					isPrimary
					isBusy={isSubmitting}
					disabled={addNewTitle !== '' ? false : true}
					onClick={() => {
						onNewRecord('postType', post.type);
					}}
					className={'add-button'}
				>
					{__('Duplicate page', 'kubio')}
				</Button>
			</div>
		</Modal>
	);
};

export { DuplicatePageModal };
