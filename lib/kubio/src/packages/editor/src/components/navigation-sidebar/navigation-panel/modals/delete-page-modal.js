import {
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	Button,
	ButtonGroup,
	Modal,
} from '@wordpress/components';
import { sprintf, __ } from '@wordpress/i18n';
import { dispatch as globalDispatch } from '@wordpress/data';
import { useKubioNotices } from '@kubio/core';
import { useState } from '@wordpress/element';

const DeletePageModal = ({ post, onCloseModal }) => {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { createErrorNotice, createSuccessNotice } = useKubioNotices();

	const onClickDelete = async () => {
		setIsSubmitting(true);
		await deletePage(post, createErrorNotice, createSuccessNotice);
		onCloseModal();
	};

	return (
		<Modal
			title={
				__('Delete ', 'kubio') +
				post?.title?.raw +
				__(' page?', 'kubio')
			}
			onRequestClose={(event) => {
				event.stopPropagation();
				onCloseModal();
			}}
			className="block-editor-block-new-entity-modal"
			shouldCloseOnEsc={!isSubmitting}
			shouldCloseOnClickOutside={!isSubmitting}
			isDismissible={!isSubmitting}
		>
			<p>
				<span
					dangerouslySetInnerHTML={{
						__html: sprintf(
							// translators: %s: page name
							__(
								'The <strong>%s</strong> page will be moved in the trash.',
								'kubio'
							),
							post?.title?.raw
						),
					}}
				/>
				<br />
				{__(
					'You can recover it later from WP Admin -> Pages -> Trash',
					'kubio'
				)}
			</p>
			<ButtonGroup className={'h-template-part-modal__button-group'}>
				<Button isLink onClick={onCloseModal}>
					{__('Cancel', 'kubio')}
				</Button>
				<Button isPrimary onClick={onClickDelete}>
					{__('Delete', 'kubio')}
				</Button>
			</ButtonGroup>
		</Modal>
	);
};

const deletePage = (post, createErrorNotice, createSuccessNotice) => {
	const id = post.id;
	const postTitle = post?.title?.raw;

	try {
		globalDispatch('core').deleteEntityRecord(
			'postType',
			post.type,
			parseInt(id)
		);

		createSuccessNotice(postTitle + __(' moved to trash!', 'kubio'));
	} catch (e) {
		createErrorNotice(
			sprintf(
				//translators: $s is the page name
				__('An error occurred. %s was not saved', 'kubio'),
				postTitle
			)
		);
	}
};

export { DeletePageModal };
