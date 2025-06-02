/**
 * WordPress dependencies
 */
import { PanelBody, PanelRow } from '@wordpress/components';
import {
	PostComments,
	PostPingbacks,
	PostTypeSupportCheck,
} from '@wordpress/editor';
import { __ } from '@wordpress/i18n';

function DiscussionPanel() {
	return (
		<PostTypeSupportCheck supportKeys={['comments', 'trackbacks']}>
			<PanelBody title={__('Discussion', 'kubio')}>
				<PostTypeSupportCheck supportKeys="comments">
					<PanelRow>
						<PostComments />
					</PanelRow>
				</PostTypeSupportCheck>

				<PostTypeSupportCheck supportKeys="trackbacks">
					<PanelRow>
						<PostPingbacks />
					</PanelRow>
				</PostTypeSupportCheck>
			</PanelBody>
		</PostTypeSupportCheck>
	);
}

export default DiscussionPanel;
