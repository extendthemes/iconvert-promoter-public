<?php

namespace KPromo\Blocks;

use KPromo\Core\Blocks\BlockBase;
use KPromo\Core\Registry;
use KPromo\Core\Utils as CoreUtils;

class SubscribeBlock extends BlockBase {


	const OUTER           = 'outer';
	const CONTAINER       = 'container';
	const CONTAINERFIELDS = 'containerfields';
	const NAMECONTAINER   = 'nameContainer';
	const NAMELABEL       = 'nameLabel';
	const NAMEFIELD       = 'nameField';

	const EMAILCONTAINER = 'emailContainer';
	const EMAILLABEL     = 'emailLabel';
	const EMAILFIELD     = 'emailField';
	const FAKEFIRSTNAME  = 'fakeFirstName';

	const SUBMITCONTAINER = 'submitContainer';
	const SUBMITBUTTON    = 'submitButton';
	const SUBMITTEXT      = 'submitText';
	const SUBMITICON      = 'submitIcon';

	const TERMSCHECKBOX       = 'termsCheckbox';
	const TERMSICON           = 'termsIcon';
	const TERMSFIELD          = 'termsField';
	const TERMSLABEL          = 'termsLabel';
	const TERMSDESCRIPTION    = 'termsDescription';
	const TERMSCONTAINER      = 'termsContainer';
	const TERMSCONTAINERALIGN = 'termsContainerAlign';

	const SUCCESS_NOTICE = 'successNotice';
	const INFO_NOTICE    = 'infoNotice';
	const ERROR_NOTICE   = 'errorNotice';
	const INNER_FORM     = 'innerForm';

	const SUCCESS_CONTAINER = 'successContainer';


	public function computed() {
		$formActive = false;
		if ( $this->getAttribute( 'formId' ) ) {
			$formActive = true;
		}
		$submitIconPositionBefore = $this->getAttribute( 'submitIconPosition' ) === 'before';
		$submitIconPositionAfter  = $this->getAttribute( 'submitIconPosition' ) === 'after';
		$formLayout               = $this->getAttribute( 'formLayout' );
		$submitIconEnabled        = $this->getAttribute( 'submitIconEnabled' );
		$result                   = array(
			'formActive'               => $formActive,
			'iconEnabled'              => $submitIconEnabled,
			'nameFieldActive'          => $this->getAttribute( 'formFields' ) === 'name-email' ? true : false,
			'nameLabelDisplay'         => $this->getAttribute( 'nameLabelDisplay' ),
			'emailLabelDisplay'        => $this->getAttribute( 'emailLabelDisplay' ),
			'formConsent'              => $this->getAttribute( 'formConsent' ),
			'termsLabelDisplay'        => $this->getAttribute( 'termsLabelDisplay' ),
			'submitIconPositionBefore' => $submitIconEnabled ? $submitIconPositionBefore : false,
			'submitIconPositionAfter'  => $submitIconEnabled ? $submitIconPositionAfter : false,
			'submitPositionVertical'   => $formLayout === 'vertical',
			'submitPositionHorizontal' => $formLayout === 'horizontal',

			'formLayoutHorizontal'     => $formLayout === 'horizontal',
			'formLayoutVertical'       => $formLayout === 'vertical',
		);

		return $result;
	}

	private function getFormId() {
		$formID = $this->getAttribute( 'formId' );

		if ( $formID == 1 && function_exists( 'iconvertpr_get_default_email_list' ) ) {
			$formID = iconvertpr_get_default_email_list();
		}

		return $formID;
	}

	private function getPopupId() {
		if ( $popupId = PromoPopupBlock::getPopupId() ) {
			return $popupId;
		}

		return $this->getAttribute( 'popup_id' );
	}

	public function renderInnerBlocks( $wp_block ) {

		if ( $this->getAttribute( 'onSuccessAction' ) === 'customContent' ) {
			return parent::renderInnerBlocks( $wp_block );
		}

		return '';
	}

