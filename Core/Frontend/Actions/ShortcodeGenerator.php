<?php

namespace CSPromo\Core\Frontend\Actions;


class ShortcodeGenerator {

	public static $preRenderShortcodeOutputById = array();
	public const TYPE_INLINE_BAR                = 'iconvertpr_inline_bar';

	public function __construct() {
		add_shortcode( self::TYPE_INLINE_BAR, array( $this, 'inline_bar_shortcode' ) );
	}

	public function inline_bar_shortcode( $args ) {
		if ( ! isset( $args['id'] ) ) {
			return '';
		}
		$idPromo = intval( $args['id'] );

		if ( ! $idPromo ) {
			return '';
		}
		return sprintf(
			'<script data-iconvert-inline-popup-id="%1$s">window.icPromoInlinePopups = [...(window.icPromoInlinePopups || []),%1$s];</script>',
			$idPromo
		);
	}
}
