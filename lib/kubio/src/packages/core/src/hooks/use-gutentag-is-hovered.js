import { noop } from 'lodash';

const isTargetPartOfBlock = ( event ) => {
	if ( event.target === event.currentTarget ) {
		return true;
	}

	if (
		event.target.getAttribute( 'data-block' ) &&
		event.target !== event.currentTarget
	) {
		return false;
	}

	return event.target.closest( '[data-block]' ) === event.currentTarget;
};

const useGutentagIsHovered = ( {
	clientId,
	includeInnerBlocks = false,
	key = 'hovered-block',
} ) => {
	return {
		isHovered: false,
		onMouseOver: noop,
		onMouseLeave: noop,
	};
};
//
// const useGutentagIsHoveredSection = ({ clientId }) =>
// 	useGutentagIsHovered({
// 		clientId,
// 		includeInnerBlocks: true,
// 		key: 'hovered-section',
// 	});

// const useGutentagCheckIsHovered = ({ clientId, key = 'hovered-block' }) => {
// 	const [hoveredClientId] = useGlobalSessionProp(key, null);
// 	return useMemo(() => hoveredClientId === clientId, [hoveredClientId]);
// };

export {
	useGutentagIsHovered,
	// useGutentagIsHoveredSection,
	// useGutentagCheckIsHovered,
};
