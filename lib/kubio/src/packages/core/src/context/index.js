import { createContext, useContext } from '@wordpress/element';

const ColibriContext = createContext( {} );

const useColibriContext = () => {
	return useContext( ColibriContext );
};

export { ColibriContext, useColibriContext };
export * from './data-helper-default-options-context';
export * from './inspector-context';
export * from './block-elements-context';
export * from './ancestor-context';
export * from './owner-document-context';
export * from './kubio-block-context';
export * from './block-style-render-context';
export * from './block-edit-session-context';
export * from './template-part-context';
export * from './popup-nesting-context';
export * from './editor-state-context';
export * from './hovered-section-context';