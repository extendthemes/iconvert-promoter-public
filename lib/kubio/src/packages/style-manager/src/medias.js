import { keyBy } from 'lodash';
import { types } from './types';
const medias = types.medias;
const mediasById = keyBy( medias, 'id' );
export { medias, mediasById };
