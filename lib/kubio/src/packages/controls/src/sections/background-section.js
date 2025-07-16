import { __ } from '@wordpress/i18n';
import { PanelBody } from '@wordpress/components';
import { WithDataPathTypes } from '@kubio/core';
import { BackgroundControlWithPath } from '../style-controls/wrappers/background-control-with-wrapper';
import _ from 'lodash';
import { KubioPanelBody } from '../components';

const BackgroundSection = ( {
	styledElement,
	style,
	showPanelWrapper = true,
	dataHelper,
} ) => {
	const filters = _.get( styledElement, [
		'supports',
		'filters',
		'background',
	] );
	const commonOptions = {};
	if ( style ) {
		commonOptions.style = style;
	}

	const control = (
		<BackgroundControlWithPath
			type={ WithDataPathTypes.STYLE }
			path={ 'background' }
			dataHelper={ dataHelper }
			filters={ filters }
			{ ...commonOptions }
		/>
	);

	return (
		<>
			{ showPanelWrapper === true ? (
				<KubioPanelBody
					className={ 'kubio-section-background-panel' }
					title={ __( 'Background', 'kubio' ) }
				>
					{ control }
				</KubioPanelBody>
			) : (
				control
			) }
		</>
	);
};

export { BackgroundSection };
