import { deepmergeAll } from '@kubio/utils';
import { useSelect } from '@wordpress/data';
import { useMemo } from '@wordpress/element';
import { find, omit } from 'lodash';
import useGlobalDataEntity from './use-global-data-entity';

const useGlobalDataMenuLocations = () => {
	const menuLocationsPath = 'menuLocations';
	const initialLocations = useSelect(
		(select) => select('core').getMenuLocations() || [],
		[]
	);

	const { getPathValue, setPathValue } = useGlobalDataEntity();

	const updatedMenuLocations = getPathValue(
		menuLocationsPath,
		initialLocations
	);

	const setMenuLocations = (nextValue) => {
		setPathValue(
			menuLocationsPath,
			nextValue.map((location) => omit(location, 'description'))
		);
	};

	const menuLocations = useMemo(
		() =>
			updatedMenuLocations.map((newLocation) => {
				const { name } = newLocation;
				const initialLocation = find(initialLocations, { name });

				return deepmergeAll([initialLocation, newLocation]);
			}),
		[updatedMenuLocations, initialLocations]
	);

	return {
		menuLocations,
		setMenuLocations,
	};
};

export default useGlobalDataMenuLocations;
