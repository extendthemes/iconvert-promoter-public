<?php

/**
 * Helper functions for the FlashMessages::class
 *
 */

if ( ! function_exists( 'iconvertpr_flash_message_add' ) ) {
	/**
	 * cs_flash_message_add Helper function to add a flash message
	 *
	 * @param  mixed $message
	 * @param  mixed $status
	 * @return void
	 */
	function iconvertpr_flash_message_add( $message, $status = 'success' ) {
		$flashMessages = \CSPromo\Core\Admin\Actions\FlashMessages::getInstance();
		$flashMessages->addMessage( $message, $status );
	}
}

if ( ! function_exists( 'iconvert_flash_messages_show' ) ) {
	/**
	 * cs_flash_messages_show Helper function to display flash messages
	 *
	 * @param  mixed $echo
	 * @return void
	 */
	function iconvert_flash_messages_show( $echo = true ) {
		$flashMessages = \CSPromo\Core\Admin\Actions\FlashMessages::getInstance();
		$flashMessages->displayMessages( $echo );
	}
}
