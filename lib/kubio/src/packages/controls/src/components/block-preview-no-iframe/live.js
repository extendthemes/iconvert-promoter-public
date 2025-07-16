/**
 * WordPress dependencies
 */
import { Disabled } from '@wordpress/components';
import { BlockList } from '@wordpress/block-editor';
/**
 * Internal dependencies
 */

export default function LiveBlockPreview( { onClick } ) {
	return (
		<div
			tabIndex={ 0 }
			role="button"
			onClick={ onClick }
			onKeyPress={ onClick }
		>
			<Disabled>
				<BlockList />
			</Disabled>
		</div>
	);
}
