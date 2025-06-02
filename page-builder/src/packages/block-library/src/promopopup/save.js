import { Base } from './component';
import { name } from './block.json';
import { InnerBlocks } from '@wordpress/block-editor';

export default function save( props ) {
	return <InnerBlocks.Content name={ name } save={ true } { ...props } />;
}
