import { CanvasIcon } from '@kubio/controls';
import { withColibriDataAutoSave, withStyledElements } from '@kubio/core';
import { compose } from '@wordpress/compose';
import _ from 'lodash';
import shortid from 'shortid';
import { useKubioInnerBlockProps } from '@kubio/block-library';

import { createPortal, useEffect, useRef } from '@wordpress/element';
import { notices } from './config';
import { ElementsEnum } from './elements';
import { useToolbarState } from './toolbar';
import defaultVariation from './default-variation';
import { transformBlockToTemplate } from '@kubio/utils';
const preventDefault = ( e ) => {
	e.preventDefault();
	e.stopPropagation();
};

const TEMPLATE = defaultVariation.innerBlocks.map( ( block ) => {
	return transformBlockToTemplate( block, { skipRef: true } );
} );

const Component = ( props ) => {
	const { computed, StyledElements, dataHelper, attributes } = props;
	const {
		noticeSuccess,
		noticeInfo,
		noticeError,
		popupId,
		formFields,
		formConsent,
		formLayout,
		nameObj,
		emailObj,
		termsObj,
		submitObj,
		formUniqueId,
	} = computed;

	const ref = useRef();

	// backward compatibility, was 2 separated data provider
	useEffect( () => {
		const groupNoticeStyleByMedia = dataHelper.getStyleByMedia(
			'',
			{},
			{
				styledComponent: 'groupNotices',
				fromRoot: true,
			}
		);
		const noticeStyleComponent = [
			ElementsEnum.SUCCESS_NOTICE,
			ElementsEnum.INFO_NOTICE,
			ElementsEnum.ERROR_NOTICE,
		];
		_.each( groupNoticeStyleByMedia, ( groupStyleFromMedia, media ) => {
			if ( ! _.isEmpty( groupStyleFromMedia ) ) {
				noticeStyleComponent.forEach( ( styledComponent ) => {
					const styleNotice = dataHelper.getStyle(
						'',
						{},
						{
							styledComponent,
							fromRoot: true,
							media,
						}
					);
					const mergeStyle = _.merge(
						{},
						styleNotice,
						groupStyleFromMedia
					);
					dataHelper.setStyle( '', mergeStyle, {
						styledComponent,
						media,
					} );
				} );
				dataHelper.setStyle( '', null, {
					styledComponent: 'groupNotices',
					unset: true,
					media,
				} );
			}
		} );
	}, [ dataHelper ] );

	useEffect( () => {
		dataHelper.silent( () => {
			if ( ! formUniqueId ) {
				dataHelper.setAttribute(
					'formUniqueId',
					shortid.generate() + ''
				);
			}
			if ( ! popupId ) {
				const parentHelper = dataHelper.withParent();
				const parentPopupId = parentHelper.getAttribute( 'popup_id' );
				dataHelper.setAttribute( 'popup_id', parentPopupId + '' );
			}
		} );
	}, [ dataHelper, formUniqueId, popupId ] );

	useEffect( () => {
		if ( ref.current ) {
			const wrapper = ref.current;
			const cleanups = [
				...wrapper.querySelectorAll( 'button,input,form' ),
			].map( ( el ) => {
				el.addEventListener( 'click', preventDefault );
				el.addEventListener( 'submit', preventDefault );

				return () => {
					el.removeEventListener( 'click', preventDefault );
					el.removeEventListener( 'submit', preventDefault );
				};
			} );

			return () => {
				cleanups.forEach( ( cleanup ) => cleanup() );
			};
		}
	}, [ attributes ] );

	const { viewState, toolbarComponent } = useToolbarState( dataHelper );

	const innerBlocksProps = useKubioInnerBlockProps(
		{},
		{
			templateLock: false,
			template: TEMPLATE,
		}
	);

	const customContentRef = useRef();

	return (
		<>
			{ toolbarComponent }
			<StyledElements.Outer ref={ ref } data-current-action={ viewState }>
				<StyledElements.Container>
					<StyledElements.InnerForm>
						<StyledElements.ContainerFields>
							{ formFields === 'name-email' && (
								<>
									<StyledElements.NameContainer>
										{ nameObj.labelDisplay === true && (
											<StyledElements.NameLabel>
												{ nameObj.label }
											</StyledElements.NameLabel>
										) }
										<StyledElements.NameField
											type="text"
											name="name"
											placeholder={ nameObj.placeholder }
											defaultValue=""
											autoComplete="off"
										/>
									</StyledElements.NameContainer>
								</>
							) }
							<StyledElements.FakeFirstName
								type="text"
								name="first-name"
								defaultValue=""
								autoComplete="off"
							/>
							<StyledElements.EmailContainer>
								{ emailObj.labelDisplay === true && (
									<StyledElements.EmailLabel>
										{ emailObj.label }
									</StyledElements.EmailLabel>
								) }
								<StyledElements.EmailField
									type="email"
									name="email"
									placeholder={ emailObj.placeholder }
									defaultValue=""
									autoComplete="off"
								/>
							</StyledElements.EmailContainer>
							{ formLayout === 'horizontal' && (
								<StyledElements.SubmitContainer>
									<StyledElements.SubmitButton>
										{ submitObj.iconEnabled === true &&
											submitObj.iconPosition ===
												'before' && (
												<StyledElements.SubmitIcon
													tag={ CanvasIcon }
													name={ submitObj.icon }
												/>
											) }
										<StyledElements.SubmitText
											dangerouslySetInnerHTML={ {
												__html: submitObj.text,
											} }
										/>
										{ submitObj.iconEnabled === true &&
											submitObj.iconPosition ===
												'after' && (
												<StyledElements.SubmitIcon
													tag={ CanvasIcon }
													name={ submitObj.icon }
												/>
											) }
									</StyledElements.SubmitButton>
								</StyledElements.SubmitContainer>
							) }
						</StyledElements.ContainerFields>

						{ formConsent === true && (
							<>
								<StyledElements.TermsContainerAlign>
									<StyledElements.TermsContainer
										for={ 'agree' + formUniqueId }
									>
										<StyledElements.TermsCheckbox>
											<StyledElements.TermsField
												type="checkbox"
												id={ 'agree' + formUniqueId }
												name={ 'agree' + formUniqueId }
												checked={ termsObj.checked }
												value="0"
											/>
											<StyledElements.TermsIcon
												tag={ CanvasIcon }
												name={ termsObj.icon }
											/>
										</StyledElements.TermsCheckbox>
										{ termsObj.labelDisplay === true && (
											<StyledElements.TermsLabel>
												{ termsObj.label }
											</StyledElements.TermsLabel>
										) }
									</StyledElements.TermsContainer>
									{ termsObj.description && (
										<StyledElements.TermsDescription
											dangerouslySetInnerHTML={ {
												__html: termsObj.description,
											} }
										/>
									) }
								</StyledElements.TermsContainerAlign>
							</>
						) }
						{ formLayout === 'vertical' && (
							<StyledElements.SubmitContainer>
								<StyledElements.SubmitButton>
									{ submitObj.iconEnabled === true &&
										submitObj.iconPosition === 'before' && (
											<StyledElements.SubmitIcon
												tag={ CanvasIcon }
												name={ submitObj.icon }
											/>
										) }
									<StyledElements.SubmitText
										dangerouslySetInnerHTML={ {
											__html: submitObj.text,
										} }
									/>
									{ submitObj.iconEnabled === true &&
										submitObj.iconPosition === 'after' && (
											<StyledElements.SubmitIcon
												tag={ CanvasIcon }
												name={ submitObj.icon }
											/>
										) }
								</StyledElements.SubmitButton>
							</StyledElements.SubmitContainer>
						) }

						{ noticeSuccess.status && (
							<StyledElements.SuccessNotice
								dangerouslySetInnerHTML={ {
									__html: noticeSuccess.label,
								} }
							/>
						) }
						{ noticeInfo.status && (
							<StyledElements.InfoNotice
								dangerouslySetInnerHTML={ {
									__html: noticeInfo.label,
								} }
							/>
						) }
						{ noticeError.status && (
							<StyledElements.ErrorNotice
								dangerouslySetInnerHTML={ {
									__html: noticeError.label,
								} }
							/>
						) }
					</StyledElements.InnerForm>
					{ customContentRef.current &&
						createPortal(
							<StyledElements.SuccessContainer
								{ ...innerBlocksProps }
							/>,
							customContentRef.current
						) }
				</StyledElements.Container>
				<div ref={ customContentRef } data-is-custom-content />
			</StyledElements.Outer>
		</>
	);
};

