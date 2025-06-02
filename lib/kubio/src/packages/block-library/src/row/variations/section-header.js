import { RowFactory } from '../default';
import { ColumnFactory } from '../../column/generators/default';
import { composeBlockWithStyle } from '@kubio/core';
import { __ } from '@wordpress/i18n';

const SectionHeader = RowFactory(
	{
		props: {
			layout: {
				itemsPerRow: 2,
				equalWidth: true,
				equalHeight: true,
			},
		},
	},
	[
		ColumnFactory({}, [
			composeBlockWithStyle('core/paragraph', {
				attributes: { content: __('Title', 'kubio') },
			}),
		]),
		ColumnFactory({}),
		ColumnFactory({}),
	]
);

export { SectionHeader };
