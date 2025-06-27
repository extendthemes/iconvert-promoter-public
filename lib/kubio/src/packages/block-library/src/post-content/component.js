import { STORE_KEY, getKubioUrlWithRestPrefix } from '@kubio/constants';
import { LayoutPicker } from '@kubio/controls';
import { TemplatePartContext } from '@kubio/core';
import { useEffectAsync } from '@kubio/core-hooks';
import { useSetPageTitle } from '@kubio/editor-data';
import _ from 'lodash';
import {
	store as blockEditorStore,
	useBlockProps,
	useSetting,
	Warning
} from '@wordpress/block-editor';
import { compose, createHigherOrderComponent, pure } from '@wordpress/compose';
import { useEntityBlockEditor, useEntityProp } from '@wordpress/core-data';
import { AsyncModeProvider, useSelect } from '@wordpress/data';
import {
	RawHTML,
	useEffect,
	useMemo,
	useState,
	useRef,
	Fragment,
} from '@wordpress/element';
import { applyFilters } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';
import NamesOfBlocks from '../blocks-list';
import { useKubioInnerBlockProps } from '../common/hooks/use-kubio-inner-block-props';
import { useNoRecursiveRenders } from '../common/template-part/recursive-renders';

const Content = compose(
	createHigherOrderComponent((WrappedComponent) => (ownProps) => {
		const { layout } = ownProps;
		const themeSupportsLayout = useSelect((select) => {
			const { getSettings } = select(blockEditorStore);
			return getSettings()?.supportsLayout;
		}, []);
		const defaultLayout = useSetting('layout') || {};
		let usedLayout;
		if (_.isEmpty(layout)) {
			usedLayout = defaultLayout;
		} else if (!_.isEmpty(layout) && layout.inherit) {
			usedLayout = defaultLayout;
		} else {
			usedLayout = layout;
		}

		const { contentSize, wideSize } = usedLayout;

		const alignments = useMemo(() => {
			const alignments_ = ['left', 'center', 'right'];
			if (contentSize) {
				alignments_.push('full');
			}
			if (wideSize) {
				alignments_.push('wide');
			}

			return themeSupportsLayout ? alignments_ : undefined;
		}, [themeSupportsLayout, contentSize, wideSize]);

		const templateContextValue = useMemo(() => {
			return {
				name: 'post-content',
			};
		}, []);

		return (
			<TemplatePartContext.Provider value={templateContextValue}>
				<WrappedComponent {...ownProps} alignments={alignments} />
			</TemplatePartContext.Provider>
		);
	}),
	pure
)(Content_);

const ALLOWED_BLOCKS = [NamesOfBlocks.SECTION];

function Content_({ postType, postId, alignments }) {
	const [blocks, onInput, onChange] = useEntityBlockEditor(
		'postType',
		postType,
		{ id: postId }
	);

	const [pageTitle] = useEntityProp('postType', postType, 'title', postId);

	const setTitle = useSetPageTitle();

	useEffect(() => {
		if (pageTitle) {
			setTitle(postId, pageTitle);
		}
	}, [pageTitle]);
	const allowedBlocks = postType === 'page' ? ALLOWED_BLOCKS : undefined;

	const templateLock = applyFilters(
		'kubio.block-library.post-content.templateLock',
		false
	);

	const props = useKubioInnerBlockProps(
		useBlockProps({ className: 'entry-content' }),
		{
			templateLock,
			value: blocks,
			onInput,
			onChange,
			__experimentalLayout: {
				type: 'default',
				// Find a way to inject this in the support flag code (hooks).
				alignments,
			},
			allowedBlocks,
			// renderAppender: false,
		}
	);

	return <div {...props} />;
}

