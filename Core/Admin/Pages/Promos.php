<?php

namespace CSPromo\Core\Admin\Pages;

use CSPromo\Core\Admin\PopupService;
use CSPromo\Core\Traits\HasTemplate;
use CSPromo\Core\PostTypes\PromoPopups;
use CSPromo\Core\Services\TemplatesService;
use CSPromo\Core\PostTypes\PromoPopupsSettings;

class Promos {

	use HasTemplate;

	const DEFAULT_NAME_PREFIX = 'Campaign promo';


	public static function get_available_effects() {

		return array(
			array(
				'type'  => '',
				'label' => __( 'None', 'iconvert-promoter' ),
				'value' => '',
			),
			array(
				'type'  => 'effectFading',
				'label' => __( 'Fade', 'iconvert-promoter' ),
				'in'    => array(
					'fadeIn'      => __( 'Fade In', 'iconvert-promoter' ),
					'fadeInUp'    => __( 'Fade In Up', 'iconvert-promoter' ),
					'fadeInDown'  => __( 'Fade In Down', 'iconvert-promoter' ),
					'fadeInLeft'  => __( 'Fade In Left', 'iconvert-promoter' ),
					'fadeInRight' => __( 'Fade In Right', 'iconvert-promoter' ),
				),

				'out'   => array(
					'fadeOut'      => __( 'Fade Out', 'iconvert-promoter' ),
					'fadeOutUp'    => __( 'Fade Out Up', 'iconvert-promoter' ),
					'fadeOutDown'  => __( 'Fade Out Down', 'iconvert-promoter' ),
					'fadeOutLeft'  => __( 'Fade Out Left', 'iconvert-promoter' ),
					'fadeOutRight' => __( 'Fade Out Right', 'iconvert-promoter' ),
				),
			),

			array(
				'type'  => 'effectZooming',
				'label' => __( 'Zooming', 'iconvert-promoter' ),
				'in'    => array(
					'zoomIn'      => __( 'Zoom In', 'iconvert-promoter' ),
					'zoomInUp'    => __( 'Zoom In Up', 'iconvert-promoter' ),
					'zoomInDown'  => __( 'Zoom In Down', 'iconvert-promoter' ),
					'zoomInLeft'  => __( 'Zoom In Left', 'iconvert-promoter' ),
					'zoomInRight' => __( 'Zoom In Right', 'iconvert-promoter' ),
				),
				'out'   => array(
					'zoomOut'      => __( 'Zoom Out', 'iconvert-promoter' ),
					'zoomOutUp'    => __( 'Zoom Out Up', 'iconvert-promoter' ),
					'zoomOutDown'  => __( 'Zoom Out Down', 'iconvert-promoter' ),
					'zoomOutLeft'  => __( 'Zoom Out Left', 'iconvert-promoter' ),
					'zoomOutRight' => __( 'Zoom Out Right', 'iconvert-promoter' ),
				),
			),
			array(
				'type'  => 'effectBouncing',
				'label' => __( 'Bouncing', 'iconvert-promoter' ),
				'in'    => array(
					'bounceIn'      => __( 'Bounce In', 'iconvert-promoter' ),
					'bounceInUp'    => __( 'Bounce In Up', 'iconvert-promoter' ),
					'bounceInDown'  => __( 'Bounce In Down', 'iconvert-promoter' ),
					'bounceInLeft'  => __( 'Bounce In Left', 'iconvert-promoter' ),
					'bounceInRight' => __( 'Bounce In Right', 'iconvert-promoter' ),
				),
				'out'   => array(
					'bounceOut'      => __( 'Bounce Out', 'iconvert-promoter' ),
					'bounceOutUp'    => __( 'Bounce Out Up', 'iconvert-promoter' ),
					'bounceOutDown'  => __( 'Bounce Out Down', 'iconvert-promoter' ),
					'bounceOutLeft'  => __( 'Bounce Out Left', 'iconvert-promoter' ),
					'bounceOutRight' => __( 'Bounce Out Right', 'iconvert-promoter' ),
				),
			),
			array(
				'type'  => 'effectSliding',
				'label' => __( 'Slide', 'iconvert-promoter' ),
				'in'    => array(
					'slideInUp'    => __( 'Slide In Up', 'iconvert-promoter' ),
					'slideInDown'  => __( 'Slide In Down', 'iconvert-promoter' ),
					'slideInLeft'  => __( 'Slide In Left', 'iconvert-promoter' ),
					'slideInRight' => __( 'Slide In Right', 'iconvert-promoter' ),
				),
				'out'   => array(
					'slideOutUp'    => __( 'Slide Out Up', 'iconvert-promoter' ),
					'slideOutDown'  => __( 'Slide Out Down', 'iconvert-promoter' ),
					'slideOutLeft'  => __( 'Slide Out Left', 'iconvert-promoter' ),
					'slideOutRight' => __( 'Slide Out Right', 'iconvert-promoter' ),
				),
			),
			array(
				'type'  => 'effectRotating',
				'label' => __( 'Rotate', 'iconvert-promoter' ),
				'in'    => array(
					'rotateIn'          => __( 'Rotate In', 'iconvert-promoter' ),
					'rotateInUpLeft'    => __( 'Rotate In Up Left', 'iconvert-promoter' ),
					'rotateInDownLeft'  => __( 'Rotate In Down Left', 'iconvert-promoter' ),
					'rotateInUpRight'   => __( 'Rotate In Up Right', 'iconvert-promoter' ),
					'rotateInDownRight' => __( 'Rotate In Down Right', 'iconvert-promoter' ),
				),
				'out'   => array(
					'rotateOut'          => __( 'Rotate Out', 'iconvert-promoter' ),
					'rotateOutUpLeft'    => __( 'Rotate Out Up Left', 'iconvert-promoter' ),
					'rotateOutDownLeft'  => __( 'Rotate Out Down Left', 'iconvert-promoter' ),
					'rotateOutUpRight'   => __( 'Rotate Out Up Right', 'iconvert-promoter' ),
					'rotateOutDownRight' => __( 'Rotate Out Down Right', 'iconvert-promoter' ),
				),
			),
			array(
				'type'  => 'effectAttentionSeekers',
				'label' => __( 'Attention Seekers', 'iconvert-promoter' ),
				'in'    => array(
					'bounce'     => __( 'Bounce', 'iconvert-promoter' ),
					'flash'      => __( 'Flash', 'iconvert-promoter' ),
					'pulse'      => __( 'Pulse', 'iconvert-promoter' ),
					'rubberBand' => __( 'Rubber Band', 'iconvert-promoter' ),
					'shakeX'     => __( 'Shake X', 'iconvert-promoter' ),
					'shakeY'     => __( 'Shake Y', 'iconvert-promoter' ),
					'swing'      => __( 'Swing', 'iconvert-promoter' ),
					'tada'       => __( 'Tada', 'iconvert-promoter' ),
					'wobble'     => __( 'Wobble', 'iconvert-promoter' ),
					'jello'      => __( 'Jello', 'iconvert-promoter' ),
					'heartBeat'  => __( 'Heart Beat', 'iconvert-promoter' ),
				),
				'out'   => array(
					'bounceOut' => __( 'Bounce Out', 'iconvert-promoter' ),
				),
			),
			array(
				'type'  => 'effectLightSpeed',
				'label' => __( 'LightSpeed', 'iconvert-promoter' ),
				'in'    => array(
					'lightSpeedInLeft'  => __( 'LightSpeed In Left', 'iconvert-promoter' ),
					'lightSpeedInRight' => __( 'LightSpeed In Right', 'iconvert-promoter' ),
				),
				'out'   => array(
					'lightSpeedOutLeft'  => __( 'LightSpeed Out Left', 'iconvert-promoter' ),
					'lightSpeedOutRight' => __( 'LightSpeed Out Right', 'iconvert-promoter' ),
				),
			),
			array(
				'type'  => 'effectSpecials',
				'label' => 'Specials',
				'in'    => array(
					'rollIn'       => __( 'Roll In', 'iconvert-promoter' ),
					'jackInTheBox' => __( 'Jack In The Box', 'iconvert-promoter' ),
				),
				'out'   => array(
					'rollOut' => __( 'Roll Out', 'iconvert-promoter' ),
				),
			),
			array(
				'type'  => 'effectFlippers',
				'label' => 'Flippers',
				'in'    => array(
					'flipInX' => __( 'Flip In X', 'iconvert-promoter' ),
					'flipInY' => __( 'Flip In Y', 'iconvert-promoter' ),
				),
				'out'   => array(
					'flipOutX' => __( 'Flip Out X', 'iconvert-promoter' ),
					'flipOutY' => __( 'Flip Out Y', 'iconvert-promoter' ),
				),
			),

		);
	}

