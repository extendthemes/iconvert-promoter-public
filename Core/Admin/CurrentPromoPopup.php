<?php

namespace CSPromo\Core\Admin;

use CSPromo\Core\PostTypes\PromoPopups;
use CSPromo\Core\Traits\IsSingleton;

class CurrentPromoPopup {

	use IsSingleton;

	/**
	 * Is the current page a single popup
	 *
	 * @var bool
	 */
	private $single = false;

	/**
	 * post object
	 *
	 * @var null|Post Object
	 */
	private $post = null;

	/**
	 * __construct
	 *
	 * @return void
	 */
	public function __construct() {
		$this->init();
	}

	/**
	 * Initialize the single post page
	 *
	 * @return void
	 */
	private function init() {
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended
		if ( isset( $_GET['selected_popup'] ) && is_numeric( $_GET['selected_popup'] ) ) {
			$this->single = true;
			// phpcs:ignore WordPress.Security.NonceVerification.Recommended
			$this->initSinglePopup( intval( $_GET['selected_popup'] ) );
		}
	}

	/**
	 * Initialize the popup object
	 *
	 * @param  mixed $post_id
	 * @return void
	 */
	private function initSinglePopup( $post_id ) {
		$this->post = PromoPopups::get( $post_id );

		if ( ! $this->found() ) {
			iconvertpr_flash_message_add( __( 'The selected popup was not found!', 'iconvert-promoter' ), 'error' );
		}
	}

	/**
	 * Check if we are on the edit single post page
	 *
	 * @return void
	 */
	public function isSingle() {
		return $this->single;
	}

	/**
	 * Get single post
	 *
	 * @return void
	 */
	public function getPost() {
		return $this->post;
	}

	/**
	 * Check if the post exists
	 *
	 * @return boolean
	 */
	public function found() {
		if ( $this->post === false ) {
			return false;
		}

		return true;
	}
}
