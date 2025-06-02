/**
 * WordPress dependencies
 */
import { useEntityBlockEditor } from '@wordpress/core-data';
import {
	InnerBlocks,
	useSetting,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';
import NamesOfBlocks from '../../../blocks-list';
import { useKubioInnerBlockProps } from '../../hooks/use-kubio-inner-block-props';

const ALLOWED_BLOCKS = [NamesOfBlocks.SECTION, NamesOfBlocks.NAVIGATION];

export default function TemplatePartInnerBlocks({
	postId: id,
	hasInnerBlocks,
	layout,
	tagName: TagName,
	blockProps,
	innerBlocksProps,
	displayAppender = false,
	innerBlocks,
}) {
	const themeSupportsLayout = useSelect((select) => {
		const { getSettings } = select(blockEditorStore);
		return getSettings()?.supportsLayout;
	}, []);
	const defaultLayout = useSetting('layout') || {};
	const usedLayout = !!layout && layout.inherit ? defaultLayout : layout;
	const { contentSize, wideSize } = usedLayout;
	const alignments =
		contentSize || wideSize
			? ['wide', 'full']
			: ['left', 'center', 'right'];

	const [blocks, onInput, onChange] = useEntityBlockEditor(
		'postType',
		'wp_template_part',
		{ id }
	);

	const templatePartInnerBlocks =
		!blocks.length && innerBlocks?.length ? innerBlocks : blocks;

	const innerBlocksPropsWithDefaults = useKubioInnerBlockProps(blockProps, {
		value: templatePartInnerBlocks,
		onInput,
		onChange,
		renderAppender: hasInnerBlocks
			? displayAppender
			: InnerBlocks.ButtonBlockAppender,
		__experimentalLayout: {
			type: 'default',
			// Find a way to inject this in the support flag code (hooks).
			alignments: themeSupportsLayout ? alignments : undefined,
		},
		allowedBlocks: ALLOWED_BLOCKS,
		...innerBlocksProps,
	});
	return <TagName {...innerBlocksPropsWithDefaults} />;
}
