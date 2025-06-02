import _ from 'lodash';
import { hasBlockSupport } from '@wordpress/blocks';

const extendBlockMeta = (metadata, settings) => {
	let mergedData = _.merge(metadata, settings, {
		apiVersion: 2,
		supports: {
			anchor: true,
			customClassName: true,
		},
	});

	mergedData = addAnchorAttribute(mergedData);

	return mergedData;
};

function addAnchorAttribute(settings) {
	if (_.has(settings.attributes, ['anchor', 'type'])) {
		return settings;
	}

	const anchorAttribute = {
		type: 'string',
	};
	if (hasBlockSupport(settings, 'anchor')) {
		settings.attributes = {
			...settings.attributes,
			anchor: anchorAttribute,
		};
	}

	return settings;
}

export { extendBlockMeta };
