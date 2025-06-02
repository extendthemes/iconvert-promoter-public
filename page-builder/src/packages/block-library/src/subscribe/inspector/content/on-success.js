import {
	KubioPanelBody,
	SelectControlWithPath,
	SeparatorHorizontalLine,
} from '@kubio/controls';
import { withColibriDataAutoSave } from '@kubio/core';
import { BaseControl, Button } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { onSuccessOptions, onSuccessStates } from '../../config';
import { useContentViewState } from '../../toolbar';
import SelectPopupControl from './select-popup-control';
import URLRedirectControl from './url-redirect-control';

const OnSuccessActions = ( props ) => {
	const { computed, dataHelper } = props;

	const [ , setOnSuccessAction ] = useState( computed.onSuccessAction );

	const [ , setViewState ] = useContentViewState( dataHelper );

	return (
		<>
			<KubioPanelBody
				title={ __( 'On success actions', 'iconvert-promoter' ) }
				initialOpen={ true }
			>
				<SelectControlWithPath
					label={ __( 'Action', 'iconvert-promoter' ) }
					value={ computed.onSuccessAction }
					options={ onSuccessOptions }
					onChange={ ( newValue ) => {
						computed.setOnSuccessActionAttribute( newValue );
						setOnSuccessAction( newValue );
					} }
				/>

				{ computed.onSuccessAction === onSuccessStates.REDIRECT && (
					<>
						<SeparatorHorizontalLine />
						<URLRedirectControl />
					</>
				) }

				{ computed.onSuccessAction === onSuccessStates.OPEN_POPUP && (
					<>
						<SeparatorHorizontalLine />
						<SelectPopupControl />
					</>
				) }

				{ computed.onSuccessAction ===
					onSuccessStates.CUSTOM_CONTENT && (
					<BaseControl>
						<Button
							isPrimary
							onClick={ () => setViewState( 'success-content' ) }
							className="kubio-button-100"
						>
							{ __(
								'Edit success content',
								'iconvert-promoter'
							) }
						</Button>
					</BaseControl>
				) }
			</KubioPanelBody>
		</>
	);
};

const useComputed = ( dataHelper ) => {
	const setOnSuccessActionAttribute = ( newValue ) => {
		dataHelper.setAttribute( 'onSuccessAction', newValue );
	};

	return {
		onSuccessAction: dataHelper.getAttribute( 'onSuccessAction' ),
		setOnSuccessActionAttribute,
	};
};

const PanelWithData =
	withColibriDataAutoSave( useComputed )( OnSuccessActions );
export default PanelWithData;
