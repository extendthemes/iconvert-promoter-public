/**
 * External dependencies
 */
/**
 * Internal dependencies
 */
import { Flex } from '@wordpress/components';
import { useMemo } from '@wordpress/element';
/**
 * WordPress dependencies
 */
import { sprintf, __ } from '@wordpress/i18n';
import { get, map, omit } from 'lodash';
import AnglePickerControl from '../angle-picker-control';
import CircularOptionPicker from '../circular-option-picker';
import {
	DEFAULT_LINEAR_GRADIENT_ANGLE,
	HORIZONTAL_GRADIENT_ORIENTATION,
} from './constants';
import CustomGradientBar from './custom-gradient-bar';
import { serializeGradient } from './serializer';
import {
	AccessoryWrapper,
	SelectWrapper,
} from './styles/custom-gradient-picker-styles';
import { useGradientParser } from './utils';
import { GradientPointsOpacityControl } from './gradient-points-opacity-control';
import classnames from 'classnames';

const GradientAnglePicker = ( { gradientAST, hasGradient, onChange } ) => {
	const angle = get(
		gradientAST,
		[ 'orientation', 'value' ],
		DEFAULT_LINEAR_GRADIENT_ANGLE
	);
	const onAngleChange = ( newAngle ) => {
		onChange(
			serializeGradient( {
				...gradientAST,
				orientation: {
					type: 'angular',
					value: newAngle,
				},
			} )
		);
	};
	return (
		<>
			<AnglePickerControl
				className="kubio-custom-angle-picker-container"
				hideLabelFromVision
				onChange={ onAngleChange }
				value={ hasGradient ? angle : '' }
			/>
		</>
	);
};

const GradientTypePicker = ( { gradientAST, onChange } ) => {
	const { type } = gradientAST;

	const onSetLinearGradient = () => {
		onChange(
			serializeGradient( {
				...gradientAST,
				...( gradientAST.orientation
					? {}
					: { orientation: HORIZONTAL_GRADIENT_ORIENTATION } ),
				type: 'linear-gradient',
			} )
		);
	};

	const onSetRadialGradient = () => {
		onChange(
			serializeGradient( {
				...omit( gradientAST, [ 'orientation' ] ),
				type: 'radial-gradient',
			} )
		);
	};

	const gradientTypes = [
		{
			key: 'linear-gradient',
			label: __( 'Linear gradient', 'kubio' ),
			gradient:
				'linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(122,116,116,1) 100%)',
		},
		{
			key: 'radial-gradient',
			label: __( 'Radial gradient', 'kubio' ),
			gradient:
				'radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(122,116,116,1) 100%)',
		},
	];

	const gradientTypeOptions = useMemo( () => {
		return map( gradientTypes, ( { key, gradient, label } ) => {
			let activeClass = '';

			if ( type === key ) {
				activeClass = 'gradient-type-active';
			}

			return (
				<CircularOptionPicker.Option
					className={ activeClass }
					key={ key }
					value={ gradient }
					// isSelected={value === gradient}
					tooltipText={
						label ||
						// translators: %s: gradient code e.g: "linear-gradient(90deg, rgba(98,16,153,1) 0%, rgba(172,110,22,1) 100%);".
						sprintf( __( 'Gradient code: %s', 'kubio' ), gradient )
					}
					style={ { color: 'rgba( 0,0,0,0 )', background: gradient } }
					onClick={
						key === 'linear-gradient'
							? () => onSetLinearGradient()
							: () => onSetRadialGradient()
					}
					aria-label={
						label
							? // translators: %s: The name of the gradient e.g: "Angular red to blue".
							  sprintf( __( 'Gradient: %s', 'kubio' ), label )
							: sprintf(
									// translators: %s: gradient code e.g: "linear-gradient(90deg, rgba(98,16,153,1) 0%, rgba(172,110,22,1) 100%);".
									__( 'Gradient code: %s', 'kubio' ),
									gradient
							  )
					}
				/>
			);
		} );
	}, [ gradientTypes ] );

	return (
		<>
			<div className="kubio-custom-gradient-type-container">
				<div className="kubio-custom-gradient-text">
					{ __( 'Type', 'kubio' ) }
				</div>
				<CircularOptionPicker options={ gradientTypeOptions } />
			</div>
		</>
	);
};

export default function CustomGradientPicker( {
	value,
	onChange: onValueChange,
	alpha = true,
	showExternalOpacityControl = false,
} ) {
	const { getGradientParsed } = useGradientParser();
	const { gradientAST, hasGradient } = getGradientParsed( value );
	const { type } = gradientAST;

	const onChange = ( nextValue ) => {
		onValueChange( nextValue );
	};

	return (
		<div
			className={ classnames(
				'components-custom-gradient-picker',
				'kubio-control'
			) }
		>
			<CustomGradientBar
				value={ value }
				onChange={ onChange }
				alpha={ alpha }
			/>
			<Flex
				gap={ 0 }
				className="components-custom-gradient-picker__ui-line"
			>
				<SelectWrapper>
					<GradientTypePicker
						gradientAST={ gradientAST }
						hasGradient={ hasGradient }
						onChange={ onChange }
					/>
				</SelectWrapper>

				<AccessoryWrapper>
					{ type === 'linear-gradient' && (
						<GradientAnglePicker
							gradientAST={ gradientAST }
							hasGradient={ hasGradient }
							onChange={ onChange }
						/>
					) }
				</AccessoryWrapper>
			</Flex>
			{ showExternalOpacityControl && (
				<GradientPointsOpacityControl
					gradientAST={ gradientAST }
					onChange={ onChange }
				/>
			) }
		</div>
	);
}
