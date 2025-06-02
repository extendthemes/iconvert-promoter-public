/**
 * External dependencies
 */
import { css } from '@emotion/react';
import styled from '@emotion/styled';
/**
 * Internal dependencies
 */

import { Flex } from '@wordpress/components';

import { UnitControl as BaseUnitControl } from '../../unit-control';

import { color, rtl } from '../../utils/style-mixins';

export const Root = styled.div`
	box-sizing: border-box;
	margin-bottom: 10px;
	width: 100%;
`;

export const Header = styled( Flex )`
	color: ${ color( 'ui.label' ) };
	padding-bottom: 8px;
`;

export const HeaderControlWrapper = styled( Flex )`
	min-height: 30px;
`;

export const UnitControlWrapper = styled.div`
	box-sizing: border-box;
	max-width: 80px;
`;

export const LayoutContainer = styled( Flex )`
	justify-content: center;
	padding-top: 8px;
	flex: 1 0 0;
`;

export const Layout = styled( Flex )`
	position: relative;
	height: 100%;
	width: 100%;
	justify-content: flex-start;
`;

const unitControlBorderRadiusStyles = ( { isFirst, isLast, isOnly } ) => {
	if ( isFirst ) {
		return rtl( { borderTopRightRadius: 0, borderBottomRightRadius: 0 } )();
	}
	if ( isLast ) {
		return rtl( { borderTopLeftRadius: 0, borderBottomLeftRadius: 0 } )();
	}
	if ( isOnly ) {
		return css( { borderRadius: 2 } );
	}

	return css( {
		borderRadius: 0,
	} );
};

const unitControlMarginStyles = ( { isFirst } ) => {
	const marginLeft = isFirst ? 0 : -1;

	return rtl( { marginLeft } )();
};

export const UnitControl = styled( BaseUnitControl )`
	max-width: 63px;
	${ unitControlBorderRadiusStyles };
	${ unitControlMarginStyles };
`;
