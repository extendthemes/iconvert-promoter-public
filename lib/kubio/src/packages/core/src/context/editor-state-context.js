import { createContext, useContext } from '@wordpress/element';

const EditorStateContext = createContext( {
	name: null,
} );

const useEditorStateContext = () => {
	return useContext( EditorStateContext );
};

export { EditorStateContext, useEditorStateContext };
