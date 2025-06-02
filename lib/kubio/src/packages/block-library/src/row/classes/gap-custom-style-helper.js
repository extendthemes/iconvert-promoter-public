import _ from 'lodash';

const GAPS = {
	HORIZONTAL_GAP: 'horizontalGap',
	HORIZONTAL_INNER_GAP: 'horizontalInnerGap',
	VERTICAL_GAP: 'verticalGap',
	VERTICAL_INNER_GAP: 'verticalInnerGap',
};

export default class GapCustomStyleHelper {
	constructor(
		{
			columnsIds,
			rowId,
			innerStyledComponent,
			usedOnRow = false,
			rowPropPath = 'layout',
		},
		vNode
	) {
		this.columnsIds = columnsIds;
		this.rowId = rowId;
		this.firstColumnId = _.get(columnsIds, '[0]');
		this.innerStyledComponent = innerStyledComponent;
		this.usedOnRow = usedOnRow;
		this.rowPropPath = rowPropPath;
		this.vNode = vNode;
	}
	getControlData(normalData) {
		return {
			...normalData,
			custom: this.getStyleStoreData(),
		};
	}
	getStyleStoreData() {
		return {
			horizontalGap: this.getRowGap(GAPS.HORIZONTAL_GAP),
			verticalGap: this.getRowGap(GAPS.VERTICAL_GAP),
			horizontalInnerGap: this.getInnerGap(GAPS.HORIZONTAL_INNER_GAP),
			verticalInnerGap: this.getInnerGap(GAPS.VERTICAL_INNER_GAP),
		};
	}
	getRowGap(path) {
		const options = {
			nodeId: this.rowId,
		};
		return this.vNode.getPropInMedia(
			`${this.rowPropPath}.custom.${path}`,
			{},
			options
		);
	}
	getColumnInnerGap(path) {
		let side = null;
		switch (path) {
			case GAPS.HORIZONTAL_INNER_GAP:
				side = 'left';
				break;
			case GAPS.VERTICAL_INNER_GAP:
				side = 'top';
				break;
		}
		const options = {
			nodeId: this.firstColumnId,
			styledComponent: this.innerStyledComponent,
		};

		return this.vNode.getStyle(`padding.${side}`, {}, options);
	}

	getInnerGap(path) {
		if (this.usedOnRow) {
			return this.getRowGap(path);
		}
		return this.getColumnInnerGap(path);
	}
	extractDataFromChangeEvent($event) {
		let data = {};
		if ($event.path) {
			data = _.set({}, $event.path, $event.value);
		} else {
			data = $event.value;
		}
		return data;
	}
	updateStyleDataInStore($event) {
		const data = this.extractDataFromChangeEvent($event);
		const customValues = _.get(data, 'custom', {});
		const normalValues = _.cloneDeep(data);
		try {
			delete normalValues.custom;
		} catch (e) {}
		this.customValues = customValues;
		this.normalValues = normalValues;

		this.updateCustomDataInStore();
	}
	getNormalValue() {
		return this.normalValues;
	}

	updateCustomDataInStore() {
		_.each(this.customValues, (gapValue, gapName) => {
			switch (gapName) {
				case GAPS.HORIZONTAL_GAP:
					this.setOuterGap(gapValue, GAPS.HORIZONTAL_GAP);
					break;
				case GAPS.VERTICAL_GAP:
					this.setOuterGap(gapValue, GAPS.VERTICAL_GAP);
					break;
				case GAPS.HORIZONTAL_INNER_GAP:
					this.setInnerGap(gapValue, GAPS.HORIZONTAL_INNER_GAP);
					break;
				case GAPS.VERTICAL_INNER_GAP:
					this.setInnerGap(gapValue, GAPS.VERTICAL_INNER_GAP);
					break;
			}
		});
	}
	setRowGap(gapValue, path) {
		const options = {
			nodeId: this.rowId,
		};

		this.vNode.setPropInMedia(
			`${this.rowPropPath}.custom.${path}`,
			gapValue,
			options
		);
	}
	setInnerGap(gapValue, path) {
		if (this.usedOnRow) {
			this.setRowGap(gapValue, path);
		} else {
			this.setColumnInnerGap(gapValue, path);
		}
	}
	setOuterGap(gapValue, path) {
		this.setRowGap(gapValue, path);
	}
	setColumnInnerGap(gapValue, path, baseOptions = {}) {
		let sides = [];
		switch (path) {
			case GAPS.HORIZONTAL_INNER_GAP:
				sides = ['left', 'right'];
				break;
			case GAPS.VERTICAL_INNER_GAP:
				sides = ['top', 'bottom'];
				break;
		}
		this.columnsIds.forEach((columnId) => {
			const options = _.merge({}, baseOptions, {
				nodeId: columnId,
				styledComponent: this.innerStyledComponent,
			});

			const padding = {};
			sides.forEach((side) => {
				padding[side] = gapValue;
			});

			this.vNode.setStyle('padding', padding, options);
		});
	}
}
