import { __experimentalNumberControl as NumberControl } from '@wordpress/components';

import styled from '@emotion/styled';
import { rtl, space } from '../../utils/style-mixins';
import { css } from '@emotion/react';

const rangeHeight = () => css({ height: 30, minHeight: 30 });

// https://github.com/WordPress/gutenberg/blob/master/packages/components/src/range-control/styles/range-control-styles.js#L276
export const InputNumber = styled(NumberControl)`
	box-sizing: border-box;
	display: inline-block;
	font-size: 13px;
	margin-top: 0;
	width: ${space(8)} !important;
	input[type='number']& {
		${rangeHeight};
	}
	${rtl({ marginLeft: `${space(2)} !important` })}
`;
