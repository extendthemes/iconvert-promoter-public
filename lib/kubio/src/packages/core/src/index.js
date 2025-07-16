import { applyFilters } from '@wordpress/hooks';
import './hooks/blocks';
export * from './common';
export * from './context';
export * from './data-wrapper/access';
export * from './hooks';
export * from './notices';
export * from './support';
export * from './templates-store';
export * from './utils';
export * from './utils/convert';
import * as Merger from './utils/merge';
export * from './utils/prefixes';
export * from './utils/shared-style';
export { isKubioEditor, Merger };

const isKubioEditor = () => {
	return applyFilters( 'kubio.is-kubio-editor', !! top.isKubioBlockEditor );
};
