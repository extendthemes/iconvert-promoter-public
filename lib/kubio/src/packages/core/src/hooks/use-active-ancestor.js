import { useDispatch, useSelect } from '@wordpress/data';
import { STORE_KEY } from '@kubio/constants';

const useActiveAncestor = () => {
	const value = useSelect( ( select ) => {
		const store = select( STORE_KEY );
		return store.getCurrentAncestor();
	}, [] );

	const { setCurrentAncestor } = useDispatch( STORE_KEY );
	return [ value, setCurrentAncestor ];
};

export { useActiveAncestor };
