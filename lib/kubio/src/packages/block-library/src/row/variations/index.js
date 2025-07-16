import { RowFactory } from '../default';
import { ColumnFactory } from '../../column/generators/default';
import { applyColumnWidth, getPercentageColumn } from '../../column/utils';
import { __ } from '@wordpress/i18n';

const getHalfColumn = () => {
	return ColumnFactory(
		{
			_style: applyColumnWidth(
				{},
				getPercentageColumn(50),
				getPercentageColumn(100)
			),
		},
		[]
	);
};
const getRowDefault = () => {
	return RowFactory(
		{
			props: {
				layout: {
					equalHeight: true,
					equalWidth: false,
				},
			},
		},
		[getHalfColumn(), getHalfColumn()]
	);
};

const Templates = {
	Default: getRowDefault(),
	Default2: RowFactory({}, [
		ColumnFactory({}, []),
		ColumnFactory({}),
		ColumnFactory({}),
	]),
};

const Variations = [
	{
		name: 'default',
		isDefault: true,
		title: __('Columns', 'kubio'),
		description: __(
			'Add a new row to the canvas. Make adjustments to its columns, spacing, typography, background, and more.',
			'kubio'
		),
		attributes: Templates.Default[1],
		innerBlocks: Templates.Default[2],
	},
];

export {
	Variations as RowVariations,
	Templates as RowTemplates,
	getRowDefault,
};
