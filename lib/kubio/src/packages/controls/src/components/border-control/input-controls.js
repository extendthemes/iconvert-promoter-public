/**
 * External dependencies
 */
import { noop } from 'lodash';

/**
 * Internal dependencies
 */
import UnitControl from './unit-control';
import { borderStylesOptions, LABELS } from './utils';
import {
	LayoutContainer,
	Layout,
	HeaderControlWrapper,
} from './styles/box-control-styles';
import BorderControlIcon from './icon';
import {
	Button,
	Flex,
	FlexBlock,
	FlexItem,
	SelectControl,
} from '@wordpress/components';
import ColorIndicatorPopover from '../color/color-indicator-popover';
import { ResetIcon } from '@kubio/icons';
import { __ } from '@wordpress/i18n';

export default function BoxInputControls( {
	onChange = noop,
	onFocus = noop,
	onHoverOn = noop,
	onHoverOff = noop,
	values,
	...props
} ) {
	const createHandleOnFocus = ( side ) => ( event ) => {
		onFocus( event, { side } );
	};

	const createHandleOnHoverOn = ( side ) => () => {
		onHoverOn( { [ side ]: true } );
	};

	const createHandleOnHoverOff = ( side ) => () => {
		onHoverOff( { [ side ]: false } );
	};

	const handleOnChange = ( nextValues ) => {
		onChange( nextValues );
	};

	const { top, right, bottom, left } = values;

	const sides = [ 'top', 'right', 'bottom', 'left' ];

	const createHandleOnChange =
		( side ) =>
		( next, { event } ) => {
			const { altKey } = event;
			const nextValues = { ...values };

			nextValues[ side ] = next;

			/**
			 * Supports changing pair sides. For example, holding the ALT key
			 * when changing the TOP will also update BOTTOM.
			 */
			if ( altKey ) {
				switch ( side ) {
					case 'top':
						nextValues.bottom = next;
						break;
					case 'bottom':
						nextValues.top = next;
						break;
					case 'left':
						nextValues.right = next;
						break;
					case 'right':
						nextValues.left = next;
						break;
				}
			}

			handleOnChange( nextValues );
		};

	const getSide = ( side ) => {
		return (
			<HeaderControlWrapper className="component-box-control__header-control-wrapper kubio-box-control-unlinked-container">
				<FlexItem>
					<BorderControlIcon side={ side } />
				</FlexItem>
				<FlexBlock>
					<SelectControl
						options={ borderStylesOptions }
						key={ side + '-style' }
						// value={style}
						// onChange={(value) => {
						// 	const newValue = updateSidesValue(
						// 		currentValue,
						// 		writeSides,
						// 		'style',
						// 		value
						// 	);
						// 	onChange(newValue);
						// }}
					/>
				</FlexBlock>

				<FlexBlock>
					<UnitControl
						value={ side }
						onChange={ createHandleOnChange( side ) }
						onFocus={ createHandleOnFocus( side ) }
						onHoverOn={ createHandleOnHoverOn( side ) }
						onHoverOff={ createHandleOnHoverOff( side ) }
						label={ side }
					/>
				</FlexBlock>

				<FlexItem>
					<ColorIndicatorPopover
						key={ side + '-color' }
						// value={color}
						// onChange={(newColor) => {
						// 	const newValue = updateSidesValue(
						// 		currentValue,
						// 		writeSides,
						// 		'color',
						// 		newColor
						// 	);
						// 	onChange(newValue);
						// }}
					/>
				</FlexItem>

				<FlexItem>
					<Button
						isSmall
						icon={ ResetIcon }
						label={ __( 'Reset', 'kubio' ) }
						className={
							'kubio-popover-options-icon kubio-color-indicator-popover-reset-icon kubio-border-control-button'
						}
						// disabled={!isDirty}
						// onClick={handleOnReset}
					/>
				</FlexItem>
			</HeaderControlWrapper>
		);
	};

	return (
		// <LayoutContainer className="component-box-control__input-controls-wrapper">
		// 	<Layout
		// 		gap={0}
		// 		align="top"
		// 		className="component-box-control__input-controls"
		// 	>
		// 		<UnitControl
		// 			{...props}
		// 			isFirst
		// 			value={top}
		// 			onChange={createHandleOnChange('top')}
		// 			onFocus={createHandleOnFocus('top')}
		// 			onHoverOn={createHandleOnHoverOn('top')}
		// 			onHoverOff={createHandleOnHoverOff('top')}
		// 			label={LABELS.top}
		// 		/>
		// 		<UnitControl
		// 			{...props}
		// 			value={right}
		// 			onChange={createHandleOnChange('right')}
		// 			onFocus={createHandleOnFocus('right')}
		// 			onHoverOn={createHandleOnHoverOn('right')}
		// 			onHoverOff={createHandleOnHoverOff('right')}
		// 			label={LABELS.right}
		// 		/>
		// 		<UnitControl
		// 			{...props}
		// 			value={bottom}
		// 			onChange={createHandleOnChange('bottom')}
		// 			onFocus={createHandleOnFocus('bottom')}
		// 			onHoverOn={createHandleOnHoverOn('bottom')}
		// 			onHoverOff={createHandleOnHoverOff('bottom')}
		// 			label={LABELS.bottom}
		// 		/>
		// 		<UnitControl
		// 			{...props}
		// 			isLast
		// 			value={left}
		// 			onChange={createHandleOnChange('left')}
		// 			onFocus={createHandleOnFocus('left')}
		// 			onHoverOn={createHandleOnHoverOn('left')}
		// 			onHoverOff={createHandleOnHoverOff('left')}
		// 			label={LABELS.left}
		// 		/>
		// 	</Layout>
		// </LayoutContainer>
		<> { sides.map( ( value ) => getSide( value ) ) }</>
	);
}
