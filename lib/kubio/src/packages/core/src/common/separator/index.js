import { LodashBasic, Media, separatorConfig } from '@kubio/style-manager';
import { useMemo } from '@wordpress/element';
import classnames from 'classnames';
import _, { merge } from 'lodash';
import svgSeparators from './svg-separators';

const { mediasById } = Media;

const supportsNegative = ( type ) => {
	return separatorConfig.separators[ type ].hasNegative;
};

const svgString = ( { negative, type } ) => {
	if ( negative && supportsNegative( type ) ) {
		return svgSeparators[ `${ type }-negative` ];
	}

	return svgSeparators[ type ];
};

const Separator = ( { enabledByMedia = {}, ...props } = {} ) => {
	const {
		color,
		position,
		negative,
		height = {},
		overlap,
		type,
	} = useMemo( () => merge( {}, separatorConfig.default, props ), [ props ] );

	const shouldDisplaySeparator = Object.values( enabledByMedia ).some(
		( value ) => value
	);
	let visibilityClasses = [];
	if ( shouldDisplaySeparator ) {
		visibilityClasses = getVisibilityPerMedia( enabledByMedia );
	}

	const style = useMemo( () => {
		const styleValue = {
			fill: color,
			height: `${ height.value }${ height.unit }`,
		};

		if ( ! overlap ) {
			styleValue.position = 'relative';
		}

		if ( position === 'top' ) {
			styleValue.top = 'calc(0px)';
		} else {
			styleValue.bottom = 'calc(0px)';
		}
		const top = position === 'top';
		const shouldUseNegative = supportsNegative( type ) && negative;
		if (
			( shouldUseNegative && top ) ||
			( ! shouldUseNegative && ! top )
		) {
			styleValue.transform = 'rotateX(180deg)';
		}

		return styleValue;
	}, [ color, position, negative, JSON.stringify( height ), overlap, type ] );

	const html = useMemo(
		() => svgString( { negative, type } ),
		[ negative, type ]
	);

	return (
		<>
			{ shouldDisplaySeparator && (
				<div
					className={ classnames( 'h-separator', visibilityClasses ) }
					dangerouslySetInnerHTML={ { __html: html } }
					style={ style }
				></div>
			) }
		</>
	);
};

function getVisibilityPerMedia( enabledByMedia = {} ) {
	const classes = [];
	const prefix = 'h-separator--display';
	_.each( enabledByMedia, ( enabled, media ) => {
		const mediaPrefix = _.get( mediasById, [ media, 'gridPrefix' ], false );
		const value = enabled ? 'flex' : 'none';
		const visibilityClasses = LodashBasic.compactWithExceptions(
			[ prefix, value, mediaPrefix ],
			[ 0, '0' ]
		).join( '-' );

		classes.push( visibilityClasses );
	} );

	return classes;
}

const Separators = ( props ) => {
	const { separators, enabledByMedia = {} } = props;
	const { top, bottom } = separators;
	const { top: topEnabledByMedia, bottom: bottomEnabledByMedia } =
		enabledByMedia;
	return (
		<>
			<Separator
				{ ...top }
				enabledByMedia={ topEnabledByMedia }
				position={ 'top' }
			/>
			<Separator
				{ ...bottom }
				enabledByMedia={ bottomEnabledByMedia }
				position={ 'bottom' }
			/>
		</>
	);
};

export { Separator, Separators };
