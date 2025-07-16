//https://stackoverflow.com/questions/4187146/truncate-number-to-two-decimal-places-without-rounding

export function toFixedNoRounding( num, fixed = 2 ) {
	const re = new RegExp( '^-?\\d+(?:.\\d{0,' + ( fixed || -1 ) + '})?' );
	return parseFloat( num.toString().match( re )[ 0 ] );
}

export function toFixed( num, fixed = 5 ) {
	const number = Number.parseFloat( num );
	return Number.parseFloat( number.toFixed( fixed ) );
}

export function toFixedHighPrecision( num, fixed = 6 ) {
	return toFixed( num, fixed );
}
