import { __ } from '@wordpress/i18n';
import { BaseControl } from '@wordpress/components';
import {
	URLInputWithPath,
	PopoverOptionsButton,
	SelectControlWithPath,
} from '@kubio/controls';
import { withColibriDataAutoSave, WithDataPathTypes } from '@kubio/core';
import { ElementsEnum } from '../../elements';
import { linkOpenOptions } from '../../config';

const URLRedirectControl = ( props ) => {
	const { computed } = props;

	return (
		<>
			<BaseControl
				className={ 'kubio-link-control-container kubio-control' }
			>
				<URLInputWithPath
					label={ 'URL' }
					type={ WithDataPathTypes.ATTRIBUTE }
					path="link.value"
				/>

				<PopoverOptionsButton
					popupContent={
						<>
							<SelectControlWithPath
								label={ __(
									'Open link in',
									'iconvert-promoter'
								) }
								type={ WithDataPathTypes.ATTRIBUTE }
								path="link.typeOpenLink"
								options={ linkOpenOptions }
							/>
						</>
					}
					minWidth={ 260 }
				/>
			</BaseControl>
		</>
	);
};

const useComputed = ( dataHelper ) => {
	return {};
};

const PanelWithData =
	withColibriDataAutoSave( useComputed )( URLRedirectControl );
export default PanelWithData;
