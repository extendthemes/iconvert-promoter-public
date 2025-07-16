import { Slot } from '@wordpress/components';

import { customFormats } from '../custom-formats';

const customFormatsNames = customFormats
	.map( ( customFormat ) => customFormat.slotId )
	.filter( Boolean );

const FormatToolbar = () => {
	return (
		<>
			{ customFormatsNames.map( ( format ) => (
				<Slot
					name={ `RichText.ToolbarControls.${ format }` }
					key={ format }
				/>
			) ) }
		</>
	);
};

export { FormatToolbar };
