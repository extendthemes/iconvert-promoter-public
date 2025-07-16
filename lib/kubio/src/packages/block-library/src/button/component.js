import { compose, createHigherOrderComponent } from '@wordpress/compose';

import { useSelect } from '@wordpress/data';
import {
	withColibriDataAutoSave,
	withStyledElements,
	withRedirectSelectionToParentCondition,
} from '@kubio/core';
import { LinkConfig } from '@kubio/controls';
import { properties } from './config';

const { getLinkAttributes } = LinkConfig;
import { ElementsEnum } from './elements';

import { Component } from '../link/component';
import NamesOfBlocks from '../blocks-list';

const mapPropsToElements = ( { computed } = {} ) => {
	return {
		[ ElementsEnum.ICON ]: {
			name: computed?.icon?.name,
		},
		[ ElementsEnum.LINK ]: {
			...computed?.linkAttributes,
		},
	};
};

const computed = ( dataHelper, ownProps ) => {
	const link = dataHelper.getAttribute( 'link' );
	const linkAttributes = getLinkAttributes( link );

	const icon = dataHelper.getAttribute( 'icon' );
	const iconEnabled = dataHelper.getProp( 'showIcon' );
	const iconPosition = dataHelper.getProp( 'iconPosition' );
	const iconPositionValues = properties.iconPosition.values;
	const showBeforeIcon =
		iconEnabled && iconPosition === iconPositionValues.BEFORE;
	const showAfterIcon =
		iconEnabled && iconPosition === iconPositionValues.AFTER;
	return {
		link,
		icon,
		showBeforeIcon,
		showAfterIcon,
		text: dataHelper.getAttribute( 'text' ),
		linkAttributes,
	};
};

const ButtonCompose = compose(
	withColibriDataAutoSave( computed ),
	withStyledElements( mapPropsToElements ),
	createHigherOrderComponent(
		( WrappedComponent ) => ( ownProps ) => {
			const { clientId, withToolbar, withEditLink = true} = ownProps;
			const { getBlockParents, getBlock } =
				useSelect( 'core/block-editor' );
			const parents = getBlockParents( clientId );
			const lastParent = getBlock( parents[ parents.length - 1 ] );

			const hasVideoParent = lastParent?.name === NamesOfBlocks.VIDEO;

			return (
				<WrappedComponent
					{ ...ownProps }
					withToolbar={ withToolbar && ! hasVideoParent }
					withEditLink={ withEditLink }
				/>
			);
		},
		'checkParent'
	),
	withRedirectSelectionToParentCondition( [ NamesOfBlocks.DOWN_ARROW ] )
);

const Button = ButtonCompose( Component );
const ButtonSave = ButtonCompose( Component );
const ComponentParts = { Component, computed, mapPropsToElements };
export { Button, ButtonSave, ComponentParts };
