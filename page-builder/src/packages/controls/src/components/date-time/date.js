import { DateTimePicker } from '@wordpress/components';

/**
 * WordPress dependencies
 */
import { useState } from '@wordpress/element';

const DatePicker = ( { currentDate, onChange } ) => {
	return (
		<div className="components-datetime__date">
			<DateTimePicker
				currentDate={ currentDate }
				onChange={ onChange }
				is12Hour={ false }
				__nextRemoveHelpButton
				__nextRemoveResetButton
			/>
		</div>
	);
};

export { DatePicker };
