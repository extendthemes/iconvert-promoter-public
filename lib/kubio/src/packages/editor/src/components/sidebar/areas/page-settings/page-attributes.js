/**
 * External dependencies
 */
import { PanelBody, PanelRow } from '@wordpress/components';
import { store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import {
	PageAttributesCheck,
	PageAttributesOrder,
	PageAttributesParent,
} from '@wordpress/editor';
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { get } from 'lodash';
import { STORE_KEY } from '../../../../../build/store/constants';

export function PageAttributes() {
	const { postType } = useSelect((select) => {
		const { getCurrentPostType } = select(STORE_KEY);

		const { getPostType } = select(coreStore);
		return {
			postType: getPostType(getCurrentPostType()),
		};
	}, []);

	if (!postType) {
		return null;
	}

	return (
		<PageAttributesCheck>
			<PanelBody
				title={get(
					postType,
					['labels', 'attributes'],
					__('Page attributes', 'kubio')
				)}
			>
				<PageAttributesParent />
				<PanelRow>
					<PageAttributesOrder />
				</PanelRow>
			</PanelBody>
		</PageAttributesCheck>
	);
}

export default PageAttributes;
