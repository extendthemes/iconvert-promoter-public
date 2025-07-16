import { types } from '../types';
import { keyBy } from 'lodash';
const states = types.states;
const statesById = keyBy( states, 'id' );
const StatesEnum = types.enums.states;
export { states, statesById, StatesEnum };
