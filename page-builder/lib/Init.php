<?php


namespace CsPromoKubio;

class Init {

	private static $instance;

	static $builderEntryFile;

	protected function __construct() {
		Constants::load( static::$builderEntryFile );
		$this->bootstrap();
	}

	public function bootstrap() {
		if ( Utils::isFreeAndHasProActive() ) {
			return;
		}

		BeforeKubioFilters::load();
		KubioLoader::getInstance()->loadKubio();
		Filters::load();
		// Activation::load();
		KubioEditor::load();
		EditorAssets::load();
		GlobalData::load();

		Woocommerce::load();
	}

	public static function load( $builderEntryFile ) {
		static::$builderEntryFile = $builderEntryFile;
		return self::getInstance();
	}

	public static function getInstance() {
		if ( ! self::$instance ) {

			self::$instance = new self();
		}

		return self::$instance;
	}
}
