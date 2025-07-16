import { BlockAlignmentToolbar, BlockControls } from '@wordpress/block-editor';

const ImageToolbar = ({ computed }) => {
	const { withDataBinds } = computed;

	return (
		<BlockControls>
			<BlockAlignmentToolbar
				value={withDataBinds.align.value}
				onChange={withDataBinds.align.onChange}
				controls={['none', 'left', 'center', 'right']}
			/>
		</BlockControls>
	);
};
export { ImageToolbar };
