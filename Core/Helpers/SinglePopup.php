<?php
/*
* Helper functions for the single popup page
*/
if ( ! function_exists( 'cs_is_single' ) ) {
	/**
	 * Check if the current page is the edit single popup page
	 *
	 * @return boolean
	 */
	function cs_is_single() {
		$popup = \CSPromo\Core\Admin\CurrentPromoPopup::getInstance();
		return $popup->isSingle();
	}
}

if ( ! function_exists( 'cs_is_popup_found' ) ) {
	/**
	 * Check if the current popup is found
	 *
	 * @return boolean
	 */
	function cs_is_popup_found() {
		$popup = \CSPromo\Core\Admin\CurrentPromoPopup::getInstance();
		return $popup->found();
	}
}

if ( ! function_exists( 'cs_get_single_popup' ) ) {
	/**
	 * Get the current popup
	 *
	 * @return boolean
	 */
	function cs_get_single_popup() {
		$popup = \CSPromo\Core\Admin\CurrentPromoPopup::getInstance();
		return $popup->getPost();
	}
}

if ( ! function_exists( 'cs_import_template_contents' ) ) {
	/**
	 * Import the template contents from a txt file
	 *
	 * @return string
	 */
	function cs_import_template_contents( $template ) {
		$file = IC_PROMO_PATH . 'admin/assets/templates/' . $template . '.txt';
		if ( file_exists( $file ) ) {
			return file_get_contents( $file );
		}
		return '';
	}
}

if ( ! function_exists( 'cs_promo_get_default_email_list' ) ) {
	/**
	 * Get the default email list
	 *
	 * @return int
	 */
	function cs_promo_get_default_email_list() {
		$lists = new \CSPromo\Core\Services\EmailListsService();
		return $lists->getDefaultListID();
	}
}


if ( ! function_exists( 'cs_promo_data_to_json' ) ) {
	/**
	 * Array to json
	 *
	 * @return string
	 */
	function cs_promo_data_to_json( $data ) {
		return htmlspecialchars( json_encode( $data ), ENT_QUOTES, 'UTF-8' );
	}
}
