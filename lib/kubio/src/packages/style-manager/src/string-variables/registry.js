import { each, isFunction, merge } from 'lodash';
import { evaluateStringTemplate } from 'string-template-parser';

const definedVariables = {};

function variablesTypes( key = false ) {
	const variables = {};
	let search;

	if ( ! key ) {
		search = definedVariables;
	} else {
		search = { [ key ]: definedVariables[ key ] };
	}

	each( search || {}, function ( val, key ) {
		if ( isFunction( val.fct ) ) {
			merge( variables, val.fct() );
		}
	} );
	return variables;
}

export function evaluate( str, key = false ) {
	let search;
	if ( ! key ) {
		search = definedVariables;
	} else {
		search = { [ key ]: definedVariables[ key ] };
	}
	let computedString = str;

	each( search || {}, function ( variable, key ) {
		let variables = {};
		if ( isFunction( variable.generator ) ) {
			variables = variable.generator();
		}

		const pipes = variable.pipes || {};
		computedString = evaluateStringTemplate(
			computedString,
			variables,
			pipes
		);
	} );
	//if the theme color was not found we should remove the theme color string with empty string
	//${themeColor1}
	const themeColorRegex = /\$\{[^\}]+\}/g;
	computedString.replace( themeColorRegex, '' );
	return computedString;
}

export function registerVariables( key, pipes, generator ) {
	definedVariables[ key ] = {
		generator,
		pipes,
	};
}
