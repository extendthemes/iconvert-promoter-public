/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { useDisabled, useMergeRefs } from '@wordpress/compose';
import { useSelect } from '@wordpress/data';
import deprecated from '@wordpress/deprecated';
import { memo, useMemo } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { store as blockEditorStore } from '../../store';
import { BlockListItems } from '../block-list';
import { ExperimentalBlockEditorProvider } from '../provider';
import AutoHeightBlockPreview from './auto';

const EMPTY_ADDITIONAL_STYLES = [];

export function BlockPreview( {
	blocks,
	viewportWidth = 1200,
	minHeight,
	additionalStyles = EMPTY_ADDITIONAL_STYLES,
	// Deprecated props:
	__experimentalMinHeight,
	__experimentalPadding,
} ) {
	if ( __experimentalMinHeight ) {
		minHeight = __experimentalMinHeight;
		deprecated( 'The __experimentalMinHeight prop', {
			since: '6.2',
			version: '6.4',
			alternative: 'minHeight',
		} );
	}
	if ( __experimentalPadding ) {
		additionalStyles = [
			...additionalStyles,
			{ css: `body { padding: ${ __experimentalPadding }px; }` },
		];
		deprecated( 'The __experimentalPadding prop of BlockPreview', {
			since: '6.2',
			version: '6.4',
			alternative: 'additionalStyles',
		} );
	}

	const originalSettings = useSelect(
		( select ) => select( blockEditorStore ).getSettings(),
		[]
	);
	const settings = useMemo(
		() => ( {
			...originalSettings,
			focusMode: false, // Disable "Spotlight mode".
			__unstableIsPreviewMode: true,
		} ),
		[ originalSettings ]
	);
	const renderedBlocks = useMemo(
		() => ( Array.isArray( blocks ) ? blocks : [ blocks ] ),
		[ blocks ]
	);

	if ( ! blocks || blocks.length === 0 ) {
		return null;
	}

	return (
		<ExperimentalBlockEditorProvider
			value={ renderedBlocks }
			settings={ settings }
		>
			<AutoHeightBlockPreview
				viewportWidth={ viewportWidth }
				minHeight={ minHeight }
				additionalStyles={ additionalStyles }
			/>
		</ExperimentalBlockEditorProvider>
	);
}

/**
 * BlockPreview renders a preview of a block or array of blocks.
 *
 * @see https://github.com/WordPress/gutenberg/blob/HEAD/packages/block-editor/src/components/block-preview/README.md
 *
 * @param {Object}       preview               options for how the preview should be shown
 * @param {Array|Object} preview.blocks        A block instance (object) or an array of blocks to be previewed.
 * @param {number}       preview.viewportWidth Width of the preview container in pixels. Controls at what size the blocks will be rendered inside the preview. Default: 700.
 *
 * @return {Component} The component to be rendered.
 */
export default memo( BlockPreview );

/**
 * This hook is used to lightly mark an element as a block preview wrapper
 * element. Call this hook and pass the returned props to the element to mark as
 * a block preview wrapper, automatically rendering inner blocks as children. If
 * you define a ref for the element, it is important to pass the ref to this
 * hook, which the hook in turn will pass to the component through the props it
 * returns. Optionally, you can also pass any other props through this hook, and
 * they will be merged and returned.
 *
 * @param {Object}    options                      Preview options.
 * @param {WPBlock[]} options.blocks               Block objects.
 * @param {Object}    options.props                Optional. Props to pass to the element. Must contain
 *                                                 the ref if one is defined.
 * @param {Object}    options.layout               Layout settings to be used in the preview.
 * @param             options.__experimentalLayout
 */
export function useBlockPreview( {
	blocks,
	props = {},
	__experimentalLayout,
	layout,
} ) {
	const originalSettings = useSelect(
		( select ) => select( blockEditorStore ).getSettings(),
		[]
	);
	const settings = useMemo(
		() => ( { ...originalSettings, __unstableIsPreviewMode: true } ),
		[ originalSettings ]
	);
	const disabledRef = useDisabled();
	const ref = useMergeRefs( [ props.ref, disabledRef ] );
	const renderedBlocks = useMemo(
		() => ( Array.isArray( blocks ) ? blocks : [ blocks ] ),
		[ blocks ]
	);

	const realLayout = layout || __experimentalLayout;

	const children = (
		<ExperimentalBlockEditorProvider
			value={ renderedBlocks }
			settings={ settings }
		>
			<BlockListItems
				renderAppender={ false }
				__experimentalLayout={ realLayout }
				layout={ realLayout }
			/>
		</ExperimentalBlockEditorProvider>
	);

	return {
		...props,
		ref,
		className: classnames(
			props.className,
			'block-editor-block-preview__live-content',
			'components-disabled'
		),
		children: blocks?.length ? children : null,
	};
}
