<?php

namespace CsPromoKubio;

use KPromo\Core\Utils as KubioUtils;

class KubioEditor {


	private static $instance;

	protected function __construct() {
		$this->addFilters();
	}

	public function addFilters() {
		add_action( 'admin_menu', array( $this, 'addMenuPage' ) );
		$this->addFiltersForEditor();
	}

	public function addFiltersForEditor() {
		if ( ! Utils::isKubioChildEditorPage() ) {
			return;
		}
		add_action( KubioUtils::getStringWithNamespacePrefix( 'kubio/editor/enqueue_assets_before' ), array( $this, 'enqueueEditorAssets' ) );
		add_action( 'enqueue_block_editor_assets', array( $this, 'enqueueBlockEditorAssets' ) );
		add_filter( KubioUtils::getStringWithNamespacePrefix( 'kubio/editor/settings' ), array( $this, 'filterEditorSettings' ) );
		add_action( KubioUtils::getStringWithNamespacePrefix( 'kubio/kubio_edit_site_init/editor_ready_script_prefix' ), array( $this, 'getEditorReadyScriptPrefix' ) );
		add_action( KubioUtils::getStringWithNamespacePrefix( 'kubio/kubio_edit_site_init/editor_ready_script_entry_point_class' ), array( $this, 'getEditorEntryPointClass' ) );
	}

	public function filterEditorSettings( $settings ) {
		$settings['styles'] = array();
		return $settings;
	}

	public function enqueueBlockEditorAssets() {
		wp_enqueue_style( Utils::getPrefixedScriptName( 'block-library-editor' ) );
	}


	public function enqueueEditorAssets() {
		wp_enqueue_script( Utils::getPrefixedScriptName( 'filters' ) );
		wp_enqueue_script( Utils::getPrefixedScriptName( 'controls' ) );
		wp_enqueue_script( Utils::getPrefixedScriptName( 'block-library' ) );
		wp_enqueue_script( Utils::getPrefixedScriptName( 'editor' ) );
		wp_enqueue_script( Utils::getPrefixedScriptName( 'utils' ) );

		wp_enqueue_style( Utils::getPrefixedScriptName( 'controls' ) );
		wp_enqueue_style( Utils::getPrefixedScriptName( 'block-library' ) );
		wp_enqueue_style( Utils::getPrefixedScriptName( 'editor' ) );
	}

	public function getEditorReadyScriptPrefix() {
		return Config::$prefix;
	}

	public function getEditorEntryPointClass() {
		return Utils::getPrefixedScriptName( 'editor' );
	}

	public function renderBlockEditor() {
		add_filter( KubioUtils::getStringWithNamespacePrefix( 'kubio/kubio_edit_site_render_block_editor/editor_entry_point_class' ), array( $this, 'getEditorEntryPointClass' ) );
		\KPromo\kubio_edit_site_render_block_editor( array( 'url' => ICONVERTPR_URL . 'page-builder/static/optrix-iframe-loader.html' ) );
	}

	public function addMenuPage() {
		\add_submenu_page(
			ICONVERTPR_PAGE_ID . '-editor',
			Config::$builderLabel,
			Config::$builderLabel,
			'edit_posts',
			Constants::$adminPageName,
			array( $this, 'renderBlockEditor' ),
			70
		);
	}


	public static function getInstance() {
		if ( ! self::$instance ) {

			self::$instance = new self();
		}

		return self::$instance;
	}

	public static function load() {
		return self::getInstance();
	}
}
