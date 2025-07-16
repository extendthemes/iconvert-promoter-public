import {wpVersionCompare} from "@kubio/utils";
import * as inserterListBox66 from '../inserter-listbox-pre-67';
const isWp66 = wpVersionCompare( '6.7', '<' );


/**
 * WordPress dependencies
 */
import { Composite } from '@wordpress/components';

/**
 * Internal dependencies
 */

import { default as __InserterListboxGroup } from './group';
import { default as __InserterListboxRow } from './row';
import { default as __InserterListboxItem } from './item';

function __InserterListbox( { children } ) {
	return (
		<Composite focusShift focusWrap="horizontal" render={ <></> }>
			{ children }
		</Composite>
	);
}
const InserterListboxGroup = isWp66 ? inserterListBox66.InserterListboxGroup : __InserterListboxGroup;
const InserterListboxRow = isWp66 ? inserterListBox66.InserterListboxRow : __InserterListboxRow;
const InserterListboxItem = isWp66 ? inserterListBox66.InserterListboxItem : __InserterListboxItem;
const InserterListbox= isWp66 ? inserterListBox66.InserterListbox : __InserterListbox
export {
	InserterListboxGroup,
	InserterListboxRow,
	InserterListboxItem
}
export default InserterListbox;