	public function mapPropsToElements() {
		$formUniqueId   = $this->getAttribute( 'formUniqueId' );
		$jsCounterProps = array();
		$outerClasses   = array();
		$jsCounterProps = CoreUtils::useJSComponentProps( 'subscribe', $jsCounterProps );
		$formID         = $this->getFormId();

		$termsFieldChecked = trim( $this->getAttribute( 'termsFieldChecked' ) );
		$termsChecked      = ( isset( $termsFieldChecked ) && $termsFieldChecked == true ) ? 'checked' : 'unchecked';

		$onSuccessAction = $this->getAttribute( 'onSuccessAction' );

		$onSuccessSettings = array(
			'data-success-action' => $onSuccessAction,
		);

		if ( $onSuccessAction === 'redirect' ) {
			$link = $this->getAttribute( 'link' );
			if ( isset( $link['value'] ) && $link['value'] !== '' ) {
				$onSuccessSettings['data-redirect'] = urlencode( $link['value'] );
				$onSuccessSettings['data-window']   = $link['typeOpenLink'];
			}
		}

		if ( $onSuccessAction === 'openPopup' ) {
			$onSuccessSettings['data-open-popup'] = $this->getAttribute( 'onSuccessPopup' );
		}

		$containerClass = array();
		if ( $this->getAttribute( 'stackOnMobile' ) && $this->getAttribute( 'formLayout' ) === 'horizontal' ) {
			$outerClasses[]   = 'subscribe-stack-on-mobile';
			$containerClass[] = 'subscribe-stack-on-mobile';
		}

		$outerClasses[] = 'subscribe-layout-' . $this->getAttribute( 'formLayout' );

		$terms_label = $this->getAttribute( 'termsLabel' );

		$terms_description = $this->getAttribute( 'termsDescription' ) ? $this->getAttribute( 'termsDescription' ) : $this->getBlockInnerHtml();

		return array(
			self::OUTER               => array_merge(
				array(
					'className' => $outerClasses,
				),
				$jsCounterProps
			),
			self::CONTAINER           => array_merge(
				$onSuccessSettings,
				array(
					'className'         => $containerClass,
					'autocomplete'      => 'off',
					'data-formId'       => (string) $formID,
					'data-popupId'      => (string) $this->getPopupId(),
					'data-form-preview' => iconvertpr_preview_page() ? '1' : null,
				)
			),
			self::CONTAINERFIELDS     => array(),
			self::NAMECONTAINER       => array(),
			self::EMAILCONTAINER      => array(),
			self::SUBMITCONTAINER     => array(),

			self::NAMELABEL           => array(
				'innerHTML' => wp_kses_post( $this->getAttribute( 'nameLabel' ) ),
				'htmlFor'   => 'name',
			),
			self::NAMEFIELD           => array(
				'autocomplete' => 'off',
				'type'         => 'text',
				'placeholder'  => $this->getAttribute( 'nameFieldPlaceholder' ),
				'id'           => 'name',
				'name'         => 'name',
				'required'     => 'required',
			),
			self::FAKEFIRSTNAME       => array(
				'autocomplete' => 'off',
				'type'         => 'text',
				'id'           => 'first-name',
				'name'         => 'first-name',
				'value'        => '',
			),
			self::EMAILLABEL          => array(
				'innerHTML' => wp_kses_post( $this->getAttribute( 'emailLabel' ) ),
				'htmlFor'   => 'name',
			),
			self::EMAILFIELD          => array(
				'autocomplete' => 'off',
				'type'         => 'email',
				'placeholder'  => $this->getAttribute( 'emailFieldPlaceholder' ),
				'id'           => 'email',
				'name'         => 'email',
				'required'     => 'required',
			),
			self::TERMSFIELD          => array(
				'type'        => 'checkbox',
				'id'          => 'agree' . $formUniqueId,
				'name'        => 'agree' . $formUniqueId,
				'required'    => 'required',
				$termsChecked => '',
			),
			self::TERMSICON           => array(
				'name' => $this->getAttribute( 'termsIcon' ),
			),
			self::TERMSLABEL          => array(
				'innerHTML' => wp_kses_post( $terms_label ),
				//'for'   => "agree".$formUniqueId,
			),
			self::TERMSDESCRIPTION    => array(
				'innerHTML' => $terms_description,
				'style'     => array(
					'display' => empty( $terms_description ) ? 'none' : '',
				),
				//'for'   => "agree".$formUniqueId,
			),
			self::TERMSCONTAINERALIGN => array(),
			self::TERMSCONTAINER      => array(
				'for' => 'agree' . $formUniqueId,
			),

			self::SUBMITBUTTON        => array(
				'type' => 'submit',
			),
			self::SUBMITTEXT          => array(
				'innerHTML' => wp_kses_post( $this->getAttribute( 'submitText' ) ),
			),
			self::SUBMITICON          => array(
				'name' => $this->getAttribute( 'submitIcon' ),
			),

			self::INFO_NOTICE         => array(
				'innerHTML'      => wp_kses_post( $this->getAttribute( 'infoNotice.label' ) ),
				'className'      => array( 'wp-block-cspromo-subscribe-hide', 'subscribenotices' ),
				'data-fieldtype' => 'info',
			),
			self::ERROR_NOTICE        => array(
				'innerHTML'      => wp_kses_post( $this->getAttribute( 'errorNotice.label' ) ),
				'className'      => array( 'wp-block-cspromo-subscribe-hide', 'subscribenotices' ),
				'data-fieldtype' => 'error',
			),
			self::SUCCESS_NOTICE      => array(
				'innerHTML'      => wp_kses_post( $this->getAttribute( 'successNotice.label' ) ),
				'className'      => array( 'wp-block-cspromo-subscribe-hide', 'subscribenotices' ),
				'data-fieldtype' => 'success',
			),

			self::SUCCESS_CONTAINER   => array(
				'className' => array( 'd-none' ),
			),
		);
	}
}

Registry::registerBlock(
	__DIR__,
	SubscribeBlock::class
);
