import { useBlocksOwnerDocument } from '@kubio/editor-data';
import { useCallback, useMemo } from '@wordpress/element';
import { once } from 'lodash';
import { renderAdditionalCSS as renderCSS } from './global-style-render';
import useGlobalDataEntity from './use-global-data-entity';

const useGlobalAdditionalCSS = () => {
	const { getPathValue, setPathValue } = useGlobalDataEntity();
	const ownerDocument = useBlocksOwnerDocument();

	const additionalCSS = useMemo(() => getPathValue('additional_css'), [
		getPathValue,
	]);

	const setAdditionalCSS = useCallback(
		(nextValue) => {
			setPathValue('additional_css', nextValue);
			renderCSS(nextValue, ownerDocument);
		},
		[ownerDocument, setPathValue]
	);

	const renderAdditionalCSS = useCallback(
		() => renderCSS(additionalCSS, ownerDocument),
		[ownerDocument, additionalCSS]
	);

	const initAdditionalCSS = once(renderAdditionalCSS);

	return {
		additionalCSS,
		setAdditionalCSS,
		renderAdditionalCSS,
		initAdditionalCSS,
	};
};

export default useGlobalAdditionalCSS;