function RenderedContent() {
	const blockProps = useBlockProps({ className: 'entry-content' });
	const [renderedContent, setRenderedContent] = useState(null);
	const [renderedStyles, setRenderedStyles] = useState(null);
	const urlPath = useSelect((select) => select(STORE_KEY)?.getPage()?.path);
	const styleRef = useRef();
	const [styleContainerKey, setStyleContainerKey] = useState(Math.random());
	useEffectAsync(
		async (isMounted) => {
			if (isMounted()) {
				const response = await window
					.fetch(
						addQueryArgs(urlPath, {
							[getKubioUrlWithRestPrefix(
								'__kubio-rendered-content'
							)]: 1,
						})
					)
					.then((res) => res.json());

				if (isMounted() && response?.data?.content) {
					setRenderedContent(response.data?.content);
				}
			}
		},
		[urlPath]
	);

	useEffectAsync(
		async (isMounted) => {
			if (isMounted()) {
				const response = await window
					.fetch(
						addQueryArgs(urlPath, {
							[getKubioUrlWithRestPrefix(
								'__kubio-rendered-styles'
							)]: 1,
						})
					)
					.then((res) => res.json());

				if (isMounted() && response?.data?.content) {
					setRenderedStyles(response.data?.content);
					setStyleContainerKey(Math.random());
				}
			}
		},
		[urlPath]
	);

	useEffect(() => {
		const node = styleRef.current;
		if (!node) {
			return;
		}
		let styleIdsToRemove = [
			'global-styles-inline-css',
			'kubio-google-fonts-css',
			'elevate-theme-css',
			'kubio-third-party-blocks-css',
			'kubio-block-library-dep-fancybox-css',
			// 'kubio-woocommerce-css',
		];
		styleIdsToRemove = styleIdsToRemove.map((id) => `#${id}`);
		const selector = styleIdsToRemove.join(',');
		if (!selector) {
			return;
		}
		const styleNodes = node.querySelectorAll(selector);
		styleNodes.forEach((styleNode) => {
			styleNode?.remove();
		});
	}, [styleRef.current]);

	return (
		<div {...blockProps}>
			<div ref={styleRef} key={styleContainerKey}>
				<RawHTML>{renderedStyles}</RawHTML>
			</div>
			<RawHTML>{renderedContent}</RawHTML>
			<div className={'kubio-post-content-rendered-placeholder'}></div>
		</div>
	);
}

function Placeholder() {
	const blockProps = useBlockProps();
	return (
		<div {...blockProps}>
			<div className="wp-block-post-content__placeholder">
				<span>
					{__('This is a placeholder for post content.', 'kubio')}
				</span>
			</div>
		</div>
	);
}

function RecursionError() {
	const blockProps = useBlockProps();
	return (
		<div {...blockProps}>
			<Warning>
				{__('Block cannot be rendered inside itself.', 'kubio')}
			</Warning>
		</div>
	);
}

const PostContentComponent = ({
	context: { postId: contextPostId, postType: contextPostType },
	attributes,
	clientId,
}) => {
	const { layout = {} } = attributes;
	const [hasAlreadyRendered, RecursionProvider] = useNoRecursiveRenders(
		contextPostId
	);

	if (contextPostId && contextPostType && hasAlreadyRendered) {
		return <RecursionError />;
	}

	const showRenderedContent = false;

	if (showRenderedContent) {
		return <RenderedContent />;
	}
	const showLayoutPicker = false;

	const LayoutPickerComponent = showLayoutPicker ? LayoutPicker : Fragment;

	return (
		<RecursionProvider>
			{contextPostId && contextPostType ? (
				<>
					<AsyncModeProvider value={false}>
						<Content
							postType={contextPostType}
							postId={contextPostId}
							layout={layout}
						/>
						{showLayoutPicker
							? <LayoutPickerComponent
								postType={contextPostType}
								postId={contextPostId}
								clientId={clientId}
							/>
							: <Fragment />
						}
					</AsyncModeProvider>
				</>
			) : (
				<Placeholder />
			)}
		</RecursionProvider>
	);
};

export { PostContentComponent };
