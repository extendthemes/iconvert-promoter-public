import { composeBlockWithStyle } from '@kubio/core';
import { __ } from '@wordpress/i18n';
import { name as iconName } from './blocks/social-icon/block.json';

const SocIcon = (atts, options = {}, children = []) => {
	return composeBlockWithStyle(
		iconName,
		{
			attributes: {
				text: __('Icon', 'kubio'),
				icon: {
					name: atts?.icon || 'socicon/facebook',
				},
			},
			...options,
		},
		children
	);
};

const Factory = (options = {}, children = []) => {
	return [
		SocIcon({ icon: 'socicon/facebook' }, options, children),
		SocIcon({ icon: 'socicon/youtube' }, options, children),
		SocIcon({ icon: 'socicon/twitter' }, options, children),
		SocIcon({ icon: 'socicon/vimeo' }, options, children),
	];
};
const Default = Factory();

export { Default as LinkGroupDefault, Factory as LinkGroupFactory };
