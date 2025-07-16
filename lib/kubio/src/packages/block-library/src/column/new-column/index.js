import { LayoutTypes } from '../../row/utils';
import { getNewColumnBlockData } from './new-column-generator';
import _ from 'lodash';

class AddColumnFromRowClass {
	//the dataHelper given to the constructor should be the  row dataHelper. For the AddColumnFromColumnClass class
	//the dataHelper given to the constructor should be the column dataHelper
	constructor(dataHelper, data = {}) {
		this.dataHelper = dataHelper;
		this.data = data;
	}
	add() {
		const rowDataHelper = this.rowDataHelper;
		const rowClientId = rowDataHelper.clientId;
		const newColumnIndex = this.newColumnIndex;
		const {
			insertBlock = _.noop,
			createBlock = _.noop,
			ownerDocument = null,
		} = this.data;
		const blockData = getNewColumnBlockData(
			rowDataHelper,
			this.layoutType,
			newColumnIndex,
			ownerDocument
		);

		const block = createBlock(...blockData);
		_.unset(block, 'attributes.kubio.props.internal');
		insertBlock(block, newColumnIndex, rowClientId, false);
	}

	get newColumnIndex() {
		const columns = this.rowDataHelper.withChildren();
		return columns.length;
	}
	get rowDataHelper() {
		return this.dataHelper;
	}

	get equalWidth() {
		return this.rowDataHelper.getProp('layout.equalWidth', false);
	}
	get layoutType() {
		return this.equalWidth ? LayoutTypes.GRID : LayoutTypes.COLUMNS;
	}
}

class AddColumnFromColumnClass extends AddColumnFromRowClass {
	constructor(columnDataHelper, data, options = {}) {
		super(columnDataHelper, data);
		const defaultOptions = {
			after: true,
		};
		const mergedOptions = _.merge({}, defaultOptions, options);
		this.options = mergedOptions;
	}
	//the dataHelper given to the constructor should be the column dataHelper
	get rowDataHelper() {
		return this.dataHelper.withParent();
	}
	get newColumnIndex() {
		const columns = this.rowDataHelper.withChildren();
		let columnIndex = 0;
		columns.forEach((item, index) => {
			if (item.clientId === this.dataHelper.clientId) {
				columnIndex = index;
			}
		});
		if (this.options?.after) {
			return ++columnIndex;
		}
		return columnIndex;
	}
}
const addColumnFromColumn = (dataHelper, data, options) => {
	new AddColumnFromColumnClass(dataHelper, data, options).add();
};
const addColumnFromRow = (dataHelper, data) => {
	new AddColumnFromRowClass(dataHelper, data).add();
};
export { addColumnFromRow, addColumnFromColumn };
