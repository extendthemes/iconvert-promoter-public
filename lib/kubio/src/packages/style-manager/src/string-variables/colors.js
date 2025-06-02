import { registerVariables } from './registry';
import { pipes as colorPipes } from '../utils/color';
import { get } from 'lodash';

//todo
const storeColors = {};

registerVariables( 'theme.colors', colorPipes, () => {
	const variables = {};
	variables.theme = {
		colors: storeColors,
	};
	return variables;
} );

function getThemeColorId( color ) {
	const presetIdRegex = /theme\.colors\.(\d+)/g;
	const presetIdMatch = presetIdRegex.exec( color );
	const presetId = get( presetIdMatch, '[1]' );
	if ( ! isNaN( presetId ) ) {
		return presetId;
	}

	return null;
}

function getThemeColor( colorId, filter ) {
	let formattedText = '';
	if ( filter ) {
		formattedText = '${theme.colors.' + colorId + '|' + filter + '}';
	} else {
		formattedText = '${theme.colors.' + colorId + '}';
	}
	return formattedText;
}

export { getThemeColorId, getThemeColor };
