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
		add_action( 'admin_head', array( $this, 'addMenuStyle' ) );
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
		\KPromo\kubio_edit_site_render_block_editor( array( 'url' => IC_PROMO_URL . 'page-builder/static/optrix-iframe-loader.html' ) );
	}

	public function addMenuPage() {
		\add_menu_page(
			Config::$builderLabel,
			sprintf(
				'<span class="kubio-menu-item"><span class="kubio-menu-item--icon">%s</span><span>%s</span></span>',
				wp_kses_post( \KPromo\KUBIO_LOGO_SVG ),
				Config::$builderLabel
			),
			'edit_posts',
			Constants::$adminPageName,
			array( $this, 'renderBlockEditor' ),
			'data:image/svg+xml;base64,' . base64_encode( str_replace( '<svg', '<svg fill="#5246F1" ', \KPromo\KUBIO_LOGO_SVG ) ),
			70
		);
	}

	public function addMenuStyle() {
		$adminPageClass = sprintf( '.toplevel_page_%s', Constants::$adminPageName );
		?>
		<style>
			#adminmenu <?php echo esc_html( $adminPageClass ); ?> {
				display: none;
			}
		</style>
		<?php
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
