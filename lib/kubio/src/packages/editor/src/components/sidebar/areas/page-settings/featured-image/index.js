/**
 * External dependencies
 */
import { PanelBody } from '@wordpress/components';
import { compose } from '@wordpress/compose';
import { store as coreStore } from '@wordpress/core-data';
import { withSelect } from '@wordpress/data';
import { PostFeaturedImage, PostFeaturedImageCheck } from '@wordpress/editor';
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { get } from 'lodash';
import { STORE_KEY } from '../../../../../../build/store/constants';

function FeaturedImage({ postType }) {
	return (
		<PostFeaturedImageCheck>
			<PanelBody
				title={get(
					postType,
					['labels', 'featured_image'],
					__('Featured image', 'kubio')
				)}
			>
				<PostFeaturedImage />
			</PanelBody>
		</PostFeaturedImageCheck>
	);
}

const applyWithSelect = withSelect((select) => {
	const { getCurrentPostType } = select(STORE_KEY);
	const { getPostType } = select(coreStore);
	return {
		postType: getPostType(getCurrentPostType()),
	};
});

export default compose(applyWithSelect)(FeaturedImage);
