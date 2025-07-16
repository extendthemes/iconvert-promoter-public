/**
 * WordPress dependencies
 */
import {
	privateApis as componentsPrivateApis,
	__unstableCompositeGroup as CompositeGroupWP64,
} from '@wordpress/components';
import { forwardRef } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { unlock } from '../../lock-unlock';

const { CompositeGroupV2: CompositeGroup } = unlock( componentsPrivateApis );

function InserterListboxRow( props, ref ) {
	const Group = CompositeGroup || CompositeGroupWP64;
	return <Group role="presentation" ref={ ref } { ...props } />;
}

export default forwardRef( InserterListboxRow );
