import {
	addValueUnitString,
	createGroup,
	isNotEmptyButCanBeZero,
	toValueUnitString,
	toValueUnitStringFunction,
} from '../../utils';

const defaultValue = {
	type: 'border',
	color: '#000000',
	offsetTop: {
		value: '15',
		unit: '%',
	},
	offsetLeft: {
		value: '5',
		unit: '%',
	},
	width: {
		value: '100',
		unit: '%',
	},
	height: {
		value: '100',
		unit: '%',
	},
	thickness: {
		value: '10',
		unit: 'px',
	},
	enabledFrameOption: false,
	showFrameOverImage: false,
	showFrameShadow: false,
};

function computeTranslate( translateType, data ) {
	return toValueUnitStringFunction( translateType, data );
}

const getFrameOptionsCss = ( {
	enabledFrameOption,
	type,
	offsetLeft,
	offsetTop,
	color,
	showFrameShadow,
	thickness,
	showFrameOverImage,
	width,
	height,
} = {} ) => {
	if ( ! enabledFrameOption ) {
		return {};
	}

	const style = {};

	if ( type === 'border' ) {
		style.backgroundColor = 'transparent';
		style.borderStyle = `solid`;
		style.borderWidth = toValueUnitString( thickness );
		style.borderColor = color;
	} else {
		style.backgroundColor = color;
	}

	if ( showFrameShadow ) {
		style.boxShadow =
			'0 2px 4px -1px rgba(0,0,0,.2), 0 4px 5px 0 rgba(0,0,0,.14), 0 1px 10px 0 rgba(0,0,0,.12)';
	}

	const translateX = computeTranslate( 'translateX', offsetLeft );
	const translateY = computeTranslate( 'translateY', offsetTop );
	if (
		isNotEmptyButCanBeZero( translateX ) ||
		isNotEmptyButCanBeZero( translateY )
	) {
		style.transform = `${ translateX } ${ translateY }`;
	}

	style.zIndex = showFrameOverImage ? 1 : -1;

	addValueUnitString( style, 'width', width );
	addValueUnitString( style, 'height', height );

	return style;
};

export default createGroup( {
	groupName: 'frameOptions',
	toStyle: getFrameOptionsCss,
	default: defaultValue,
} );
