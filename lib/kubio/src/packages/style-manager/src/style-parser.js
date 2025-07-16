import styleGroups from './styles';
import { LodashBasic } from './core/lodash-basic';
import { toValueUnitString } from './utils';
import _, { omit } from 'lodash';

class StyleParser {
	static instance;

	static getInstance() {
		if ( ! StyleParser.instance ) {
			StyleParser.instance = new StyleParser();
		}
		return StyleParser.instance;
	}

	constructor() {
		this.groups = {};
		for ( const name in styleGroups ) {
			const group = styleGroups[ name ];
			// console.error('add group => ', group.name, group.parser);
			this.addGroup( group.name, group.parser );
		}
	}

	evaluateString( value ) {
		return value;
	}

	addGroup( name, parserFct ) {
		this.groups[ name ] = ( value, options ) =>
			parserFct( value, { parser: this, options } );
	}

	evaluate( value ) {
		if ( LodashBasic.isString( value ) ) {
			return this.evaluateString( value );
		}

		LodashBasic.each( value, ( val, name ) => {
			value[ name ] = this.evaluate( val );
		} );

		return value;
	}

	transform( obj, options, skipNormal = false ) {
		if ( ! obj ) {
			return;
		}
		let css = {};

		obj = this.filterProps( obj );

		for ( const prop in obj ) {
			if ( this.groups[ prop ] ) {
				let newProps = LodashBasic.bind( this.groups[ prop ], this )(
					obj[ prop ],
					options
				);
				newProps = this.evaluate( newProps );
				css = LodashBasic.merge( css, newProps || {} );
			} else if ( prop.indexOf( '--' ) === 0 ) {
				css[ prop ] = toValueUnitString( obj[ prop ] );
			} else if ( ! skipNormal ) {
				css[ prop ] = this.evaluate( obj[ prop ] );
			}
		}
		return css;
	}

	filterProps( obj ) {
		let toRemove = [];

		if ( Object.hasOwn( obj, 'size' ) ) {
			toRemove = toRemove.concat( [
				'width',
				'height',
				'minWidth',
				'minHeight',
			] );
		}

		return omit( obj, toRemove );
	}
}

export { StyleParser };
