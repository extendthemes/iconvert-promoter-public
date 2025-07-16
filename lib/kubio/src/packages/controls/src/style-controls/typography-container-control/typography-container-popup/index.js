import { __ } from '@wordpress/i18n';
import TypographyContainerControl from '../index';
import PopoverOptionsButton from '../../../components/popover-options-button';

const TypographyControlPopup = (props) => {
	return (
		<>
			<PopoverOptionsButton
				label={__('Typography', 'kubio')}
				minWidth={260}
				popupContent={<TypographyContainerControl {...props} />}
			/>
		</>
	);
};
export { TypographyControlPopup };
export default TypographyControlPopup;
