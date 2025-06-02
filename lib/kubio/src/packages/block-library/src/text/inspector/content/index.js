import { __ } from '@wordpress/i18n';

import { TextProperties } from './text-properties';
import { ContentInspectorControls } from '@kubio/inspectors';

/**
 * Used in the right sidebar context to generate the content tab.
 *
 * @param {boolean}     showLead              Passed the the TextProperties component.
 * @param {boolean}     showDropCap           Passed the the TextProperties component.
 * @param {JSX.Element} afterTextProperties   Used to add extra panels after the Text panel.
 * @param {JSX.Element} atEndOfTextProperties Used for adding extra components inside de Text panel, at the end.
 * @param {JSX.Element} title                 Setting accordion title text.
 * @return {JSX.Element} element
 */
const Content = ({
	showLead = true,
	showDropCap = false,
	afterTextProperties,
	atEndOfTextProperties,
	title = __('Paragraph properties', 'kubio'),
}) => {
	return (
		<ContentInspectorControls>
			<TextProperties
				showLead={showLead}
				showDropCap={showDropCap}
				atEndOfTextProperties={atEndOfTextProperties}
				title={title}
			/>
			{afterTextProperties}
		</ContentInspectorControls>
	);
};

export { Content };
