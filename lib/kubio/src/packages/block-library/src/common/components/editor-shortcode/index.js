import { ServerSideRender, shortcodeToString } from '@kubio/core';
import { AsyncModeProvider } from '@wordpress/data';
import _ from 'lodash';
import NamesOfBlocks from '../../../blocks-list';
const parseShortcode = (shortcode) => {
	let parsedShorcode = '';
	if (_.isString(shortcode)) {
		parsedShorcode = shortcode;
	} else {
		parsedShorcode = shortcodeToString(shortcode);
		// if (this.decorate) {
		// 	parsedShorcode = decorateShortcode(shortcode);
		// }
	}
	return parsedShorcode;
};

const EditorShortcode = ({
	shortcode,
	onChange,
	async = false,
	...otherProps
}) => {
	const parsedShortcode = parseShortcode(shortcode);
	return (
		<AsyncModeProvider value={async}>
			<ServerSideRender
				onChange={onChange}
				block={NamesOfBlocks.SHORTCODE}
				attributes={{ shortcode: parsedShortcode, inEditor: true }}
				{...otherProps}
			/>
		</AsyncModeProvider>
	);
};

export { EditorShortcode };
