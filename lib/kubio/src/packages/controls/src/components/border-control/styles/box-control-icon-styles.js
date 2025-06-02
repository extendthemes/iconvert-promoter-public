/**
 * External dependencies
 */
import { css } from '@emotion/react';
import styled from '@emotion/styled';

export const Root = styled.span`
	box-sizing: border-box;
	display: block;
	width: 24px;
	height: 24px;
	position: relative;
	padding: 4px;
	padding-left: 0;
`;

export const Viewbox = styled.span`
	box-sizing: border-box;
	display: block;
	position: relative;
	width: 18px;
	height: 18px;
`;

const strokeFocus = ( { isFocused } ) => {
	return css( {
		backgroundColor: isFocused ? '#007CBA' : '#CCCCCC',
	} );
};

const Stroke = styled.span`
	box-sizing: border-box;
	display: block;
	pointer-events: none;
	position: absolute;
	${ strokeFocus };
`;

const VerticalStroke = styled( Stroke )`
	bottom: 2px;
	top: 2px;
	width: 1.5px;
`;

const HorizontalStroke = styled( Stroke )`
	height: 1.5px;
	left: 2px;
	right: 2px;
`;

export const TopStroke = styled( HorizontalStroke )`
	top: 0;
`;

export const RightStroke = styled( VerticalStroke )`
	right: 0;
`;

export const BottomStroke = styled( HorizontalStroke )`
	bottom: 0;
	height: 2px;
`;

export const LeftStroke = styled( VerticalStroke )`
	left: 0;
`;
