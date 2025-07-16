import { computeTBLRCss, createGroup, createTBLRDefault } from '../utils';
import { types } from '../types';
const defaultValue = createTBLRDefault( types.definitions.unitValuePx.default );

export default createGroup( {
	groupName: 'padding',
	toStyle: ( style, obj ) => computeTBLRCss( 'padding', style, obj ),
	default: defaultValue,
} );
