import {
	forwardRef,
	useCallback,
	useEffect,
	useRef,
	useState,
} from '@wordpress/element';
import { useDebounce } from '@wordpress/compose';
import { __ } from '@wordpress/i18n';
import { ENTER } from '@wordpress/keycodes';
import classnames from 'classnames';
import { noop, omit } from 'lodash';
/**
 * Internal dependencies
 */
import {
	composeStateReducers,
	inputControlActionTypes,
} from '../input-control/state';
import { Root, ValueInput } from './styles/unit-control-styles';
import UnitSelectControl from './unit-select-control';
import { CSS_UNITS, getValidParsedUnit } from './utils';

function UnitControl_(
	{
		__unstableStateReducer: stateReducer = ( state ) => state,
		autoComplete = 'off',
		className,
		disabled = false,
		disableUnits = false,
		isPressEnterToChange = false,
		isUnitSelectTabbable = true,
		label,
		onChange = noop,
		size = 'default',
		style,
		units = CSS_UNITS,
		value: valueProp,
		capMin = false,
		min,
		onBlur = noop,
		...props
	},
	ref
) {
	min = parseInt( min );
	const storeValue = _.get( valueProp, 'value' );
	const storeUnit = _.get( valueProp, 'unit' );
	const [ value, setValue ] = useState( storeValue );
	const [ unit, setUnit ] = useState( storeUnit );

	useEffect( () => {
		if ( storeValue !== value ) {
			setValue( storeValue );
		}
	}, [ storeValue ] );

	useEffect( () => {
		if ( storeUnit !== unit ) {
			setUnit( storeUnit );
		}
	}, [ storeUnit ] );

	// Stores parsed value for hand-off in state reducer
	const refParsedValue = useRef( null );

	const classes = classnames( 'components-unit-control', className );

	const handleOnChange = useDebounce(
		useCallback(
			( nextValue, changeProps ) => {
				if ( nextValue !== '' ) {
					nextValue = parseFloat( nextValue );
				}

				if ( nextValue !== '' && capMin && nextValue < min ) {
					nextValue = min;
				}
				const valueWithUnit = {
					value: nextValue,
					unit,
				};

				if ( nextValue !== value ) {
					setValue( nextValue );
					onChange( valueWithUnit, changeProps );
				}
			},
			[ value, setValue, onChange ]
		),
		100
	);

	const handleOnUnitChange = ( newUnit, changeProps ) => {
		if ( newUnit !== unit ) {
			const valueWithUnit = {
				value: '',
				unit: newUnit,
			};
			setValue( '' );
			setUnit( newUnit );
			onChange( valueWithUnit, changeProps );
		}
	};

	const mayUpdateUnit = ( event ) => {
		if ( ! isNaN( event.target.value ) ) {
			refParsedValue.current = null;
			return;
		}
		const [ parsedValue, parsedUnit ] = getValidParsedUnit(
			event.target.value,
			units,
			value,
			unit
		);

		refParsedValue.current = parsedValue;

		if ( isPressEnterToChange && parsedUnit !== unit ) {
			const data = units.find(
				( option ) => option.value === parsedUnit
			);
			const changeProps = { event, data };

			setUnit( parsedUnit );
			const valueWithUnit = {
				value: '',
				unit: parsedUnit,
			};
			onChange( valueWithUnit, changeProps );
		}
	};

	const handleOnBlur = ( event ) => {
		mayUpdateUnit( event );
		onBlur( event );
	};

	const handleOnKeyDown = ( event ) => {
		const { keyCode } = event;
		if ( keyCode === ENTER ) {
			mayUpdateUnit( event );
		}
	};
	/**
	 * "Middleware" function that intercepts updates from InputControl.
	 * This allows us to tap into actions to transform the (next) state for
	 * InputControl.
	 *
	 * @param {Object} state  State from InputControl
	 * @param {Object} action Action triggering state change
	 * @return {Object} The updated state to apply to InputControl
	 */
	const unitControlStateReducer = ( state, action ) => {
		/*
		 * On commits (when pressing ENTER and on blur if
		 * isPressEnterToChange is true), if a parse has been performed
		 * then use that result to update the state.
		 */
		if ( action.type === inputControlActionTypes.COMMIT ) {
			if ( refParsedValue.current !== null ) {
				state.value = refParsedValue.current;
				refParsedValue.current = null;
			}
		}

		return state;
	};

	const inputSuffix = ! disableUnits ? (
		<UnitSelectControl
			aria-label={ __( 'Select unit', 'kubio' ) }
			disabled={ disabled }
			isTabbable={ isUnitSelectTabbable }
			options={ units }
			onChange={ handleOnUnitChange }
			size={ size }
			value={ unit }
		/>
	) : null;

	let step = props.step;

	/*
	 * If no step prop has been passed, lookup the active unit and
	 * try to get step from `units`, or default to a value of `1`
	 */
	if ( ! step && units ) {
		const activeUnit = units.find( ( option ) => option.value === unit );
		step = activeUnit?.step ?? 1;
	}

	return (
		<Root
			className={ classnames(
				'components-unit-control-wrapper',
				'kubio-components-unit-control-wrapper',
				'kubio-control'
			) }
			style={ style }
		>
			<ValueInput
				aria-label={ label }
				type={ 'number' }
				{ ...omit( props, [ 'children' ] ) }
				autoComplete={ autoComplete }
				className={ classes }
				disabled={ disabled }
				disableUnits={ disableUnits }
				isPressEnterToChange={ isPressEnterToChange }
				label={ label }
				onBlur={ handleOnBlur }
				onKeyDown={ handleOnKeyDown }
				onChange={ handleOnChange }
				ref={ ref }
				size={ size }
				suffix={ inputSuffix }
				value={ value }
				min={ min }
				__unstableStateReducer={ composeStateReducers(
					unitControlStateReducer,
					stateReducer
				) }
			/>
		</Root>
	);
}

const UnitControl = forwardRef( UnitControl_ );

export { UnitControl };
