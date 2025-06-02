import { composeBlockWithStyle } from '@kubio/core';
import { ColumnStyles } from '../variations/styles';
import NamesOfBlocks from '../../blocks-list';
import _ from 'lodash';
const Factory = (options = {}, children = [], asTemplate = true) => {
	return composeBlockWithStyle(
		NamesOfBlocks.COLUMN,
		_.merge(
			{},
			{
				style: ColumnStyles.Default,
			},
			options
		),
		children,
		asTemplate
	);
};

export { Factory as ColumnFactory };
