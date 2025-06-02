import { __ } from '@wordpress/i18n';
import { PostContentComponent } from './component';
import { useNoticeOnBlockRemove } from '@kubio/core';
import { Content } from './inspector/content';

export default function PostContentEdit(props) {
	const {
		context: { postId: contextPostId, postType: contextPostType },
	} = props;

	useNoticeOnBlockRemove(
		__(
			'You just deleted the Post Content block. Without a Post Content block the current template might not work across multiple pages',
			'kubio'
		)
	);

	if (contextPostId && contextPostType) {
		return (
			<>
				<Content />
				<PostContentComponent {...props} />
			</>
		);
	}
	return <p>{__('This is a placeholder for post content.', 'kubio')}</p>;
}
