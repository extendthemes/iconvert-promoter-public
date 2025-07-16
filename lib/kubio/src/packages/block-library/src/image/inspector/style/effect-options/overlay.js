import { OverlayControl } from '@kubio/controls';
import { withComputedData } from '@kubio/core';
import { Styles } from '@kubio/style-manager';
import _ from 'lodash';
import { ElementsEnum } from '../../../elements';

const backgroundConfig = Styles.background;

const dataHelperOptions = {
	media: 'desktop',
	styledComponent: ElementsEnum.OVERLAY,
	mergeData: false,
};

const Component = ({ computed, ...rest }) => {
	const { background, updateBackground, onReset } = computed;

	return (
		<OverlayControl
			localValue={background}
			updateState={_.noop}
			updateValue={updateBackground}
			onReset={onReset}
			{...rest}
		/>
	);
};

const computed = (dataHelper) => {
	const background = dataHelper.getStyle('background', {}, dataHelperOptions);
	const backgroundWithDefault = _.merge(
		{},
		backgroundConfig.default,
		background
	);
	return {
		background: backgroundWithDefault,
		updateBackground: (path, value) => {
			const currentBackground = dataHelper.getStyle(
				'background',
				{},
				dataHelperOptions
			);
			const changes = _.set({}, path, value);
			const mergedBackground = _.merge({}, currentBackground, changes);
			dataHelper.setStyle(
				'background',
				mergedBackground,
				dataHelperOptions
			);
		},
		onReset: (path) => {
			const currentBackground = dataHelper.getStyle(
				'background',
				{},
				dataHelperOptions
			);
			_.unset(currentBackground, path);
			dataHelper.setStyle(
				'background',
				currentBackground,
				dataHelperOptions
			);
		},
	};
};

const overlayWithData = withComputedData(computed)(Component);
export default overlayWithData;
