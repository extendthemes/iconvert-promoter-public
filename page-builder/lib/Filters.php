<?php

namespace CsPromoKubio;


use KPromo\Core\LodashBasic;
use KPromo\Core\Utils as KubioUtils;

class Filters {

	private static $instance;


	protected function __construct() {
		add_action( 'init', array( $this, 'enqueueFrontendScripts' ) );
		add_action( 'init', array( $this, 'kubioRegisterBlockTypes' ), 9 );
		add_filter( KubioUtils::getStringWithNamespacePrefix( 'kubio/kubio_block_categories/add_kubio_prefix' ), array( $this, 'getKubioCategoriesAddPrefix' ) );
		add_filter( KubioUtils::getStringWithNamespacePrefix( 'kubio/kubio_get_block_metadata_mixin/metadata' ), array( $this, 'getBlockMixinMetadata' ) );
		add_filter( KubioUtils::getStringWithNamespacePrefix( 'kubio/kubio_block_prefix' ), array( $this, 'getKubioBlockPrefix' ) );
		add_filter( KubioUtils::getStringWithNamespacePrefix( 'kubio/preview/context_part_blocks' ), array( $this, 'getPreviewContextPartBlocks' ) );
		add_filter( KubioUtils::getStringWithNamespacePrefix( 'kubio/StyleRender/prefixSelectorsByType' ), array( $this, 'getStyleRendererPrefixSelectorsByType' ) );

		add_filter( KubioUtils::getStringWithNamespacePrefix( 'kubio/BLockBase/localId' ), array( $this, 'getKubioBlockLocalId' ) );

		add_filter( KubioUtils::getStringWithNamespacePrefix( 'kubio/kubio_register_packages_styles/before_register' ), array( $this, 'removeKubioStyles' ) );
		add_filter( KubioUtils::getStringWithNamespacePrefix( 'kubio/getKubioBlockPrefix' ), array( $this, 'getKubioBlockPrefix' ) );

		add_filter( KubioUtils::getStringWithNamespacePrefix( 'kubio/get_site_urls' ), array( $this, 'getSiteUrls' ) );
	}

	public function getSiteUrls() {

		$args = array(
			'utm_theme'      => get_template(),
			'utm_childtheme' => get_stylesheet(),

		);

		return array(
			'homepage_url'      => 'https://iconvertpromoter.com',
			'features_url'      => 'https://iconvertpromoter.com',
			'upgrade_url'       => add_query_arg( $args, 'https://iconvertpromoter.com' ),
			'try_starter_site'  => add_query_arg( $args, 'https://iconvertpromoter.com' ),
			'documentation_url' => add_query_arg( $args, 'https://iconvertpromoter.com' ),
			'contact_url'       => add_query_arg( $args, 'https://iconvertpromoter.com/#contact' ),
		);
	}


	//in case you want to remove some styles from different kubio packages. All you need to do is specify in the scriptsToRemove
	public function removeKubioStyles( $registered ) {
		$stylesToRemove = array(
			//KubioUtils::getPrefixedScriptName('editor'),
			KubioUtils::getPrefixedScriptName( 'block-library' ),
			KubioUtils::getPrefixedScriptName( 'block-library-editor' ),
		);
		return Utils::removeKubioDependency( $registered, $stylesToRemove );
	}

	public function getKubioBlockLocalId( $localId ) {
		$prefix = Config::$prefix;
		return "$prefix-$localId";
	}

	public function getStyleRendererPrefixSelectorsByType( $prefixSelectorsByType ) {
		return Utils::getStyleRendererPrefixSelectorsByType();
	}

	public function getPreviewContextPartBlocks( $blocks ) {

		$blocks[] = 'cspromo/promopopup';
		return $blocks;
	}

	public function getKubioBlockPrefix() {
		return Config::$prefix;
	}
	/**
	 * Converts kubio prefix to plugin prefix for each kubio block
	 * @param $metadata
	 * @return mixed
	 */
	public function getBlockMixinMetadata( $metadata ) {
		$name = LodashBasic::get( $metadata, 'name' );
		if ( ! $name ) {
			return $metadata;
		}

		$parts = explode( '/', $name );
		if ( count( $parts ) !== 2 ) {
			return $metadata;
		}

		$package   = $parts[0];
		$blockName = $parts[1];
		if ( $package === 'kubio' ) {
			$metadata['name'] = Config::$prefix . '/' . $blockName;
		}

		return $metadata;
	}

	public function getKubioCategoriesAddPrefix() {
		return false;
	}

	public static function getKubioPluginName() {
		return Utils::getPluginBaseName();
	}


	public function enqueueFrontendScripts() {
		\KPromo\kubio_register_frontend_style( Utils::getPrefixedScriptName( 'block-library' ) );
	}

	//register php files from build
	public function kubioRegisterBlockTypes() {
		\KPromo\kubio_register_block_types( Constants::$builderDir );
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
