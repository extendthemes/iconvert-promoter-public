import { STORE_KEY } from '@kubio/constants';
import { useDispatch, useSelect } from '@wordpress/data';
import { noop } from 'lodash';

const useUIVersion = () => {
	const uiVersion = useSelect(
		(select) => select(STORE_KEY)?.getUIVersion?.() || 1,
		[]
	);

	const { setUIVersion = noop } = useDispatch(STORE_KEY) || {};

	return { uiVersion, setUIVersion };
};

export { useUIVersion };