const useStylesMapper = ( { computed } = {} ) => {
	const { stackOnMobile, formLayout } = computed;
	return {
		[ ElementsEnum.OUTER ]: {
			className: [
				stackOnMobile === true ? 'subscribe-stack-on-mobile' : false,
				`subscribe-layout-${ formLayout }`,
			].filter( Boolean ),
		},
		[ ElementsEnum.CONTAINER ]: {
			className: [
				stackOnMobile === true ? 'subscribe-stack-on-mobile' : false,
			].filter( Boolean ),
		},
		[ ElementsEnum.SUCCESS_NOTICE ]: {},
		[ ElementsEnum.INFO_NOTICE ]: {},
		[ ElementsEnum.ERROR_NOTICE ]: {},
	};
};

const computed = ( dataHelper ) => {
	const popupId = dataHelper.getAttribute( 'popup_id' );
	const stackOnMobile = dataHelper.getAttribute( 'stackOnMobile' );

	const currentNoticeState = dataHelper.getContextProp( 'curentNotice' );
	const showSuccessNotice = currentNoticeState === notices.values.SUCCESS;
	const showErrorNotice = currentNoticeState === notices.values.ERROR;
	const showInfoNotice = currentNoticeState === notices.values.INFO;

	const noticeSuccess = {
		label: dataHelper.getAttribute( 'successNotice.label' ),
		status: showSuccessNotice,
	};
	const noticeInfo = {
		label: dataHelper.getAttribute( 'infoNotice.label' ),
		status: showInfoNotice,
	};
	const noticeError = {
		label: dataHelper.getAttribute( 'errorNotice.label' ),
		status: showErrorNotice,
	};
	const formFields = dataHelper.getAttribute( 'formFields' );
	const formConsent = dataHelper.getAttribute( 'formConsent' );

	const nameObj = {
		labelDisplay: dataHelper.getAttribute( 'nameLabelDisplay' ),
		label: dataHelper.getAttribute( 'nameLabel' ),
		placeholder: dataHelper.getAttribute( 'nameFieldPlaceholder' ),
	};
	const emailObj = {
		labelDisplay: dataHelper.getAttribute( 'emailLabelDisplay' ),
		label: dataHelper.getAttribute( 'emailLabel' ),
		placeholder: dataHelper.getAttribute( 'emailFieldPlaceholder' ),
	};

	const termsObj = {
		labelDisplay: dataHelper.getAttribute( 'termsLabelDisplay' ),
		label: dataHelper.getAttribute( 'termsLabel' ),
		description: dataHelper.getAttribute( 'termsDescription' ),
		icon: dataHelper.getAttribute( 'termsIcon' ),
		checked:
			dataHelper.getContextProp( 'curentTerms' ) === 'checked'
				? 'checked'
				: '',
	};
	const submitObj = {
		text: dataHelper.getAttribute( 'submitText' ),
		iconEnabled: dataHelper.getAttribute( 'submitIconEnabled' ),
		icon: dataHelper.getAttribute( 'submitIcon' ),
		iconPosition: dataHelper.getAttribute( 'submitIconPosition' ),
	};

	const formLayout = dataHelper.getAttribute( 'formLayout' );
	const formUniqueId = dataHelper.getAttribute( 'formUniqueId' );
	return {
		currentNoticeState,
		noticeSuccess,
		noticeInfo,
		noticeError,
		popupId,
		formFields,
		formConsent,
		nameObj,
		emailObj,
		termsObj,
		submitObj,
		formLayout,
		formUniqueId,
		stackOnMobile: stackOnMobile && formLayout === 'horizontal',
	};
};

const DividerCompose = compose(
	withColibriDataAutoSave( computed ),
	withStyledElements( useStylesMapper )
);
const Base = DividerCompose( Component );
export { Base };
