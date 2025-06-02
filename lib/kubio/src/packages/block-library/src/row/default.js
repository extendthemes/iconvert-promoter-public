import { composeBlockWithStyle } from '@kubio/core';

import { RowProps } from './variations/styles';

import NamesOfBlocks from '../blocks-list';

const Default = () => {
	return [];
};

const Factory = (options = {}, children = [], asTemplate = true) => {
	return composeBlockWithStyle(
		NamesOfBlocks.ROW,
		{
			props: RowProps.Default,
			...options,
		},
		children,
		asTemplate
	);
};

export { Default as RowDefault, Factory as RowFactory };
