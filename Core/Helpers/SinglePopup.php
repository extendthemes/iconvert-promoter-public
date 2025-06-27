<?php



if ( ! function_exists( 'iconvertpr_import_template_contents' ) ) {
	/**
	 * Import the template contents from a txt file
	 *
	 * @return string
	 */
	function iconvertpr_import_template_contents( $template ) {
		$file = ICONVERTPR_PATH . 'admin/assets/templates/' . $template . '.txt';
		if ( file_exists( $file ) ) {
			return file_get_contents( $file );
		}
		return '';
	}
}

if ( ! function_exists( 'iconvertpr_get_default_email_list' ) ) {
	/**
	 * Get the default email list
	 *
	 * @return int
	 */
	function iconvertpr_get_default_email_list() {
		$lists = new \CSPromo\Core\Services\EmailListsService();
		return $lists->getDefaultListID();
	}
}


if ( ! function_exists( 'iconvertpr_data_to_json' ) ) {
	/**
	 * Array to json
	 *
	 * @return string
	 */
	function iconvertpr_data_to_json( $data ) {
		return htmlspecialchars( json_encode( $data ), ENT_QUOTES, 'UTF-8' );
	}
}
