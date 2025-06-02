import BEMHelper from 'react-bem-helper';

import { columnWidth } from '@kubio/style-manager';
import _ from 'lodash';
import { toFixedNoRounding } from '@kubio/utils';
import { UNSET_VALUE } from '@kubio/constants';

const columnBem = new BEMHelper('h-column');

const { ColumnWidthTypes } = columnWidth;

export { columnBem };

export const AUTO_COLUMN = {
	type: ColumnWidthTypes.FLEX_GROW,
};

const applyColumnWidth = (collector, width, mobileWidth, tabletWidth) => {
	return _.merge(collector, {
		descendants: {
			container: {
				columnWidth: width,
				media: {
					mobile: {
						columnWidth: mobileWidth,
					},
					tablet: {
						columnWidth: tabletWidth,
					},
				},
			},
		},
	});
};

const getPercentageColumn = (percentage) => {
	return {
		type: ColumnWidthTypes.CUSTOM,
		custom: {
			value: percentage,
			unit: '%',
		},
	};
};

const getAutoColumn = () => {
	return {
		type: ColumnWidthTypes.FLEX_GROW,
		custom: {
			value: '',
			unit: '%',
		},
	};
};

const getFitToContentColumn = () => {
	return {
		type: ColumnWidthTypes.FIT_TO_CONTENT,
		custom: {
			value: '',
			unit: '%',
		},
	};
};

const getOnlyAutoColumns = (number) => {
	const result = [];
	for (let i = 0; i < number; i++) {
		result.push(AUTO_COLUMN);
	}
	return result;
};

const getConvertedColumnWidthByMedia = (
	rowLayoutByMedia,
	toEqualWidth = false
) => {
	const widthByMedia = {};
	_.each(rowLayoutByMedia, (value, media) => {
		if (!toEqualWidth) {
			if (!value?.itemsPerRow) return;
			const itemsPerRow = value?.itemsPerRow;
			const width = toFixedNoRounding(parseFloat(100 / itemsPerRow), 2);
			widthByMedia[media] = getPercentageColumn(width);
		} else {
			widthByMedia[media] = UNSET_VALUE;
		}
	});
	return widthByMedia;
};

export {
	getConvertedColumnWidthByMedia,
	applyColumnWidth,
	getPercentageColumn,
	getFitToContentColumn,
	getOnlyAutoColumns,
	getAutoColumn,
};
