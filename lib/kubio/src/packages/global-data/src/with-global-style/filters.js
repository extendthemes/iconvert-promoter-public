import { useActiveMedia, useKubioBlockContext } from '@kubio/core';
import { compose, createHigherOrderComponent, pure } from '@wordpress/compose';
import { useMemo, useEffect, useState } from '@wordpress/element';
import { addFilter } from '@wordpress/hooks';
import isEqual from 'react-fast-compare';
import useGlobalDataStyle from '../use-global-data-style';
import { getInheritableStyle } from '../use-inherited-data';
import {
	KubioGlobalDataContextProvider,
	useKubioGlobalDataContext,
} from './global-data-context';
import { KubioGlobalStyleContext } from './global-style-context';
import {
	KubioInheritedStyleContext,
	useKubioInheritedStyleContext,
} from './inherited-style-context';

const BlockListBlockGlobalStyleWithContext = ({ children }) => {
	const globalData = useGlobalDataStyle();

	const globalDataMemoizedValue = useMemo(() => {
		return globalData;
	}, [globalData]);

	return (
		<KubioGlobalStyleContext.Provider value={globalDataMemoizedValue}>
			{children}
		</KubioGlobalStyleContext.Provider>
	);
};
const BlockListBlockGlobalStyle = createHigherOrderComponent(
	(BlockListBlock) => {
		return (props) => {
			const { global } = useKubioGlobalDataContext() || {};

			if (!props.rootClientId && global) {
				return (
					<BlockListBlockGlobalStyleWithContext>
						<BlockListBlock {...props} />
					</BlockListBlockGlobalStyleWithContext>
				);
			}
			return <BlockListBlock {...props} />;
		};
	},
	'BlockListBlockGlobalStyle'
);

const BlockListBlockInheritedStyle = compose([
	pure,
	createHigherOrderComponent((BlockListBlock) => {
		return (props) => {
			const { dataHelper } = useKubioBlockContext();
			const activeMedia = useActiveMedia();
			const [style, setStyle] = useState();

			useEffect(() => {
				const nextStyle = dataHelper
					? getInheritableStyle(dataHelper, { media: activeMedia })
					: {};

				setStyle((currentStyle) => {
					if (!isEqual(nextStyle, currentStyle)) {
						return nextStyle;
					}

					return currentStyle;
				});
			}, [props.attributes?.kubio?.style, activeMedia]);

			const inheritedStyle = useKubioInheritedStyleContext({
				style,
			});

			return (
				<KubioInheritedStyleContext.Provider value={inheritedStyle}>
					<BlockListBlock {...props} />
				</KubioInheritedStyleContext.Provider>
			);
		};
	}, 'BlockListBlockInheritedStyle'),
]);

const BlockListKubioGlobalDataContextProvider = createHigherOrderComponent(
	(BlockListBlock) => {
		return (props) => {
			const wrap = !window.isKubioBlockEditor && !props.rootClientId;
			return !wrap ? (
				<BlockListBlock {...props} />
			) : (
				<KubioGlobalDataContextProvider>
					<BlockListBlock {...props} />
				</KubioGlobalDataContextProvider>
			);
		};
	},
	'BlockListKubioGlobalDataContextProvider'
);

addFilter(
	'editor.BlockListBlock',
	'kubio/BlockListBlockInheritedStyle',
	BlockListBlockInheritedStyle,
	4
);

addFilter(
	'editor.BlockListBlock',
	'kubio.BlockListBlockGlobalStyle',
	BlockListBlockGlobalStyle
);

addFilter(
	'editor.BlockListBlock',
	'kubio/BlockListKubioGlobalDataContextProvider',
	BlockListKubioGlobalDataContextProvider
);
