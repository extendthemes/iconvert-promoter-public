<?php

namespace KPromo\Blocks;

use CSPromo\Core\Services\TemplatesService;
use IlluminateAgnostic\Arr\Support\Arr;
use KPromo\Core\Blocks\BlockContainerBase;
use KPromo\Core\Registry;
use KPromo\Core\Utils as CoreUtils;
use KPromo\Core\StyleManager\DynamicStyles;


class PromoPopupBlock extends BlockContainerBase {

	const WRAPPER         = 'wrapper';
	const WRAPPER_CONTENT = 'wrapperContent';
	const OUTER           = 'outer';
	const CONTAINER       = 'container';
	const VSPACE          = 'v-space';
	const CSS_WRAPPER     = 'css-wrapper';

	private static $popupId = null;

	public function __construct( $block, $autoload = true, $context = array() ) {

		// phpcs:ignore WordPress.Security.NonceVerification.Recommended, WordPress.Security.ValidatedSanitizedInput.MissingUnslash, WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
		$is_preview = isset( $_REQUEST['__iconvert-promoter-preview'] ) || isset( $_REQUEST['__iconvert-promoter-preview-remote-template'] );

		// phpcs:ignore WordPress.Security.NonceVerification.Recommended, WordPress.Security.ValidatedSanitizedInput.MissingUnslash, WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
		if ( $is_preview && current_user_can( 'edit_posts' ) ) {
			// phpcs:ignore WordPress.Security.NonceVerification.Recommended, WordPress.Security.ValidatedSanitizedInput.MissingUnslash, WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
			$settings = isset( $_REQUEST['settings'] ) ? json_decode( stripslashes( $_REQUEST['settings'] ), true ) : null;

			if ( $settings ) {
				$attrs         = $block['attrs'];
				$next_settings = Arr::only(
					$settings,
					array(
						'position',
						'animationIn',
						'animationOut',
						'contentPosition',
						'animationDuration',
					)
				);

				foreach ( $next_settings as $key => $value ) {
					if ( is_array( $value ) ) {
						$next_settings[ $key ] = array_map( 'sanitize_text_field', $value );
					} else {
						$next_settings[ $key ] = sanitize_text_field( $value );
					}
				}

				if ( ! empty( $next_settings ) ) {

					$promo_service = new TemplatesService(
						array_merge(
							array(
								'promoType' => $attrs['popup_type'],

							),
							$next_settings
						)
					);
					$settings_attrs = $promo_service->parseBlockSettings( array() );

					$block['attrs'] = array_replace_recursive( $block['attrs'], $settings_attrs );
				}
			}
		}

		parent::__construct( $block, $autoload, $context );
	}


	public static function getPopupId() {
		return self::$popupId;
	}

	public function computed() {
		$iconEnabled = false;
		if ( $this->getProp( 'type' ) === 'icon' ) {
			$iconEnabled = true;
		}
		return array(
			'iconEnabled' => $iconEnabled,
		);
	}



	public function mapPropsToElements() {
		$align    = $this->getAttribute( 'align' );
		$position = $this->getAttribute( 'align' );
		$alignH   = $this->getAttribute( 'alignH' );
		if ( $align === 'start' ) {
			$contentPosition = $this->getAttribute( 'contentPosition' );
		} else {
			$contentPosition = 'over-content';
		}
		if ( $align ) {
			$align = 'align-items-' . $align;
		}

		if ( $alignH ) {
			$alignH = 'justify-content-' . $alignH;
		}

		//Effects
		$hideEffectClass       = '';
		$showEffectClass       = '';
		$effectClass           = '';
		$showEffectActive      = $this->getAttribute( 'showNotice.effectActive' );
		$showEffectActiveValue = $this->getAttribute( 'showNotice.' . $showEffectActive );

		if ( $showEffectActive ) {
			$effectClass     = 'animate__animated';
			$showEffectClass = $showEffectActiveValue;
		}

		$hideEffectActive      = $this->getAttribute( 'hideNotice.effectActive' );
		$hideEffectActiveValue = $this->getAttribute( 'hideNotice.' . $hideEffectActive );

		if ( $hideEffectActive ) {
			$effectClass     = 'animate__animated';
			$hideEffectClass = $hideEffectActiveValue;
		}

		$frameHideClasses = CoreUtils::mapHideClassesByMedia(
			$this->getPropByMedia( 'isHidden' ),
			false
		);

		$jsCounterProps = array();
		$jsCounterProps = CoreUtils::useJSComponentProps( 'promopopup', $jsCounterProps );
		$popupId        = $this->getAttribute( 'popup_id' );
		$popupType      = $this->getAttribute( 'popup_type' );

		if ( $popupType === 'inline-promotion-bar' ) {
			$showEffectClass = 'none';
		}

		$animationDuration = $this->getStyle(
			'animation.duration.value',
			1,
			array(
				'styledComponent' => self::CONTAINER,
			)
		);
		return array(
			self::WRAPPER     => array(
				'id'                 => 'cs-popup-container-' . $popupId,
				'className'          => array( 'cs-popup-container', "cs-popup-container-type-$popupType", 'cs-fb-position-' . $contentPosition ),
				'data-cs-promoid'    => (string) $popupId,
				'data-cs-promo-type' => (string) $popupType,
			),
			self::OUTER       => array_merge(
				array(

					'className'               => array_merge( $frameHideClasses, array( 'cs-popup', $align, $alignH, "cs-popup-outer-type-$popupType" ) ),
					'data-popupId'            => $popupId,
					'data-show-effect'        => $showEffectClass,
					'data-exit-effect'        => $hideEffectClass,
					'data-animation-duration' => strval( $animationDuration ),

				),
				$jsCounterProps
			),
			self::CONTAINER   => array(
				'className'               => array( $effectClass ),
				'data-v-position'         => $position,
				'data-show-effect'        => $showEffectClass,
				'data-exit-effect'        => $hideEffectClass,
				'data-animation-duration' => strval( $animationDuration ),
			),

			self::CSS_WRAPPER => array(
				'innerHTML' => sprintf( '<style>%s</style>', $this->getAttribute( 'additionalCSS' ) ),
			),
		);
	}

	public function mapDynamicStyleToElements() {
		$dynamicStyles                 = array();
		$spaceByMedia                  = $this->getPropByMedia(
			'vSpace',
			array()
		);
		$dynamicStyles[ self::VSPACE ] = DynamicStyles::vSpace( $spaceByMedia );

		return $dynamicStyles;
	}

	public function renderInnerBlocks( $wp_block ) {
		self::$popupId = $this->getAttribute( 'popup_id' );
		$inner_blocks  = parent::renderInnerBlocks( $wp_block );
		self::$popupId = null;

		return $inner_blocks;
	}
}


Registry::registerBlock(
	__DIR__,
	PromoPopupBlock::class
);