	public static function normalize_animation_class( $animation ) {

		if ( empty( $animation ) ) {
			return array(
				'type'   => '',
				'effect' => '',
			);
		}

		list($type, $animation) = explode( '#', $animation );

		return array(
			'type'   => $type,
			'effect' => "animate__{$animation}",
		);
	}

	public static function get_centering_options() {
		return array(
			'start#start'   => array(
				'label'         => __( 'Top left', 'iconvert-promoter' ),
				'effects-sides' => array(
					'in'  => 'InLeft',
					'out' => 'OutLeft',
				),
			),
			'start#center'  => array(
				'label'         => __( 'Top center', 'iconvert-promoter' ),
				'effects-sides' => array(
					'in'  => 'InDown',
					'out' => 'OutUp',
				),
			),
			'start#end'     => array(
				'label'         => __( 'Top right', 'iconvert-promoter' ),
				'effects-sides' => array(
					'in'  => 'InRight',
					'out' => 'OutRight',
				),
			),
			'center#start'  => array(
				'label'         => __( 'Center left', 'iconvert-promoter' ),
				'effects-sides' => array(
					'in'  => 'InLeft',
					'out' => 'OutLeft',
				),
			),
			'center#center' => array(
				'label'         => __( 'Center center', 'iconvert-promoter' ),
				'effects-sides' => array(
					'in'  => 'In',
					'out' => 'Out',
				),
			),
			'center#end'    => array(
				'label'         => __( 'Center right', 'iconvert-promoter' ),
				'effects-sides' => array(
					'in'  => 'InRight',
					'out' => 'OutRight',
				),
			),
			'end#start'     => array(
				'label'         => __( 'Bottom left', 'iconvert-promoter' ),
				'effects-sides' => array(
					'in'  => 'InLeft',
					'out' => 'OutLeft',
				),
			),
			'end#center'    => array(
				'label'         => __( 'Bottom center', 'iconvert-promoter' ),
				'effects-sides' => array(
					'in'  => 'InUp',
					'out' => 'OutDown',
				),
			),
			'end#end'       => array(
				'label'         => __( 'Bottom right', 'iconvert-promoter' ),
				'effects-sides' => array(
					'in'  => 'InRight',
					'out' => 'OutRight',
				),
			),
		);
	}

