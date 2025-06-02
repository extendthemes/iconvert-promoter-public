<?php

namespace KPromo\Core;

use Exception;
use IlluminateAgnostic\Arr\Support\Arr;
use KPromo\Core\Background\Background;
use KPromo\Core\Blocks\BlockElement;
use KPromo\Core\GlobalElements\Icon;
use KPromo\Core\GlobalElements\LinkWrapper;
use KPromo\Core\Separators\Separators;
use KPromo\Core\StyleManager\StyleManager;

class Registry {


	private static $instance;

	private $registered = array();

	private $elementsByType = array(
		'background'     => Background::class,
		'separators'     => Separators::class,
		'element'        => BlockElement::class,
		'wp:InnerBlocks' => InnerBlocks::class,
		'LinkWrapper'    => LinkWrapper::class,
		'icon'           => Icon::class,
	);

	private $blocksStack      = array();
	private $lastBlocksByName = array();
	private $fonts            = array();
	// normal and bold should be here by defauly for inline text
	private $window_font_weights = array( '400', '700', '400italic', '700italic' );

	/**
	 * @param $block_dir
	 * @param $handle_class
	 * @param array $args
	 *
	 * @throws Exception
	 */
	static function registerBlock( $block_dir, $handle_class, $args = array() ) {

		$metadata_file = Arr::get( $args, 'metadata', 'block.json' );
		if ( ! file_exists( $metadata_file ) ) {
			$metadata_file = $block_dir . '/' . $metadata_file;
		}
		$block_json = wp_normalize_path( $metadata_file );

		$metadata = \KPromo\kubio_get_block_metadata_mixin( $block_json );

		if ( ! $metadata ) {
			// phpcs:ignore WordPress.Security.EscapeOutput.ExceptionNotEscaped
			throw new Exception( "KPromo register block missing metadata. Path: {$block_json}" );
		}

		$metadata_mixins = Arr::get( $args, 'metadata_mixins', array() );

		foreach ( $metadata_mixins as $mixin ) {
			$mixin_path = wp_normalize_path( "{$block_dir}/$mixin" );
			$mixin_data = \KPromo\kubio_get_block_metadata_mixin( $mixin_path );

			if ( ! $mixin_data ) {
				// phpcs:ignore WordPress.Security.EscapeOutput.ExceptionNotEscaped
				throw new Exception( "KPromo register block missing metadata mixin. Path: {$mixin_path}" );
			}

			$metadata = array_replace_recursive( $metadata, $mixin_data );

			$exact_replaces = Arr::get( $args, 'mixins_exact_replace', array() );

			if ( isset( $exact_replaces[ $mixin ] ) ) {
				foreach ( (array) $exact_replaces[ $mixin ] as $exact_replace ) {
					Arr::set( $metadata, $exact_replace, Arr::get( $mixin_data, $exact_replace ) );
				}
			}
		}
		$metadata = array_replace_recursive(
			$metadata,
			array(
				'supports' => array(
					'anchor'          => true,
					'customClassName' => true,
				),
			)
		);
		$metadata = apply_filters( Utils::getStringWithNamespacePrefix( 'kubio/blocks/register_block_type' ), $metadata );

		$block_name = Arr::get( $metadata, 'name', null );

		if ( ! $block_name ) {
			// phpcs:ignore WordPress.Security.EscapeOutput.ExceptionNotEscaped
			throw new Exception( "KPromo register block missing block name. Path: {$block_json}" );
		}

		self::getInstance()->registered[ $block_name ] = $handle_class;

		if ( \KPromo\kubio_can_register_block( $block_name ) ) {

			if ( did_action( 'init' ) ) {
				\KPromo\kubio_register_block_type_from_metadata_array(
					$metadata,
					array(
						'render_callback'   => Utils::getRootNamespace() . '\\kubio_render_block_callback',
						'skip_inner_blocks' => true,
						'editor_style'      => Utils::getPrefixedScriptName( 'block-library-editor' ),
						'style'             => Utils::getPrefixedScriptName( 'block-library' ),
					)
				);
			} else {
				add_action(
					'init',
					function () use ( $block_name, $metadata ) {
						\KPromo\kubio_register_block_type_from_metadata_array(
							$metadata,
							array(
								'render_callback'   => 'kubio_render_block_callback',
								'skip_inner_blocks' => true,
								'editor_style'      => Utils::getPrefixedScriptName( 'block-library-editor' ),
								'style'             => Utils::getPrefixedScriptName( 'block-library' ),
							)
						);
					},
					20
				);
			}
		}
	}

	static function getInstance() {
		if ( ! self::$instance ) {
			self::$instance = new self();
		}

		return self::$instance;
	}

