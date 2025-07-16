import { createContext, useContext } from '@wordpress/element';
import { noop } from 'lodash';

const TemplatePartContext = createContext( {
	name: null,
} );

const useTemplatePartContext = () => {
	return useContext( TemplatePartContext );
};

export { TemplatePartContext, useTemplatePartContext };
