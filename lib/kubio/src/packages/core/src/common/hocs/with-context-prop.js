import { createHigherOrderComponent } from '@wordpress/compose';
import { createContext, useContext } from '@wordpress/element';

const BlockContext = createContext( {} );
const useBlockContext = () => {
	return useContext( BlockContext );
};

//the withContextProp should be placed in the edit file. So the context can be accesed from both sidebar and canvas
//If the context is used in the canvas the hoc withColibriDataAutoSave needs to be used instead of withColibriData
const withContextProp = () => {
	return createHigherOrderComponent(
		( WrappedComponent ) =>
			( ownProps = {} ) => {
				return <WrappedComponent { ...ownProps } />;
			},
		'withContextProp'
	);
};
export { withContextProp, useBlockContext };
