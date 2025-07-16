import { useState } from '@wordpress/element';
import _ from 'lodash';
import { __, sprintf } from '@wordpress/i18n';
import {
	Button,
	ButtonGroup,
	__experimentalInputControl as InputControl,
} from '@wordpress/components';
import {
	STEPS_VALUES,
	COMPONENTS_BY_STEP,
	APPLY_TEMPLATE_ON_VALUES,
} from './config';
import { ProItem } from '@kubio/pro';
import { useSelect } from '@wordpress/data';
import { STORE_KEY } from '@kubio/constants';

function ModalContent( props ) {
	const { currentStep } = props;
	const Component = _.get( COMPONENTS_BY_STEP, currentStep );

	return <Component { ...props } />;
}

function Step1Content( {
	areaLabel,
	setStep = _.noop,
	setApplyTemplateOn = _.noop,
} ) {
	const onNextStep = () => {
		setStep( STEPS_VALUES.STEP_2 );
	};
	const onAllPages = () => {
		setApplyTemplateOn( APPLY_TEMPLATE_ON_VALUES.ALL_PAGES );
		onNextStep();
	};

	const onCurrentPage = () => {
		setApplyTemplateOn( APPLY_TEMPLATE_ON_VALUES.THIS_PAGE );
		onNextStep();
	};

	const { currentTemplateLabel } = useSelect( ( select ) => {
		const {
			getCurrentPageTemplate,
			getCurrentPostType,
			getAvailablePageTemplates,
		} = select( STORE_KEY );

		const currentPostType = getCurrentPostType();
		let currentTemplate = getCurrentPageTemplate();

		//if the current template is the current post type it means the default template. So we set the '' value to be the
		//same as values from the options
		if ( currentPostType === currentTemplate ) {
			currentTemplate = '';
		}
		const mappedTemplates = getAvailablePageTemplates();
		return {
			currentTemplateLabel:
				_.find( mappedTemplates, { value: currentTemplate } )?.label ||
				'',
		};
	}, [] );

	return (
		<>
			<p
				dangerouslySetInnerHTML={ {
					__html:
						currentTemplateLabel === ''
							? sprintf(
									// translators: %s - template part name (e.g. header/ footer/ sidebar)
									__(
										'Would you like to apply this %s to all pages that are using the current template or only for this page?',
										'kubio'
									),
									areaLabel
							  )
							: sprintf(
									// translators: %1$s: area label, %2$s: current template label
									__(
										'Would you like to apply this %1$s to all pages that are using the "%2$s" template?',
										'kubio'
									),
									areaLabel,
									`<strong>${ currentTemplateLabel }</strong>`
							  ),
				} }
			></p>
			<ButtonGroup className={ 'h-template-part-modal__button-group' }>
				<Button isLink onClick={ onAllPages }>
					{ __( 'Apply to all pages', 'kubio' ) }
				</Button>
				<ProItem
					tag={ Button }
					isPrimary
					onClick={ onCurrentPage }
					urlArgs={ {
						source: 'inserter',
						content: `create-template`,
					} }
				>
					{ __( 'Apply to this page only', 'kubio' ) }
				</ProItem>
			</ButtonGroup>
		</>
	);
}

function Step2Content( {
	areaLabel,
	otherAreaLabel,
	onCloseModal,
	onInsert,
	pageTitle,
	isFrontPage,
	applyTemplateOn,
} ) {
	const defaultTemplateName = sprintf( '%s template', pageTitle );
	const [ internalTemplateName, setInternalTemplateName ] =
		useState( defaultTemplateName );

	const onInternalInsert = () => {
		onInsert( internalTemplateName );
	};
	const applyOnAllPages =
		applyTemplateOn === APPLY_TEMPLATE_ON_VALUES.ALL_PAGES;
	const showTemplateNameInput = ! isFrontPage && ! applyOnAllPages;

	return (
		<>
			<div>
				<div className="kubio-classic-theme-create-template-modal__step2__input">
					{ showTemplateNameInput && (
						<InputControl
							label={ __( 'Template name', 'kubio' ) }
							value={ internalTemplateName }
							onChange={ setInternalTemplateName }
							placeholder={ __(
								'Eg. Page name - Template',
								'kubio'
							) }
							autoFocus={ true }
						/>
					) }
				</div>
				<div className="kubio-classic-theme-create-template-modal__step2__paragraph">
					<strong>{ __( 'Note: ', 'kubio' ) }</strong>
					<span>
						{ sprintf(
							// translators: %1$s: area label, %2$s: other area label
							__(
								'Applying this %1$s will also replace the %2$s on this page.',
								'kubio'
							),
							areaLabel,
							otherAreaLabel
						) }
					</span>
				</div>
				<div className="kubio-classic-theme-create-template-modal__step2__paragraph">
					{ sprintf(
						// translators: %1$s: area label, %2$s: other area label, %3$s: other area label
						__(
							'The current page uses the header and footer provided by the theme. Replacing the %1$s ' +
								'will create a new template so the %2$s will also be replaced with a Kubio %3$s',
							'kubio'
						),
						areaLabel,
						otherAreaLabel,
						otherAreaLabel
					) }
				</div>
			</div>

			<ButtonGroup className={ 'h-template-part-modal__button-group' }>
				<Button isLink onClick={ onCloseModal }>
					{ __( 'Cancel', 'kubio' ) }
				</Button>
				<Button isPrimary onClick={ onInternalInsert }>
					{ sprintf(
						// translators: %s: area label
						__( 'Change the %s', 'kubio' ),
						areaLabel
					) }
				</Button>
			</ButtonGroup>
		</>
	);
}

export { ModalContent, Step1Content, Step2Content };
