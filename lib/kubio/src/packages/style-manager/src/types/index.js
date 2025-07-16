import { applyFilters } from '@wordpress/hooks';
import types from './types.json';

const getFilteredTypes = () => applyFilters( 'kubio.style-types', types );

const mergedTypes = getFilteredTypes();

export { mergedTypes as types, getFilteredTypes };
