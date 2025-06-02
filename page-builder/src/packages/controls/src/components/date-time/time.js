/**
 * External dependencies
 */
import classnames from 'classnames';
import { isInteger } from 'lodash';
import moment from 'moment';

/**
 * WordPress dependencies
 */
import { useEffect, useMemo, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */

import TimeZone from './timezone';

/**
 * Module Constants
 */
const TIMEZONELESS_FORMAT = 'YYYY-MM-DDTHH:mm:ss';

function from12hTo24h( hours, isPm ) {
	return isPm ? ( ( hours % 12 ) + 12 ) % 24 : hours % 12;
}

/**
 * <UpdateOnBlurAsIntegerField>
 * A shared component to parse, validate, and handle remounting of the underlying form field element like <input> and <select>.
 *
 * @param {Object}        props             Component props.
 * @param {string}        props.as          Render the component as specific element tag, defaults to "input".
 * @param {number|string} props.value       The default value of the component which will be parsed to integer.
 * @param {Function}      props.onUpdate    Call back when blurred and validated.
 * @param {string}        [props.className]
 */
function UpdateOnBlurAsIntegerField( {
	as,
	value,
	onUpdate,
	className,
	...props
} ) {
	function handleBlur( event ) {
		const { target } = event;

		if ( value === target.value ) {
			return;
		}

		const parsedValue = parseInt( target.value, 10 );

		// Run basic number validation on the input.
		if (
			! isInteger( parsedValue ) ||
			( typeof props.max !== 'undefined' && parsedValue > props.max ) ||
			( typeof props.min !== 'undefined' && parsedValue < props.min )
		) {
			// If validation failed, reset the value to the previous valid value.
			target.value = value;
		} else {
			// Otherwise, it's valid, call onUpdate.
			onUpdate( target.name, parsedValue );
		}
	}

	const Component = as || 'input';

	return (
		<Component
			key={ value }
			defaultValue={ value }
			onChange={ handleBlur }
			className={ classnames(
				'components-datetime__time-field-integer-field',
				className
			) }
			{ ...props }
		/>
	);
}

/**
 * <TimePicker>
 *
 * @typedef {Date|string|number} WPValidDateTimeFormat
 *
 * @param {Object}                props                Component props.
 * @param {boolean}               props.is12Hour       Should the time picker showed in 12 hour format or 24 hour format.
 * @param                         props.offsetTimezone
 * @param                         props.onChangeUtc
 * @param {WPValidDateTimeFormat} props.currentTime    The initial current time the time picker should render.
 * @param {Function}              props.onChange       Callback function when the date changed.
 */
const TimePicker = ( {
	offsetTimezone,
	onChangeUtc,
	is12Hour,
	currentTime,
	onChange,
} ) => {
	const [ date, setDate ] = useState( () =>
		// Truncate the date at the minutes, see: #15495.
		moment( currentTime ).startOf( 'minutes' )
	);
	// Reset the state when currentTime changed.
	useEffect( () => {
		setDate(
			currentTime
				? moment( currentTime ).startOf( 'minutes' )
				: moment().startOf( 'minutes' )
		);
	}, [ currentTime ] );

	const { day, month, year, minutes, hours, am } = useMemo(
		() => ( {
			day: date.format( 'DD' ),
			month: date.format( 'MM' ),
			year: date.format( 'YYYY' ),
			minutes: date.format( 'mm' ),
			hours: date.format( is12Hour ? 'hh' : 'HH' ),
			am: date.format( 'H' ) <= 11 ? 'AM' : 'PM',
		} ),
		[ date, is12Hour ]
	);

	/**
	 * Function that sets the date state and calls the onChange with a new date.
	 * The date is truncated at the minutes.
	 *
	 * @param {Object} newDate The date object.
	 */
	function changeDate( newDate ) {
		setDate( moment( newDate ).startOf( 'minutes' ) );
		onChange( newDate.format( TIMEZONELESS_FORMAT ) );
	}

	function update( name, value ) {
		const adjustedValue = value;
		// Clone the date and call the specific setter function according to `name`.
		const newDate = date.clone()[ name ]( adjustedValue );
		changeDate( newDate );
	}

	const dayFormat = (
		<div className="components-datetime__time-field components-datetime__time-field-day">
			<UpdateOnBlurAsIntegerField
				aria-label={ __( 'Day', 'iconvert-promoter' ) }
				className="components-datetime__time-field-day-input"
				type="number"
				// The correct function to call in moment.js is "date" not "day".
				name="date"
				value={ day }
				step={ 1 }
				min={ 1 }
				max={ 31 }
				onUpdate={ update }
			/>
		</div>
	);

	const monthFormat = (
		<div className="components-datetime__time-field components-datetime__time-field-month">
			<UpdateOnBlurAsIntegerField
				as="select"
				aria-label={ __( 'Month', 'iconvert-promoter' ) }
				className="components-datetime__time-field-month-select"
				name="month"
				value={ month }
				// The value starts from 0, so we have to -1 when setting month.
				onUpdate={ ( key, value ) => update( key, value - 1 ) }
			>
				<option value="01">
					{ __( 'January', 'iconvert-promoter' ) }
				</option>
				<option value="02">
					{ __( 'February', 'iconvert-promoter' ) }
				</option>
				<option value="03">
					{ __( 'March', 'iconvert-promoter' ) }
				</option>
				<option value="04">
					{ __( 'April', 'iconvert-promoter' ) }
				</option>
				<option value="05">{ __( 'May', 'iconvert-promoter' ) }</option>
				<option value="06">
					{ __( 'June', 'iconvert-promoter' ) }
				</option>
				<option value="07">
					{ __( 'July', 'iconvert-promoter' ) }
				</option>
				<option value="08">
					{ __( 'August', 'iconvert-promoter' ) }
				</option>
				<option value="09">
					{ __( 'September', 'iconvert-promoter' ) }
				</option>
				<option value="10">
					{ __( 'October', 'iconvert-promoter' ) }
				</option>
				<option value="11">
					{ __( 'November', 'iconvert-promoter' ) }
				</option>
				<option value="12">
					{ __( 'December', 'iconvert-promoter' ) }
				</option>
			</UpdateOnBlurAsIntegerField>
		</div>
	);

	const dayMonthFormat = is12Hour ? (
		<>
			{ monthFormat }
			{ dayFormat }
		</>
	) : (
		<>
			{ dayFormat }
			{ monthFormat }
		</>
	);

	const leadingZero = ( num ) => ( num < 10 ? `0${ num }` : num );

	const hi = is12Hour ? 12 : 24;
	const hoursInterval = [ ...Array( hi ).keys() ];
	const minutesInterval = [ ...Array( 60 ).keys() ];

	return (
		<div
			className={ classnames(
				'components-datetime__time iconvert-promoter-components-datetime__time '
			) }
		>
			<fieldset>
				<legend className="components-datetime__time-legend">
					{ __( 'Time', 'iconvert-promoter' ) }
				</legend>

				<div className="components-datetime__time-wrapper">
					<div className="components-datetime__time-field components-datetime__time-field-time">
						<UpdateOnBlurAsIntegerField
							aria-label={ __( 'Hours', 'iconvert-promoter' ) }
							className="components-datetime__time-field-hours-input"
							type="number"
							name="hours"
							step={ 1 }
							min={ is12Hour ? 1 : 0 }
							max={ is12Hour ? 12 : 23 }
							value={ hours }
							onUpdate={ update }
							as="select"
						>
							{ hoursInterval.map( ( hourIndex ) => (
								<option
									key={ hourIndex }
									value={ leadingZero( hourIndex ) }
								>
									{ leadingZero( hourIndex ) }
								</option>
							) ) }
						</UpdateOnBlurAsIntegerField>
						<span
							className="components-datetime__time-separator"
							aria-hidden="true"
						>
							:
						</span>
						<UpdateOnBlurAsIntegerField
							aria-label={ __( 'Minutes', 'iconvert-promoter' ) }
							className="components-datetime__time-field-minutes-input"
							type="number"
							name="minutes"
							step={ 1 }
							min={ 0 }
							max={ 59 }
							value={ minutes }
							onUpdate={ update }
							as="select"
						>
							{ minutesInterval.map( ( minuteInt ) => (
								<option
									key={ minuteInt }
									value={ leadingZero( minuteInt ) }
								>
									{ leadingZero( minuteInt ) }
								</option>
							) ) }
						</UpdateOnBlurAsIntegerField>
					</div>
				</div>
			</fieldset>

			<fieldset>
				<legend className="components-datetime__time-legend">
					{ __( 'Timezone', 'iconvert-promoter' ) }
				</legend>

				<div className="components-datetime__timezone-wrapper">
					<TimeZone
						offsetTimezone={ offsetTimezone }
						onchange={ onChangeUtc }
					/>
				</div>
			</fieldset>
		</div>
	);
};

export { TimePicker };
