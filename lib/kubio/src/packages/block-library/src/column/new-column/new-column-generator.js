import { LayoutTypes } from '../../row/utils';
import { ColumnFactory } from '../generators/default';
import { getPreviewElementByModelId, toFixedNoRounding } from '@kubio/utils';
import { columnWidth as columnWidthType } from '@kubio/style-manager';
import {
	getFitToContentColumn,
	applyColumnWidth,
	getPercentageColumn,
} from '../utils';
import { __ } from '@wordpress/i18n';

const ColumnWidthTypes = columnWidthType.ColumnWidthTypes;
const baseColumnStyledComponent = {
	styledComponent: 'container',
};
function getNewColumnBlockData(
	rowDataHelper,
	layoutType,
	insertAtPosition,
	ownerDocument
) {
	let columnStyle = {};
	if (layoutType === LayoutTypes.COLUMNS) {
		if (isSameRow(rowDataHelper, ownerDocument)) {
			columnStyle = getSameRowColumn(
				rowDataHelper,
				insertAtPosition,
				ownerDocument
			);
		} else {
			columnStyle = getColumnMultiRow(
				rowDataHelper,
				insertAtPosition,
				ownerDocument
			);
		}

		//fallback if for some reason no  no style is returned
		if (_.isEmpty(columnStyle)) {
			columnStyle = getPercentageColumn(50);
		}
	}
	const options = {};
	const blockData = ColumnFactory(
		!_.isEmpty(columnStyle)
			? {
					_style: {
						descendants: {
							container: {
								columnWidth: columnStyle,
							},
						},
					},
			  }
			: {}
	);
	return blockData;
}

function isSameRow(rowDataHelper, ownerDocument) {
	const columnNodes = getColumnNodesFromRowModel(
		rowDataHelper,
		ownerDocument
	);

	const sameRow = nodesAreInTheSameRow(columnNodes);

	return sameRow;
}

function nodesAreInTheSameRow(nodes) {
	if (nodes.length === 0 || nodes.length === 1) {
		return true;
	}
	const rects = nodes.map((node) => node.getBoundingClientRect());
	const rectsX = rects.map((rect) => rect.x);

	let lastX = rectsX[0];
	let elementsAreInOrder = true;

	//if all the nodes have their x in order it means that they are on the same row.
	rectsX.forEach((x, index) => {
		if (index === 0) {
			return;
		}
		if (x <= lastX) {
			elementsAreInOrder = false;
		}
		lastX = x;
	});

	const sameRow = elementsAreInOrder;

	return sameRow;
}
function getColumnNodesFromRowModel(rowDataHelper, ownerDocument) {
	const columns = rowDataHelper.withChildren();
	const columnNodes = columns.map((column) => {
		const clientId = column?.clientId;
		const node = getPreviewElementByModelId(clientId, ownerDocument);
		if (!node) {
			throw __(
				'Could not add column while not all elements are rendered',
				'kubio'
			);
		}
		return node;
	});
	return columnNodes;
}
function getSameRowColumn(rowDataHelper, insertAtPosition, ownerDocument) {
	const allColumnsAreCustomWidth = areAllColumnsAreCustomWidth(rowDataHelper);
	if (!allColumnsAreCustomWidth) {
		//if all the columns are in one row and one of the columns width is not custom return a fit to content column
		return getColumnSingleRowFitToContent();
	}

	const rowHasAvailableSpace = getRowHasAvailableSpace(
		rowDataHelper?.clientId,
		insertAtPosition,
		getColumnNodesFromRowModel(rowDataHelper, ownerDocument),
		ownerDocument
	);

	//if all the columns are in one row and there is available space for another column use the multi row logic.
	if (rowHasAvailableSpace) {
		return getColumnMultiRow(
			rowDataHelper,
			insertAtPosition,
			ownerDocument
		);
	}

	//if the columns are in one row and they occupy all the row width
	return getColumnSingleRowCustomWidth(rowDataHelper);
}

function areAllColumnsAreCustomWidth(rowDataHelper) {
	const columns = rowDataHelper.withChildren();
	let allAreCustomWidth = true;
	columns.forEach((columnDataHelper) => {
		const columnType = columnDataHelper.getLocalStyle(
			'columnWidth.type',
			null,
			baseColumnStyledComponent
		);
		if (columnType !== ColumnWidthTypes.CUSTOM) {
			allAreCustomWidth = false;
		}
	});
	return allAreCustomWidth;
}
function getColumnSingleRowFitToContent() {
	return getFitToContentColumn();
}

