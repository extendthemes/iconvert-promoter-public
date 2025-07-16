import { select } from '@wordpress/data';
import { store as coreDataStore } from '@wordpress/core-data';
import { startCase } from 'lodash';
import { sprintf } from '@wordpress/i18n';

const experimentalLabal = (stringTemplate) => ({ slug, theme }) => {
	// Attempt to find entity title if block is a template part.
	// Require slug to request, otherwise entity is uncreated and will throw 404.
	if (!slug) {
		return;
	}

	const entity = select(coreDataStore).getEntityRecord(
		'postType',
		'wp_template_part',
		theme + '//' + slug
	);
	if (!entity) {
		return;
	}

	return sprintf(
		stringTemplate,
		startCase(entity.title?.rendered || entity.slug)
	);
};

export { experimentalLabal };
