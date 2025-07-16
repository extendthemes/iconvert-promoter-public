import { addValueUnitString } from '../../utils';
import { LodashBasic } from '../../core/lodash-basic';
import { types } from '../../types';

const defaultValue = types.props.border.default;

const border = {
	name: 'border',
	parser( value ) {
		const style = {};

		// style "none" should not be rendered from default as it will disable borders inherited from other selectors
		for ( const side in defaultValue ) {
			LodashBasic.unset( defaultValue, [ side, 'style' ] );
		}

		const borderWithRadius = LodashBasic.merge( {}, defaultValue, value );

		const radiuses = types.props.border.radiusMap;
		for ( const path in radiuses ) {
			const radius = LodashBasic.get(
				borderWithRadius,
				radiuses[ path ],
				null
			);

			LodashBasic.unset( borderWithRadius, radiuses[ path ] );

			if ( radius !== null ) {
				addValueUnitString( style, path, radius );
			}
		}

		for ( const side in borderWithRadius ) {
			const borderSide = borderWithRadius[ side ];
			const borderWidth = parseInt(
				LodashBasic.get( borderSide, 'width.value', null )
			);
			let sideProps = [ 'color', 'width', 'style' ];

			if ( isNaN( borderWidth ) ) {
				sideProps = [ 'color' ];
			}

			for ( const propName of sideProps ) {
				if ( borderSide[ propName ] ) {
					addValueUnitString(
						style,
						'border-' + side + '-' + propName,
						borderSide[ propName ]
					);
				}
			}
		}

		return style;
	},
	default: defaultValue,
};

export default border;