	function getRenderedFonts() {
		$result = array();

		foreach ( $this->fonts as $font => $weights ) {
			$next_weights    = LodashBasic::uniq( array_merge( $weights, $this->window_font_weights ) );
			$result[ $font ] = $next_weights;
		}

		return $result;
	}

	function registerFonts( $familiesStr, $weight, $style = 'normal' ) {
		$families = explode( ',', $familiesStr );
		foreach ( $families as $family ) {
			$family = trim( $family );
			if ( $family ) {
				if ( ! isset( $this->fonts[ $family ] ) ) {
					$this->fonts[ $family ] = array();
				}

				if ( empty( $weight ) ) {
					$weight = '400';
				}

				$next_weights = array( strval( $weight ) );

				if ( $style === 'italic' ) {
					$next_weights[] = $weight . 'italic';
				}

				$this->fonts[ $family ] = LodashBasic::uniq(
					LodashBasic::concat(
						$this->fonts[ $family ],
						$next_weights
					)
				);

				StyleManager::getInstance()->registerFonts( $family, $next_weights );

			} else {
				if ( empty( $weight ) ) {
					$weight = '400';
				}

				$weight = strval( $weight );

				if ( $style === 'italic' ) {
					$weight . 'italic';
				}

				if ( ! in_array( $weight, $this->window_font_weights ) ) {
					$this->window_font_weights[] = $weight;
				}

				StyleManager::getInstance()->registerFonts( null, array( $weight ) );
			}
		}
	}


	function getBlock( $block, $context ) {
		$blockName = $block['blockName'];
		if ( isset( $this->registered[ $blockName ] ) ) {
			$class = $this->registered[ $blockName ];
			$block = new $class( $block, true, $context );

			return $block;
		}
	}

	function getParentBlock() {
		$count = count( $this->blocksStack );

		return $count > 1 ? $this->blocksStack[ $count - 2 ] : null;
	}

	function getLastBlock() {
		return Arr::last( $this->blocksStack, null, null );
	}

	function addBlockToStack( $block ) {
		$name = $block->block_type->name;
		if ( ! isset( $this->lastBlocksByName[ $name ] ) ) {
			$this->lastBlocksByName[ $name ] = array();
		}
		$this->lastBlocksByName[ $name ][] = $block;
		$this->blocksStack[]               = $block;
	}

	function removeBlockFromStack( $block ) {
		$name = $block->block_type->name;
		if ( isset( $this->lastBlocksByName[ $name ] ) ) {
			array_pop( $this->lastBlocksByName[ $name ] );
		}

		array_pop( $this->blocksStack );
	}

	function getLastKubioBlockOfName( $kubioBlock ) {
		$blockPrefix = Utils::getKubioBlockPrefix();
		if ( is_array( $kubioBlock ) ) {
			$map = array_map(
				function ( $block ) use ( $blockPrefix ) {
					return "{$blockPrefix}/$block";
				},
				$kubioBlock
			);

			return $this->getLastBlockOfName( $map );
		}

		$newName = "{$blockPrefix}/$kubioBlock";
		return $this->getLastBlockOfName( $newName );
	}

	function getLastBlockOfName( $blockName ) {
		$block_names = array();
		if ( ! is_array( $blockName ) ) {
			$block_names = array( $blockName );
		} else {
			$block_names = $blockName;
		}

		foreach ( $block_names as $blockName ) {
			if ( isset( $this->lastBlocksByName[ $blockName ] ) ) {
				$length = count( $this->lastBlocksByName[ $blockName ] );

				if ( $length - 1 < 0 ) {
					continue;
				}

				return $this->lastBlocksByName[ $blockName ][ $length - 1 ];
			}
		}

		return null;
	}

	function createElement( $type, $props = array(), $children = array(), $block = null ) {
		// $typeParts = explode(".", $type);
		$class = $this->getClassForType( $type );
		$tag   = Element::DIV;
		if ( is_string( $type ) && ! isset( $this->elementsByType[ $type ] ) ) {
			$tag = $type;
		}

		return new $class( $tag, $props, $children, $block );
	}

	function getClassForType( $type ) {
		$elementsByType = apply_filters(
			Utils::getStringWithNamespacePrefix( 'kubio/blocks/elements' ),
			$this->elementsByType
		);

		if ( ! isset( $elementsByType[ $type ] ) ) {
			return Element::class;
		}
		$constructor = $elementsByType[ $type ];
		if ( function_exists( $constructor ) ) {
			return call_user_func_array( $constructor, array() );
		} else {
			return $constructor;
		}
	}
}