function getRowHasAvailableSpace(
	rowId,
	insertAtPosition,
	columnNodes,
	ownerDocument
) {
	const rowInner = getRowInner(rowId, ownerDocument);
	const dummyColumn = generateDummyColumn(ownerDocument);

	insertDummyColumnInRow(rowInner, insertAtPosition, dummyColumn);

	columnNodes.splice(insertAtPosition, 0, dummyColumn);

	const thereIsAvailableSpace = nodesAreInTheSameRow(columnNodes);

	removeDummyColumnInRow(rowInner, dummyColumn);

	return thereIsAvailableSpace;
}
function getRowInner(rowId, ownerDocument) {
	const rowOuter = getPreviewElementByModelId(rowId, ownerDocument);
	const rowInner = rowOuter.querySelector(' .h-row');
	return rowInner;
}
function generateDummyColumn(ownerDocument) {
	const dummyColumn = ownerDocument.createElement('div');
	dummyColumn.setAttribute('id', 'h-dummy-column');
	dummyColumn.setAttribute('class', 'dummy-column');
	return dummyColumn;
}
function removeDummyColumnInRow(rowInner, dummyColumn) {
	rowInner.removeChild(dummyColumn);
}

function getColumnSingleRowCustomWidth(rowDataHelper) {
	const widthPercentage = getColumnWidthAddMixinWithSingleRow(rowDataHelper);
	singleRowUpdateAllColumnsWidth(rowDataHelper, widthPercentage);
	const widthStyle = getPercentageColumn(widthPercentage);
	return widthStyle;
}

function getColumnWidthAddMixinWithSingleRow(rowDataHelper) {
	const numberOfColumns = rowDataHelper?.withChildren().length + 1;
	const widthPercentage = 100 / numberOfColumns;
	const roundedPercentage = parseFloat(toFixedNoRounding(widthPercentage, 2));
	return roundedPercentage;
}
function singleRowUpdateAllColumnsWidth(rowDataHelper, widthPercentage) {
	const columnsDataHelper = rowDataHelper.withChildren();
	columnsDataHelper.forEach((columnDataHelper) => {
		const columnWidth = {
			type: ColumnWidthTypes.CUSTOM,
			custom: {
				value: widthPercentage,
				unit: '%',
			},
		};
		columnDataHelper.setLocalStyle('columnWidth', columnWidth, {
			...baseColumnStyledComponent,
			media: 'desktop',
		});
	});
}
function getColumnMultiRow(rowDataHelper, insertAtPosition, ownerDocument) {
	const widthPercentage = getColumnWidthAddMixin(
		rowDataHelper?.clientId,
		insertAtPosition,
		ownerDocument
	);
	let widthStyle;
	if (widthPercentage == 100) {
		widthStyle = getFirstColumnWidth(rowDataHelper);
	} else {
		widthStyle = getPercentageColumn(widthPercentage);
	}

	return widthStyle;
}

function getColumnWidthAddMixin(rowId, insertAtPosition, ownerDocument) {
	const rowInner = getRowInner(rowId, ownerDocument);
	const dummyColumn = generateDummyColumn(ownerDocument);
	insertDummyColumnInRow(rowInner, insertAtPosition, dummyColumn);
	const dummyColumnStyle = window.getComputedStyle(dummyColumn);
	const dummyColumnWidth = parseFloat(
		dummyColumnStyle.getPropertyValue('width')
	);

	const rowStyle = window.getComputedStyle(rowInner);
	const rowWidth = parseFloat(rowStyle.getPropertyValue('width'));

	const rowWidthWithoutPaddingAndBorder =
		rowWidth -
		(parseFloat(rowStyle.paddingLeft) + parseFloat(rowStyle.paddingRight)) -
		(parseFloat(rowStyle.borderLeftWidth) +
			parseFloat(rowStyle.borderRightWidth));

	const onePercent = rowWidthWithoutPaddingAndBorder / 100;
	const columnPercentage = dummyColumnWidth / onePercent;
	rowInner.removeChild(dummyColumn);
	const columnPercentageTruncated = parseFloat(
		toFixedNoRounding(columnPercentage, 2)
	);
	return columnPercentageTruncated;
}
function getFirstColumnWidth(rowDataHelper) {
	const firstColumnDataHelper = _.get(rowDataHelper.withChildren(), '0');
	if (!firstColumnDataHelper) {
		return {};
	}
	return firstColumnDataHelper.getLocalStyle(
		'columnWidth',
		{},
		{
			...baseColumnStyledComponent,
			media: 'desktop',
		}
	);
}
function insertDummyColumnInRow(rowInner, insertAtPosition, dummyColumn) {
	let beforeElement = null;

	if (insertAtPosition === 0) {
		const firstElement = rowInner.children[0];
		firstElement.insertAdjacentElement('beforebegin', dummyColumn);
		return;
	}
	//row overlay
	const extraElements = 0;
	for (let i = 0; i < rowInner.children.length; i++) {
		if (i - extraElements === insertAtPosition - 1) {
			beforeElement = rowInner.children[i];
		}
	}

	if (beforeElement) {
		beforeElement.insertAdjacentElement('afterEnd', dummyColumn);
	}
}
export { getNewColumnBlockData };
