import { getNamesOfBlocks } from '@kubio/block-library';
import { useBlocksOwnerDocument } from '@kubio/editor-data';
import { useThrottle } from '@wordpress/compose';
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from '@wordpress/element';
import { noop } from 'lodash';

const HoveredSectionContext = createContext({
	clientId: null,
	setContainer: noop,
});
const useHoveredSection = () => {
	return useContext(HoveredSectionContext);
};

const blocksNames = getNamesOfBlocks();
const sectionLikeBlocks = [
	blocksNames.SECTION,
	blocksNames.HERO,
	blocksNames.NAVIGATION,
];

const sectionSelector = sectionLikeBlocks
	.map((blockName) => `[data-type="${blockName}"]`)
	.join(',');

const HoveredSectionProvider = ({ children }) => {
	const [clientId, setClientId] = useState(null);

	const container = useBlocksOwnerDocument();

	const onMouseMove = useThrottle(
		useCallback((event) => {
			const element = event?.target?.closest?.(sectionSelector);
			const nextClientId = element?.getAttribute('data-block') || null;
			setClientId(nextClientId);
		}, []),
		300
	);

	useEffect(() => {
		if (container) {
			container.addEventListener('mousemove', onMouseMove);

			return () =>
				container.removeEventListener('mousemove', onMouseMove);
		}
	}, [container]);

	const value = useMemo(() => {
		return {
			clientId,
		};
	}, [clientId]);

	return (
		<HoveredSectionContext.Provider value={value}>
			{children}
		</HoveredSectionContext.Provider>
	);
};

export { useHoveredSection, HoveredSectionProvider };
