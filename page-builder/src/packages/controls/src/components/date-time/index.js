/**
 * External dependencies
 */
// Needed to initialise the default datepicker styles.
// See: https://github.com/airbnb/react-dates#initialize
import { noop } from 'lodash';
import 'react-dates/initialize';

/**
 * WordPress dependencies
 */
import { forwardRef, useState } from '@wordpress/element';
import { __, _x } from '@wordpress/i18n';

import { SeparatorHorizontalLine } from '@kubio/controls';

/**
 * Internal dependencies
 */
import { Button } from '@wordpress/components';

import { DatePicker } from './date';
import { TimePicker } from './time';

export { DatePicker, TimePicker };

const DateTimePicker = forwardRef(
	(
		{
			offsetTimezone,
			onChangeUtc,
			currentDate,
			is12Hour,
			isInvalidDate,
			onMonthPreviewed = noop,
			onChange,
			events,
		},
		ref
	) => {
		const [ calendarHelpIsVisible, setCalendarHelpIsVisible ] =
			useState( false );

		function onClickDescriptionToggle() {
			setCalendarHelpIsVisible( ! calendarHelpIsVisible );
		}
		return (
			<div
				ref={ ref }
				className="components-datetime iconvert-promoter-datetime"
			>
				{ ! calendarHelpIsVisible && (
					<>
						<DatePicker
							offsetTimezone={ offsetTimezone }
							currentDate={ currentDate }
							onChange={ onChange }
							isInvalidDate={ isInvalidDate }
							events={ events }
							onMonthPreviewed={ onMonthPreviewed }
						/>
						<SeparatorHorizontalLine />
						<TimePicker
							offsetTimezone={ offsetTimezone }
							onChangeUtc={ onChangeUtc }
							currentTime={ currentDate }
							onChange={ onChange }
							is12Hour={ is12Hour }
						/>
					</>
				) }
				{ calendarHelpIsVisible && (
					<>
						<div className="components-datetime__calendar-help">
							<h4>
								{ __( 'Click to Select', 'iconvert-promoter' ) }
							</h4>
							<ul>
								<li>
									{ __(
										'Click the right or left arrows to select other months in the past or the future.',
										'iconvert-promoter'
									) }
								</li>
								<li>
									{ __(
										'Click the desired day to select it.',
										'iconvert-promoter'
									) }
								</li>
							</ul>
							<h4>
								{ __(
									'Navigating with a keyboard',
									'iconvert-promoter'
								) }
							</h4>
							<ul>
								<li>
									<abbr
										aria-label={ _x(
											'Enter',
											'keyboard button',
											'iconvert-promoter'
										) }
									>
										↵
									</abbr>
									{
										' ' /* JSX removes whitespace, but a space is required for screen readers. */
									}
									<span>
										{ __(
											'Select the date in focus.',
											'iconvert-promoter'
										) }
									</span>
								</li>
								<li>
									<abbr
										aria-label={ __(
											'Left and Right Arrows',
											'iconvert-promoter'
										) }
									>
										←/→
									</abbr>
									{
										' ' /* JSX removes whitespace, but a space is required for screen readers. */
									}
									{ __(
										'Move backward (left) or forward (right) by one day.',
										'iconvert-promoter'
									) }
								</li>
								<li>
									<abbr
										aria-label={ __(
											'Up and Down Arrows',
											'iconvert-promoter'
										) }
									>
										↑/↓
									</abbr>
									{
										' ' /* JSX removes whitespace, but a space is required for screen readers. */
									}
									{ __(
										'Move backward (up) or forward (down) by one week.',
										'iconvert-promoter'
									) }
								</li>
								<li>
									<abbr
										aria-label={ __(
											'Page Up and Page Down',
											'iconvert-promoter'
										) }
									>
										{ __(
											'PgUp/PgDn',
											'iconvert-promoter'
										) }
									</abbr>
									{
										' ' /* JSX removes whitespace, but a space is required for screen readers. */
									}
									{ __(
										'Move backward (PgUp) or forward (PgDn) by one month.',
										'iconvert-promoter'
									) }
								</li>
								<li>
									<abbr
										aria-label={ __(
											'Home and End',
											'iconvert-promoter'
										) }
									>
										{ /* Translators: Home/End reffer to the 'Home' and 'End' buttons on the keyboard.*/ }
										{ __(
											'Home/End',
											'iconvert-promoter'
										) }
									</abbr>
									{
										' ' /* JSX removes whitespace, but a space is required for screen readers. */
									}
									{ __(
										'Go to the first (Home) or last (End) day of a week.',
										'iconvert-promoter'
									) }
								</li>
							</ul>
						</div>
					</>
				) }
				<div className="components-datetime__buttons">
					{ 1 === 2 && ! calendarHelpIsVisible && currentDate && (
						<Button
							className="components-datetime__date-reset-button"
							variant="link"
							onClick={ () => onChange( null ) }
						>
							{ __( 'Reset', 'iconvert-promoter' ) }
						</Button>
					) }
					<Button
						className="components-datetime__date-help-toggle"
						variant="link"
						onClick={ onClickDescriptionToggle }
					>
						{ calendarHelpIsVisible
							? __( 'Close', 'iconvert-promoter' )
							: __( 'Calendar Help', 'iconvert-promoter' ) }
					</Button>
				</div>
			</div>
		);
	}
);
//export default DateTimePicker;
export { DateTimePicker };
//export default forwardRef( DateTimePicker );
