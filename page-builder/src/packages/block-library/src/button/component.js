import { getBlocksMap } from '@kubio/block-library';
import { compose, createHigherOrderComponent } from '@wordpress/compose';
import { ElementsEnum } from './elements';

import { withColibriDataAutoSave, withStyledElements } from '@kubio/core';

const BlocksMap = getBlocksMap();
const button = BlocksMap?.button;
const ComponentParts = button?.Components?.ComponentParts || {};
const { Component, computed, mapPropsToElements } = ComponentParts;

const ButtonCompose = compose(
	withColibriDataAutoSave( computed ),
	withStyledElements( mapPropsToElements ),
	createHigherOrderComponent(
		( WrappedComponent ) => ( props ) => {
			const type = props.attributes.buttonType;

			return (
				<WrappedComponent
					{ ...props }
					withEditLink={ type === 'link' }
				/>
			);
		},
		'ButtonWrapper'
	)
);

const Button = ButtonCompose( Component );
export { Button };
