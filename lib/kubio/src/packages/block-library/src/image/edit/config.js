import { LinkConfig } from '@kubio/controls';
import { __ } from '@wordpress/i18n';
import _ from 'lodash';

const opacityOptions = {
	min: 0,
	max: 1,
	step: 0.01,
};

const borderThickenessOptions = {
	min: 0,
	max: 10,
	step: 1,
};

const borderRadiusOptions = {
	min: 0,
	max: 300,
	step: 1,
};

const marginTopOptions = {
	min: 0,
	max: 100,
	step: 1,
};

//TODO
//let textAlignOptions = horizontalTextAlignConfig.horizontalTextAlignOptions;
const textAlignOptions = 'center';
const dimensionsUnits = [{ label: __('PX', 'kubio'), value: 'px' }];
const procentUnits = [{ label: __('%', 'kubio'), value: '%' }];

const frameTypeValues = {
	BORDER: 'border',
	BACKGROUND: 'background',
};

const frameTypeOptions = [
	{ label: __('Border', 'kubio'), value: frameTypeValues.BORDER },
	{ label: __('Background', 'kubio'), value: frameTypeValues.BACKGROUND },
];

const procentUnitsOptions = {
	min: 0,
	max: 100,
	step: 1,
};

const frameThicknessOptions = {
	min: 1,
	max: 50,
	step: 1,
};

const frameOffsetTransformOptions = {
	min: -100,
	max: 100,
	step: 1,
};

const customSizeUnits = [{ label: __('PX', 'kubio'), value: 'px' }];
const customSizeUnitsSettings = {
	px: {
		min: 0,
		max: 300,
		step: 1,
	},
};
const customSize = {
	units: customSizeUnits,
	unitsSettings: customSizeUnitsSettings,
};

const rotationSettings = {
	min: -180,
	max: 180,
	step: 1,
};

class LinkApi {
	constructor({ colibriLink, gutenbergLink }) {
		this.linkValues = LinkConfig.linkOpen.values;
		if (colibriLink) {
			this.colibriLink = colibriLink;
			//this.gutenbergLink = this.convertColibriToGutenberg( colibriLink );
		}
		if (gutenbergLink) {
			this.gutenbergLink = gutenbergLink;
			//this.colibriLink = this.convertGutenbergToColibri( gutenbergLink );
		}
	}

	convertGutenbergToColibri(gutenbergLink = {}) {
		const data = {};
		_.each(gutenbergLink, (value, key) => {
			switch (key) {
				case 'href':
					_.set(data, 'value', value);
					break;
				case 'linkTarget':
					let typeOpenLink = null;
					if (value === '_blank') {
						typeOpenLink = this.linkValues.NEW_WINDOW;
					} else {
						typeOpenLink = this.linkValues.SAME_WINDOW;
					}
					_.set(data, 'typeOpenLink', typeOpenLink);
					break;
				case 'linkDestination':
					_.set(data, 'linkDestination', value);
					break;
			}
		});

		return data;
	}

	convertColibriToGutenberg(colibriLink = {}) {
		const data = {};
		_.each(colibriLink, (value, key) => {
			switch (key) {
				case 'value':
					_.set(data, 'href', value);
					break;
				case 'typeOpenLink':
					let linkTarget = null;
					if (value === this.linkValues.NEW_WINDOW) {
						linkTarget = '_blank';
					}
					_.set(data, 'linkTarget', linkTarget);
					break;
				case 'linkDestination':
					_.set(data, 'linkDestination', value);
					break;
			}
		});

		return data;
	}

	get linkForGutenberg() {
		if (!this.gutenbergLink) {
			this.gutenbergLink = this.convertColibriToGutenberg(
				this.colibriLink
			);
		}
		return this.gutenbergLink;
	}
	get linkForColibri() {
		if (!this.colibriLink) {
			this.colibriLink = this.convertGutenbergToColibri(
				this.gutenbergLink
			);
		}
		return this.colibriLink;
	}
}

const getOuterAlignClasses = (align) => {
	return [`align-items-${align}`];
};

const properties = {
	opacityOptions,
	rotationSettings,
	borderThickenessOptions,
	borderRadiusOptions,
	dimensionsUnits,
	marginTopOptions,
	textAlignOptions,
	frameTypeValues,
	frameTypeOptions,
	procentUnits,
	procentUnitsOptions,
	frameThicknessOptions,
	frameOffsetTransformOptions,
	customSize,
};
export { properties, LinkApi, getOuterAlignClasses };
