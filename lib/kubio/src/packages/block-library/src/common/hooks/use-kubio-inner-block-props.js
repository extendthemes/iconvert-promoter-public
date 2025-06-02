import { STORE_KEY } from '@kubio/constants';
import { useDeepMemo } from '@kubio/core';
import { InnerBlocks, useBlockEditContext } from '@wordpress/block-editor';
// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
import {
	useInnerBlocksProps,
	__experimentalUseInnerBlocksProps as useExperimentalInnerBlockProps,
} from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';
import { useMemo } from '@wordpress/element';
import { isUndefined } from 'lodash';

const useKubioInnerBlockProps = (props = {}, options = {}) => {
	const { clientId } = useBlockEditContext();
	let { isEmpty, isGutentagEditor } = useSelect(
		(select) => {
			const innerBlocks = select('core/block-editor').getBlocks(clientId);
			const gutentagStore = select(STORE_KEY);

			return {
				isEmpty: innerBlocks.length === 0,
				isGutentagEditor: !!gutentagStore,
			};
		},
		[clientId]
	);
	const {overRidesEmpty} = options;
	isEmpty = overRidesEmpty===undefined ? isEmpty : overRidesEmpty;
	const renderAppender = useMemo(() => {
		let appender = options.renderAppender;

		if (isUndefined(appender) || appender === true) {
			appender = 'kubio-render-appender';
		}

		if (appender === 'kubio-render-appender') {
			if (isEmpty) {
				appender = InnerBlocks.ButtonBlockAppender;
			} else if (isGutentagEditor) {
				appender = false;
			} else {
				appender = undefined;
			}
		}

		return appender;
	}, [options.renderAppender, isEmpty, isGutentagEditor]);

	options = useDeepMemo(
		() => ({
			...options,
			renderAppender,
		}),
		[options, renderAppender]
	);

	// this conditional hook is need to support wp 5.9

	if (useExperimentalInnerBlockProps) {
		// eslint-disable-next-line react-hooks/rules-of-hooks
		return useExperimentalInnerBlockProps(props, options);
	}

	// eslint-disable-next-line react-hooks/rules-of-hooks
	return useInnerBlocksProps(props, options);
};

export { useKubioInnerBlockProps };
