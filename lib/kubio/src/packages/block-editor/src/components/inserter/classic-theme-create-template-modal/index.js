import { Modal } from '@wordpress/components';
import { __, sprintf } from '@wordpress/i18n';
import _ from 'lodash';
import { useEffect, useState } from '@wordpress/element';
import { useTemplate } from './use-template';
import { ModalContent } from './modal-content';
import { APPLY_TEMPLATE_ON_VALUES, STEPS_VALUES } from './config';
import { useSelect } from '@wordpress/data';

const areas = [ 'header', 'footer', 'sidebar' ];

function ClassicThemeCreateTemplateModal( {
	onClose = _.noop,
	onSuccess = _.noop,
	area: _area,
	innerBlocks,

	//for fse themes like 2022 that don't have front page template we should create one
	isFSEFrontPageButDoesNotHaveFrontPageTemplate = false,
} ) {
	const [ applyTemplateOn, setApplyTemplateOn ] = useState(
		APPLY_TEMPLATE_ON_VALUES.THIS_PAGE
	);

	//when using FSE themes the area is actually the clientId because this component it's mostly used for classic themes
	//But we also use this for fse templates to create the front page template. So we reuse this code
	const area = useSelect( ( select ) => {
		if ( areas.includes( _area ) ) {
			return _area;
		}
		const { getBlock } = select( 'core/block-editor' );
		const { getEntityRecord, getCurrentTheme } = select( 'core' );
		const theme = getCurrentTheme()?.stylesheet;
		const block = getBlock( _area );
		const slug = block?.attributes?.slug;
		const templatePartId = `${ theme }//${ slug }`;
		const templatePart = getEntityRecord(
			'postType',
			'wp_template_part',
			templatePartId
		);

		return templatePart?.area;
	} );

	const { onNewTemplate, pageTitle, isFrontPage } = useTemplate( {
		type: area,
		innerBlocks,
		isFSEFrontPageButDoesNotHaveFrontPageTemplate,
		applyTemplateOn,
		setApplyTemplateOn,
	} );
	const initialStep = ! isFrontPage
		? STEPS_VALUES.STEP_1
		: STEPS_VALUES.STEP_2;
	const [ currentStep, setStep ] = useState( initialStep );

	const onCloseModal = () => {
		onClose();
	};
	const onInsert = async ( templateName ) => {
		onClose();
		const result = await onNewTemplate( templateName );
		if ( result ) {
			onSuccess();
		}
	};

	useEffect( () => {
		if ( isFSEFrontPageButDoesNotHaveFrontPageTemplate ) {
			onInsert();
		}
	}, [ isFSEFrontPageButDoesNotHaveFrontPageTemplate ] );

	if ( isFSEFrontPageButDoesNotHaveFrontPageTemplate ) {
		return null;
	}
	const areaLabel = area;
	const otherAreaLabel =
		area === __( 'header', 'kubio' )
			? __( 'footer', 'kubio' )
			: __( 'header', 'kubio' );
	const modalTitle = getModalTitle( currentStep );
	return (
		<Modal title={ modalTitle } onRequestClose={ onCloseModal }>
			<div className="kubio-inserter-ignore-click-outisde kubio-classic-theme-create-template-modal">
				<ModalContent
					areaLabel={ areaLabel }
					otherAreaLabel={ otherAreaLabel }
					onCloseModal={ onCloseModal }
					onInsert={ onInsert }
					pageTitle={ pageTitle }
					applyTemplateOn={ applyTemplateOn }
					setApplyTemplateOn={ setApplyTemplateOn }
					currentStep={ currentStep }
					setStep={ setStep }
					isFrontPage={ isFrontPage }
				/>
			</div>
		</Modal>
	);
}

function getModalTitle( currentStep ) {
	switch ( currentStep ) {
		case STEPS_VALUES.STEP_1:
			return __( 'Apply for all pages?', 'kubio' );
		case STEPS_VALUES.STEP_2:
			return __( 'New template required', 'kubio' );
	}
}

export { ClassicThemeCreateTemplateModal };
