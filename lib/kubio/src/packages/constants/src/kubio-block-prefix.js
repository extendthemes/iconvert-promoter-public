import { applyFilters } from '@wordpress/hooks';

const KUBIO_BLOCK_PREFIX = applyFilters('kubio.constants.kubioPrefix', 'kubio');

export { KUBIO_BLOCK_PREFIX };
