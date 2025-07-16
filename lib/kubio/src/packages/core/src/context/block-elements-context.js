import { createContext, useContext, useMemo } from '@wordpress/element';

const BlockElementsContext = createContext( {} );

const useBlockElementsContext = () => {
	return useContext( BlockElementsContext );
};

const useBlockElementProps = ( elementName, props = {} ) => {
	const propsByElementName = useBlockElementsContext();
	return useMemo(
		() => ( { ...props, ...propsByElementName?.[ elementName ] } ),
		[ props ]
	);
};

export { BlockElementsContext, useBlockElementsContext, useBlockElementProps };
