/**
 * WordPress dependencies
 */
import { useDispatch, useSelect } from '@wordpress/data';
import { useEffect } from '@wordpress/element';
import { STORE_NAME } from '../../store/constants';
import _ from 'lodash';
import { mergeNoArrays } from '@kubio/utils';
/**
 * Internal dependencies
 */
import { useGlobalStylesOutput } from '@kubio/wp-global-styles';

function useGlobalStylesRenderer() {
	const [styles, settings] = useGlobalStylesOutput();
	const { getSettings } = useSelect(STORE_NAME);
	const { updateSettings } = useDispatch(STORE_NAME);

	useEffect(() => {
		if (_.isEmpty(styles) || _.isEmpty(settings)) {
			return;
		}

		const currentStoreSettings = getSettings();
		const nonGlobalStyles =
			currentStoreSettings?.styles?.filter(
				(style) =>
					!style.isGlobalStyles ||
					style.__unstableType === 'base-layout'
			) || [];

		const newSettings = mergeNoArrays({}, currentStoreSettings, {
			styles: [...nonGlobalStyles, ...styles],
			__experimentalFeatures: settings,
		});
		updateSettings(newSettings);
	}, [styles, settings]);
}

export function GlobalStylesRenderer() {
	useGlobalStylesRenderer();

	return null;
}
