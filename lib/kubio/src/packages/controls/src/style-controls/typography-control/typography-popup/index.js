import { __ } from '@wordpress/i18n';
import TypographyControl from '../index';
import PopoverOptionsButton from '../../../components/popover-options-button';
import _ from 'lodash';

const TypographyControlPopup = (props) => {
	const { label = __('Typography', 'kubio'), onReset = _.noop } = props;

	function onLocalReset(localPath, localOptions) {
		const localOptionsColor = { ignoredPathOnUnset: 'color' };
		localOptions = _.merge(localOptions, localOptionsColor);

		onReset(localPath, localOptions);
	}

	return (
		<>
			<PopoverOptionsButton
				label={label}
				popoverWidth={250}
				showReset
				onReset={onLocalReset}
				popupContent={<TypographyControl hideReset {...props} />}
			/>
		</>
	);
};
export { TypographyControlPopup };
export default TypographyControlPopup;
