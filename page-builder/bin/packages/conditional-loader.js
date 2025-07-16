module.exports = function ( source, options, callback ) {
	return parse( source, options );
};

function parse( source, defs ) {
	if ( source.indexOf( '#if' ) < 0 ) {
		return source;
	}

	let deep = 0;
	let index = 0;
	let func = 'var __$arr = [];\n';
	source.replace(
		/(.*)#(if |elseif |else|endif)(.*)(\n|\r\n|$)/g,
		function ( all, pre, keyword, condition, endLine, startIndex ) {
			if ( ! /(<!--|\/\/|\/\*)/.test( pre ) ) {
				return;
			}

			func += `__$arr.push([${ index }, ${ startIndex }]);`;
			index = startIndex + all.length;
			keyword = keyword.trim();

			// js块注释结束
			if ( condition.indexOf( '*/' ) > 0 ) {
				condition = condition.replace( /\*\**\//g, '' );
			}

			if ( condition.indexOf( '-->' ) > 0 ) {
				// html中注释结尾处理
				condition = condition.replace( /--+>/g, '' );
			}

			switch ( keyword ) {
				case 'if':
					deep += 1;
					func += `\nif(${ condition }) {\n`;
					break;
				case 'elseif':
					func += `\n} else if(${ condition }) {\n`;
					break;
				case 'else':
					func += '\n} else {\n';
					break;
				case 'endif':
					deep -= 1;
					func += '\n}\n';
					break;
			}
		}
	);
	if ( deep !== 0 ) {
		throw '#if and #endif not matched..';
	}

	if ( index < source.length ) {
		func += `__$arr.push([${ index }, ${ source.length }]);`;
	}
	func += 'return __$arr;';

	const arr = evaluate( func, defs );
	const result = arr
		.map( ( position ) => source.substring( position[ 0 ], position[ 1 ] ) )
		.join( '' );
	return result;
}

/**
 * @param code
 * @param defs
 * @return evaluate code with defs
 */
function evaluate( code, defs ) {
	const args = Object.keys( defs );
	let result;
	try {
		const f = new ( Function.bind.apply(
			Function,
			[ void 0 ].concat( args, [ code ] )
		) )();
		result = f.apply(
			void 0,
			args.map( function ( k ) {
				return defs[ k ];
			} )
		);
	} catch ( error ) {
		throw 'error evaluation: ' + code + '\n' + error;
	}
	return result;
}