	public function create() {
		$promoTypes       = PromoPopupsSettings::getTypes();
		$centeringOptions = static::get_centering_options();

		$defaultAlign = 'center#center';

		self::templateWithLayout(
			'pages/promo-create',
			array(
				'promoTypes'       => $promoTypes,
				'promoDefaultName' => '',
				'centeringOptions' => $centeringOptions,
				'defaultAlign'     => $defaultAlign,
			)
		);
	}

	public function edit() {
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended, WordPress.Security.ValidatedSanitizedInput.MissingUnslash
		$postId            = isset( $_GET['post_id'] ) ? intval( $_GET['post_id'] ) : 0;
		$post              = get_post( $postId );
		$popup             = PromoPopups::get( $postId );
		$metadataPost      = get_post_meta( $postId );
		$popupType         = $metadataPost['popup_type'][0];
		$displayConditions = unserialize( $metadataPost['display_conditions'][0] );
		$triggers          = unserialize( $metadataPost['triggers'][0] );
		$promoTypes        = PromoPopupsSettings::getTypes();

		$service          = new TemplatesService();
		$templates        = $service->getRecords( $popupType );
		$centeringOptions = static::get_centering_options();
		$defaultAlign     = 'center#center';

		$popupSettings = PopupService::getPopupSettings( $postId );

		$normalizedPopupSettings = array(
			'promoType'         => $popupType,
			'align'             => isset( $popupSettings['align'] ) ? $popupSettings['align'] : 'start',
			'position'          => isset( $popupSettings['position_selector'] ) ? $popupSettings['position_selector'] : false,
			'contentPosition'   => isset( $popupSettings['contentPosition'] ) ? $popupSettings['contentPosition'] : 'over-content',
			'defaultPosition'   => isset( $popupSettings['position'] ) ? $popupSettings['position'] : false,
			'animationIn'       => isset( $popupSettings['animations']['in']['composed'] ) ? $popupSettings['animations']['in']['composed'] : '',
			'animationOut'      => isset( $popupSettings['animations']['out']['composed'] ) ? $popupSettings['animations']['out']['composed'] : '',
			'animationDuration' => isset( $popupSettings['animationDuration'] ) ? $popupSettings['animationDuration'] : 1,
		);

		$all_roles = wp_roles()->roles;

		$user_roles = array(
			array(
				'label'      => __( 'Hide campaign for logged users?', 'iconvert-promoter' ),
				'input_name' => 'switch_hide_logged_users',
				'role'       => 'logged',
				'isPro'      => false,
			),
		);

		foreach ( $all_roles as $role => $role_data ) {
			$user_roles[] = array(
				// translators: %s is the name of the user role.
				'label'      => sprintf( __( 'Hide campaign for %s users?', 'iconvert-promoter' ), $role_data['name'] ),
				'input_name' => 'switch_hide_' . $role . '_users',
				'role'       => $role,
				'isPro'      => true,
			);
		}

		self::templateWithLayout(
			'pages/promo-edit',
			array(
				'post'              => $post,
				'metadata'          => $metadataPost,
				'type'              => $popupType,
				'popup'             => $popup,
				'promoTypes'        => $promoTypes,
				'displayConditions' => $displayConditions,
				'triggers'          => $triggers,
				'centeringOptions'  => $centeringOptions,
				'templates'         => $templates['records'],
				'defaultAlign'      => isset( $popupSettings['position'] ) ? $popupSettings['position'] : $defaultAlign,
				'popupSettings'     => $normalizedPopupSettings,
				'hcLoggedUsers'     => $user_roles,
			)
		);
	}
}
