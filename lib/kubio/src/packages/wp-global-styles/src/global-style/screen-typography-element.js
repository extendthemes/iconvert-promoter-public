/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import TypographyPanel from './typography-panel';
import ScreenHeader from './header';

const elements = {
	text: {
		description: __('Manage the fonts used on the site.', 'kubio'),
		title: __('Text', 'kubio'),
	},
	link: {
		description: __(
			'Manage the fonts and typography used on the links.',
			'kubio'
		),
		title: __('Links', 'kubio'),
	},
};

function ScreenTypographyElement({ name, element }) {
	const parentMenu =
		name === undefined ? '/typography' : '/blocks/' + name + '/typography';

	return (
		<>
			<ScreenHeader
				back={parentMenu}
				title={elements[element].title}
				description={elements[element].description}
			/>
			<TypographyPanel name={name} element={element} />
		</>
	);
}

export default ScreenTypographyElement;
