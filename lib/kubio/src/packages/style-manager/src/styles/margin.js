import { computeTBLRCss, createGroup, createTBLRDefault } from '../utils';
import { types } from '../types';

const defaultValue = createTBLRDefault( types.definitions.unitValuePx.default );

export default createGroup( {
	groupName: 'margin',
	toStyle: ( style, value ) => computeTBLRCss( 'margin', style, value ),
	default: defaultValue,
} );
