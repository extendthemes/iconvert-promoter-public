import useGlobalDataEntity from './use-global-data-entity';

const useGlobalAlternateLogo = () => {
	const { getPathValue, setPathValue } = useGlobalDataEntity();

	const alternateLogo = getPathValue('alternateLogo');

	const setAlternateLogo = (nextValue) => {
		setPathValue('alternateLogo', nextValue);
	};

	return {
		alternateLogo,
		setAlternateLogo,
	};
};

export default useGlobalAlternateLogo;
