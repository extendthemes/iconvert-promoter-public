import { composeBlockWithStyle } from '@kubio/core';
import { __, sprintf } from '@wordpress/i18n';
import metadata from './block.json';
import { uniq } from 'lodash';

const defaultHeadingType = 2;

const getHeadingVariations = (extraLevels = []) => {
	const headings = uniq([defaultHeadingType, ...extraLevels]);

	return headings.map((level) => {
		const name =
			level === defaultHeadingType ? metadata.name : `heading-${level}`;
		const title =
			level === defaultHeadingType
				? __('Heading', 'kubio')
				: // translators: html heading types
				  sprintf(__('Heading %d', 'kubio'), level);

		const isDefault = level === defaultHeadingType;

		const description =
			level === defaultHeadingType
				? __(
						'Create headings that stand out. Customize their typography, color, shadow, borders, and background.',
						'kubio'
				  )
				: // translators: html heading types
				  sprintf(__('Heading %d element', 'kubio'), level);

		const { attributes, innerBlocks } = composeBlockWithStyle(
			metadata.name,
			{
				props: {
					level,
					fancy: {
						fancyRotatingWords: [
							__('awesome', 'kubio'),
							__('amazing', 'kubio'),
							__('impressive', 'kubio'),
						].join('\n'),
					},
				},
			},
			[],
			false
		);

		return {
			name,
			isDefault,
			title,
			description,
			attributes,
			innerBlocks,
		};
	});
};

export { getHeadingVariations };
