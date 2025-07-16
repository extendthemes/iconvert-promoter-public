import { Notice } from '@wordpress/components';
import { useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import { GutentagSelectControl, LoadingPlaceholder } from '@kubio/controls';
import { withColibriDataAutoSave } from '@kubio/core';
import apiFetch from '@wordpress/api-fetch';
import _, { toString } from 'lodash';

const SelectPopupControl = ( props ) => {
	const { computed } = props;

	const { onSuccessPopup, popupID } = computed;

	const { myCampaigns, campaignDetails } = useOnGetRemoteData( {
		onSuccessPopup,
		popupID,
	} );

	return (
		<>
			{ !! myCampaigns.length && (
				<GutentagSelectControl
					label={ __( 'Select popup', 'iconvert-promoter' ) }
					options={ myCampaigns }
					value={ computed.onSuccessPopup }
					onChange={ ( newValue ) => {
						computed.setOnSuccessPopupAttribute(
							toString( newValue )
						);
					} }
				/>
			) }

			{ ! myCampaigns.length && (
				<LoadingPlaceholder
					message={ __( 'Loading popups list', 'iconvert-promoter' ) }
				/>
			) }

			{ campaignDetails && (
				<>
					{ parseInt( campaignDetails.manual ) !== 1 && (
						<Notice status="error" isDismissible={ false }>
							{ __(
								'This campaign is not set to manual',
								'iconvert-promoter'
							) }
						</Notice>
					) }

					{ parseInt( campaignDetails.active ) !== 1 && (
						<Notice status="error" isDismissible={ false }>
							{ __(
								"This campaign it's not active",
								'iconvert-promoter'
							) }
						</Notice>
					) }
				</>
			) }
		</>
	);
};

let myCampaignsRemoteResult = null;
const campaignDetailsRemoteResultBySuccessProp = {};
const useOnGetRemoteData = ( { onSuccessPopup, popupID } ) => {
	const [ myCampaigns, setMyCampaigns ] = useState( [] );
	const [ campaignDetails, setCampaignDetails ] = useState( false );
	useEffect( () => {
		const fetch = async () => {
			try {
				const result = await apiFetch( { path: 'promo/v1/campaigns' } );
				const optionsData = [
					{
						label: __( 'Select a popup', 'iconvert-promoter' ),
						value: 0,
					},
				];

				result.forEach( ( item ) => {
					if ( toString( popupID ) !== toString( item.id ) ) {
						optionsData.push( {
							label: _.unescape( item.title ),
							value: toString( item.id ),
						} );
					}
				} );
				myCampaignsRemoteResult = optionsData;
				setMyCampaigns( optionsData );
			} catch ( e ) {
				console.error( e );
			}
		};
		if ( myCampaignsRemoteResult === null ) {
			fetch();
		} else {
			setMyCampaigns( myCampaignsRemoteResult );
		}
	}, [] );

	useEffect( () => {
		if ( ! parseInt( onSuccessPopup ) ) {
			return;
		}

		const fetch = async () => {
			try {
				const result = await apiFetch( {
					path: `promo/v1/campaign/status/${ onSuccessPopup }`,
				} );

				campaignDetailsRemoteResultBySuccessProp[ onSuccessPopup ] =
					result;
				setCampaignDetails( result );
			} catch ( e ) {
				console.error( e );
			}
		};

		if ( ! campaignDetailsRemoteResultBySuccessProp[ onSuccessPopup ] ) {
			fetch();
		} else {
			setCampaignDetails(
				campaignDetailsRemoteResultBySuccessProp[ onSuccessPopup ]
			);
		}
	}, [ onSuccessPopup ] );

	return {
		myCampaigns,
		campaignDetails,
	};
};
const useComputed = ( dataHelper ) => {
	const setOnSuccessPopupAttribute = ( newValue ) => {
		dataHelper.setAttribute( 'onSuccessPopup', newValue );
	};

	return {
		onSuccessPopup: toString( dataHelper.getAttribute( 'onSuccessPopup' ) ),
		popupID: dataHelper.getAttribute( 'popup_id' ),
		setOnSuccessPopupAttribute,
	};
};

const PanelWithData =
	withColibriDataAutoSave( useComputed )( SelectPopupControl );
export default PanelWithData;
