<?php


namespace CsPromoKubio\Core;

use CsPromoKubio\Config;
use CsPromoKubio\Constants;
use KPromo\Core\Importer;

class Template {

	private static $instance;



	public function __construct() {
		add_action( 'admin_init', array( $this, 'importTemplates' ) );
	}

	public function getTemplates() {
		$templates      = array();
		$templatesFiles = \glob( Constants::$builderDir . '/defaults/templates/*' );
		foreach ( $templatesFiles as $templateFile ) {
			if ( ! \is_file( $templateFile ) ) {
				continue;
			}
			$templateContent        = \file_get_contents( $templateFile );
			$slugParts              = \explode( '/', $templateFile );
			$fileName               = $slugParts[ \count( $slugParts ) - 1 ];
			$slugName               = \explode( '.', $fileName )[0];
			$templates[ $slugName ] = $templateContent;
		}
		return $templates;
	}


	public function importTemplates() {
		$templates = $this->getTemplates();
		foreach ( $templates as $slug => $templateContent ) {
			//the single cs promo template is only needed for using the post content. So any changes to the template
			//should not remain.
			$overrideTemplate = $slug === Config::$singleTemplateSlug;
			Importer::createTemplate( $slug, $templateContent, $overrideTemplate, Config::$prefix, false, Config::$prefix );
		}
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
