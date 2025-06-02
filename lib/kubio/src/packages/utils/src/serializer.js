import { compact, get } from 'lodash';
import tinycolor from 'tinycolor2';

export function serializeGradientColor( { type, value } ) {
	if ( type === 'literal' ) {
		return value;
	}
	return `${ type }(${ value.join( ',' ) })`;
}

export function serializeGradientPosition( position ) {
	if ( ! position ) {
		return '';
	}
	const { type, value } = position;
	return `${ value }${ type }`;
}

export function serializeGradientColorStop( { type, value, length } ) {
	return `${ serializeGradientColor( {
		type,
		value,
	} ) } ${ serializeGradientPosition( length ) }`;
}

export function serializeGradientOrientation( orientation ) {
	if ( ! orientation || orientation.type !== 'angular' ) {
		return;
	}
	return `${ orientation.value }deg`;
}

export function serializeGradient( { type, orientation, colorStops } ) {
	const serializedOrientation = serializeGradientOrientation( orientation );
	const serializedColorStops = colorStops
		.sort( ( colorStop1, colorStop2 ) => {
			return (
				get( colorStop1, [ 'length', 'value' ], 0 ) -
				get( colorStop2, [ 'length', 'value' ], 0 )
			);
		} )
		.map( serializeGradientColorStop );
	return `${ type }(${ compact( [
		serializedOrientation,
		...serializedColorStops,
	] ).join( ',' ) })`;
}

export function colibriGradientToGutenberg( colibriGradient ) {
	if ( ! colibriGradient ) {
		return null;
	}

	const type = colibriGradient.type || 'linear-gradient';

	const result = {
		type,
		colorStops: colibriGradient.steps.map( ( item ) => {
			const color = tinycolor( item.color );
			return {
				type: 'rgba',
				value: [ color._r, color._g, color._b, color._a ],
				length: { type: '%', value: item.position || 0 },
			};
		} ),
	};

	if ( type === 'linear-gradient' ) {
		result.orientation = { type: 'angular', value: colibriGradient.angle };
	}

	return result;
}

export function gutenbergGradientToColibri( gutenbergGradient ) {
	return {
		type: gutenbergGradient.type,
		angle: gutenbergGradient.orientation
			? parseInt( gutenbergGradient.orientation.value )
			: 0,
		steps: gutenbergGradient.colorStops.map( ( item ) => ( {
			position: parseInt( item.length.value ),
			color: serializeGradientColor( {
				type: 'rgba',
				value: item.value,
			} ),
		} ) ),
	};
}
