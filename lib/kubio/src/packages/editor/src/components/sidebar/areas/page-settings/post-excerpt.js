/**
 * WordPress dependencies
 */
import { PanelBody } from '@wordpress/components';
import {
	PostExcerpt as PostExcerptForm,
	PostExcerptCheck,
} from '@wordpress/editor';
import { __ } from '@wordpress/i18n';

function PostExcerpt() {
	return (
		<PostExcerptCheck>
			<PanelBody title={__('Excerpt', 'kubio')}>
				<PostExcerptForm />
			</PanelBody>
		</PostExcerptCheck>
	);
}

export default PostExcerpt;
