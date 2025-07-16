<?php
namespace CSPromo\Core\PostTypes;

class PromoPopupTemplate {
	private static $instance;
	private $templateSlug;

	public function __construct() {
		$this->templateSlug = 'single-' . PromoPopups::getSlug();
		$this->addFilters();

		do_action( 'iconvertpr_loaded', $this->templateSlug );
	}

	public function addFilters() {
		add_filter( call_user_func( ICONVERTPR_KUBIO_NS . '\Core\Utils::getStringWithNamespacePrefix', 'kubio/importer/available_templates' ), array( $this, 'getPromoPopupTemplate' ), 11 );
		add_filter( call_user_func( ICONVERTPR_KUBIO_NS . '\Core\Utils::getStringWithNamespacePrefix', 'kubio/importer/content' ), array( $this, 'getPromoTemplateContent' ), 10, 3 );
	}

	public function getPromoPopupTemplate( $current_templates = array() ) {
		$current_templates[ $this->templateSlug ] = null;

		return $current_templates;
	}

	public function getPromoTemplateContent( $content, $type, $slug ) {
		if ( $slug !== $this->templateSlug ) {
			return $content;
		}

		$templateContent = iconvertpr_import_template_contents( 'custom-post-type-template' );

		return $templateContent;
	}




	public static function load() {
		if ( ! self::$instance ) {
			self::$instance = new self();
		}

		return self::$instance;
	}
}
