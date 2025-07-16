<?php

namespace CSPromo\Core\PostTypes;

class PromoPopupsSettings {


	/**
	 * Get the Popup types
	 *
	 * @return array
	 */
	public static function getTypes() {
		return array(
			'simple-popup'         => array(
				'name'          => __( 'Simple Popup', 'iconvert-promoter' ),
				'image_preview' => self::getImagePreview( 'simple_popup.png' ),
				'settings'      => array(
					'position'        => 'position-matrix',
					'defaultPosition' => 'center#center',
				),
			),
			'lightbox-popup'       => array(
				'name'          => __( 'Lightbox Popup', 'iconvert-promoter' ),
				'image_preview' => self::getImagePreview( 'lightbox_popup.png' ),
				'settings'      => array(
					'position'        => 'position-matrix',
					'defaultPosition' => 'center#center',
				),
			),
			'slidein-popup'        => array(
				'name'          => __( 'Slide-in Popup', 'iconvert-promoter' ),
				'image_preview' => self::getImagePreview( 'slide-in_popup.png' ),
				'settings'      => array(
					'position'        => 'position-matrix',
					'defaultPosition' => 'end#end',
				),
			),
			'floating-bar'         => array(
				'name'          => __( 'Floating Bar', 'iconvert-promoter' ),
				'image_preview' => self::getImagePreview( 'floating_popup.png' ),
				'settings'      => array(
					'position'        => 'position-toggle',
					'defaultPosition' => 'start',
					'contentPosition' => 'over-content',
				),
			),
			'inline-promotion-bar' => array(
				'name'          => __( 'Inline Promotion Bar', 'iconvert-promoter' ),
				'image_preview' => self::getImagePreview( 'inline_promo_bar.png' ),
				'settings'      => array( 'position' => false ),
			),
			'fullscreen-mat'       => array(
				'name'          => __( 'Fullscreen Mat', 'iconvert-promoter' ),
				'image_preview' => self::getImagePreview( 'lightbox_popup.png' ),
				'settings'      => array(
					'position'        => 'position-matrix',
					'defaultPosition' => 'center#center',
					'position'        => false,
				),
			),

		);
	}

	/**
	 * Get single popup type
	 *
	 * @param  mixed $popupType
	 * @return string
	 */
	public static function getType( $popupType ) {
		$types = self::getTypes();
		if ( isset( $types[ $popupType ] ) ) {
			return $types[ $popupType ];
		}

		return __( 'Invalid Popup Type', 'iconvert-promoter' );
	}

	public static function getImagePreview( $filename ) {
		return ICONVERTPR_URL . 'admin/assets/images/types/' . $filename;
	}
}
