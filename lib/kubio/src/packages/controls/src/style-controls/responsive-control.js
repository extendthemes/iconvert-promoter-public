import { useKubioBlockContext } from '@kubio/core';
import { ToggleControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

const ResponsiveControl = () => {
	const { dataHelper } = useKubioBlockContext();

	const hiddenOn = dataHelper.getPropByMedia(`isHidden`, false, {
		fromRoot: true,
		styledComponent: '',
	});

	const setIsHiddenOn = (device) => (nextValue) => {
		dataHelper.setPropInMedia(`isHidden`, nextValue, {
			media: device,
			styledComponent: '',
		});

		// One always ON - last active
		const hiddenOnInside = dataHelper.getPropByMedia(`isHidden`, false, {
			fromRoot: true,
			styledComponent: '',
		});
		const allHidden = Object.values(hiddenOnInside).every(
			(v) => v === true
		);
		if (allHidden) {
			dataHelper.setPropInMedia(`isHidden`, false, {
				media: device,
				styledComponent: '',
			});
		}
	};

	return (
		<div className={'media-toggles-container'}>
			<ToggleControl
				className={'kubio-toggle-control'}
				label={__('Hide on desktop', 'kubio')}
				checked={hiddenOn?.desktop}
				onChange={setIsHiddenOn('desktop')}
				// disabled={isDisabledOn('desktop')}
			/>
			<ToggleControl
				className={'kubio-toggle-control'}
				label={__('Hide on tablet', 'kubio')}
				checked={hiddenOn?.tablet}
				onChange={setIsHiddenOn('tablet')}
				// disabled={isDisabledOn('tablet')}
			/>
			<ToggleControl
				className={'kubio-toggle-control'}
				label={__('Hide on mobile', 'kubio')}
				checked={hiddenOn?.mobile}
				onChange={setIsHiddenOn('mobile')}
				// disabled={isDisabledOn('mobile')}
			/>
		</div>
	);
};
export { ResponsiveControl };
