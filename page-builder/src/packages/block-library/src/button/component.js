import { getBlocksMap } from '@kubio/block-library';
import { compose } from '@wordpress/compose';
import { ElementsEnum } from './elements';

import { withColibriDataAutoSave, withStyledElements } from '@kubio/core';

const BlocksMap = getBlocksMap();
const button = BlocksMap?.button;
const ComponentParts = button?.Components?.ComponentParts || {};
const { Component, computed, mapPropsToElements } = ComponentParts;

const buttonMapPropsToElements = ( { computed } = {} ) => {
	return {
		[ ElementsEnum.OUTER ]: {},
	};
};

const ButtonCompose = compose(
	withColibriDataAutoSave( computed ),
	withStyledElements( mapPropsToElements, buttonMapPropsToElements )
);

const Button = ButtonCompose( Component );
export { Button };
