import { createGroup } from '../utils';
import _ from 'lodash';

export default createGroup( {
	groupName: 'textAlign',
	toStyle: _.identity,
} );
