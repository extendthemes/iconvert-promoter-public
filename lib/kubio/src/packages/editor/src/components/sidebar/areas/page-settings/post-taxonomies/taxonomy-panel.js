/**
 * External dependencies
 */
import { get } from 'lodash';

/**
 * WordPress dependencies
 */
import { compose } from '@wordpress/compose';
import { PanelBody } from '@wordpress/components';
import { withSelect, withDispatch } from '@wordpress/data';

function TaxonomyPanel({ taxonomy, children }) {
	const taxonomyMenuName = get(taxonomy, ['labels', 'menu_name']);
	if (!taxonomyMenuName) {
		return null;
	}

	return <PanelBody title={taxonomyMenuName}>{children}</PanelBody>;
}

export default TaxonomyPanel;
