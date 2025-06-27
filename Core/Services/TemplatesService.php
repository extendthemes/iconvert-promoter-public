<?php

namespace CSPromo\Core\Services;

use CSPromo\Core\Admin\Api\TemplatesApi;
use CSPromo\Core\Admin\Pages\Promos;
use CSPromo\Core\DB\BasicCrud;
use IlluminateAgnostic\Arr\Support\Arr;

class TemplatesService extends BasicCrud {

	protected $tablename   = 'promo_templates';
	private $promoSettings = array();
	private $separator     = '#';
	private $hasListID     = false;

	public function __construct( $promoSettings = array() ) {
		$this->promoSettings = $promoSettings;
		parent::__construct();
	}

	/**
	 * Get a list of records
	 *
	 * @return array
	 */
	public function getRecords( $popupType ) {
		$api     = new TemplatesApi();
		$records = $api->getTemplates( $popupType );

		$categories = array();

		$default_categories = array(
			'newsletter-subscribe' => __( 'Newsletter subscribe', 'iconvert-promoter' ),
			'lead-magnet'          => __( 'Lead magnet', 'iconvert-promoter' ),
			'coupon'               => __( 'Coupon', 'iconvert-promoter' ),
			'special-offer'        => __( 'Special offer', 'iconvert-promoter' ),
			'countdown'            => __( 'Countdown', 'iconvert-promoter' ),
			'reduce-abandonment'   => __( 'Reduce abandonment', 'iconvert-promoter' ),
			'announcement'         => __( 'Announcement', 'iconvert-promoter' ),
			'age-consent'          => __( 'Age consent', 'iconvert-promoter' ),
			'feedback'             => __( 'Feedback', 'iconvert-promoter' ),
			'refer-a-friend'       => __( 'Social sharing', 'iconvert-promoter' ),
			'image-video'          => __( 'Image / Video', 'iconvert-promoter' ),
		);

		foreach ( $default_categories as $slug => $label ) {
			$categories[ $slug ] = array(
				'label' => $label,
				'slug'  => $slug,
			);
		}

		return array(
			'records'    => $records,
			'total'      => count( $records ),
			'categories' => array_values( $categories ),
		);
	}

	/**
	 * getTemplate
	 *
	 * @param  mixed $templateId
	 * @return mixed
	 */
	public function getTemplate( $templateId ) {
		$api      = new TemplatesApi();
		$template = $api->getTemplate( $templateId );

		return $template;
	}

	public function parseContent( $content ) {
		return stripslashes( $content );
	}

	public function getBlankTemplate( $promoType ) {
		$record = $this->find(
			array(
				'popuptype' => $promoType,
				'custom'    => 0,
			)
		);

		if ( $record ) {
			return $record->content;
		}

		return '';
	}

	public function sanitizeContent( $content ) {

		$content = str_replace( 'var(u002du002d', 'var(--', $content );
		$content = str_replace( 'var(\\u002d\\u002d', 'var(--', $content );

		return stripslashes( $content );
	}

	public function importContent( $content, $postID, $setSettings = true ) {

		if ( ! function_exists( ICONVERTPR_KUBIO_NS . '\kubio_serialize_blocks' ) ) {
			return $content;
		}

		$blocks = $this->getBlocksFromContent( $content );

		if ( $setSettings ) {
			$blocks = $this->settingsBlockPopup( $blocks );
		}

		// newsletter block popupid reset
		$blocks = $this->resetBlockPopupID( $blocks, $postID );
		$blocks = $this->resetBlockDefaults( $blocks );
		$blocks = $this->resetStyleRef( $blocks, $postID );

		$blocks = call_user_func( ICONVERTPR_KUBIO_NS . '\kubio_serialize_blocks', $blocks );

		return $blocks;
	}

	public function getBlocksFromContent( $content ) {
		$blocks = parse_blocks( $this->sanitizeContent( $content ) );
		return call_user_func( ICONVERTPR_KUBIO_NS . '\Core\Importer::maybeImportBlockAssets', $blocks );
	}

	public function settingsBlockPopup( $blocks ) {
		$filterBlocks = array( 'kubio/promopopup', 'cspromo/promopopup' );

		foreach ( $blocks as &$block ) {
			if ( in_array( $block['blockName'], $filterBlocks ) ) {
				$block['attrs']['popup_type'] = $this->promoSettings['promoType'];
				$block['attrs']               = $this->parseBlockSettings( $block['attrs'] );

				Arr::forget( $block['attrs'], 'kubio.style.descendants.container.minHeight' );
			}

			if ( isset( $block['innerBlocks'] ) && ! empty( $block['innerBlocks'] ) ) {
				$block['innerBlocks'] = $this->settingsBlockPopup( $block['innerBlocks'] );
			}
		}
		return $blocks;
	}

	public function parseBlockSettings( $attrs ) {
		switch ( $this->promoSettings['promoType'] ) {
			case 'floating-bar':
				$attrs = $this->parseFloatingBarSettings( $attrs );
				break;

			case 'inline-promotion-bar':
				$attrs = $this->parseGenericBlockSettings( $attrs );
				break;
			default:
				$attrs = $this->parseGenericBlockSettings( $attrs );
				break;
		}

		return $attrs;
	}


	private function maybeSetAnimations( $attrs ) {

		$animation_in  = isset( $this->promoSettings['animationIn'] ) ? $this->promoSettings['animationIn'] : '';
		$animation_out = isset( $this->promoSettings['animationOut'] ) ? $this->promoSettings['animationOut'] : '';

		if ( empty( $animation_in ) ) {
			$attrs['showNotice']['effectActive'] = '';
		} else {
			$normalized                                 = Promos::normalize_animation_class( $animation_in );
			$attrs['showNotice']['effectActive']        = $normalized['type'];
			$attrs['showNotice'][ $normalized['type'] ] = $normalized['effect'];
		}

		if ( empty( $animation_out ) ) {
			$attrs['hideNotice']['effectActive'] = '';
		} else {
			$normalized                                 = Promos::normalize_animation_class( $animation_out );
			$attrs['hideNotice']['effectActive']        = $normalized['type'];
			$attrs['hideNotice'][ $normalized['type'] ] = $normalized['effect'];

		}

		if ( isset( $this->promoSettings['animationDuration'] ) ) {
			Arr::set( $attrs, 'kubio.style.descendants.container.animation.duration.value', floatval( $this->promoSettings['animationDuration'] ) );
		}

		return $attrs;
	}

	public function parseGenericBlockSettings( $attrs ) {
		$position = isset( $this->promoSettings['position'] ) ? $this->promoSettings['position'] : 'center#center';

		if ( strpos( $position, $this->separator ) === false ) {
			$position = $this->promoSettings['position'] . $this->separator . 'center';
		}

		list($verticalAlign, $horizontalAlign) = explode( $this->separator, $position );

		if ( $this->promoSettings['promoType'] === 'fullscreen-mat' ) {
			$verticalAlign   = 'center';
			$horizontalAlign = 'center';
		}

		$attrs['align']  = $verticalAlign;
		$attrs['alignH'] = $horizontalAlign;

		$attrs = $this->maybeSetAnimations( $attrs );

		return $attrs;
	}

	public function parseFloatingBarSettings( $attrs ) {
		if ( isset( $this->promoSettings['position'] ) ) {
			$attrs['align'] = $this->promoSettings['position'];
		}

		if ( isset( $this->promoSettings['contentPosition'] ) ) {
			$attrs['contentPosition'] = $this->promoSettings['contentPosition'];
		}

		$attrs = $this->maybeSetAnimations( $attrs );

		return $attrs;
	}

	public function resetStyleRef( $blocks, $post_id ) {
		$block_index = 1;
		$mapping     = array();

		call_user_func_array(
			ICONVERTPR_KUBIO_NS . '\Core\Utils::walkBlocks',
			array(
				&$blocks,
				function ( &$block ) use ( $post_id, &$block_index, &$mapping ) {
					$style_ref = Arr::get( $block, 'attrs.kubio.styleRef' );
					$next_ref = "cs-{$post_id}-{$block_index}";

					if ( $style_ref && isset( $mapping[ $style_ref ] ) ) {
						$next_ref = $mapping[ $style_ref ];
					}

					Arr::set( $block, 'attrs.kubio.styleRef', $next_ref );
					$mapping[ $style_ref ] = $next_ref;

					Arr::set( $block, 'attrs.kubio.hash', "cs-l-{$post_id}-{$block_index}" );
					$block_index++;
				},
			)
		);

		return $blocks;
	}

	/**
	 * resetBlockPopupID
	 *
	 * @param  array $blocks
	 * @return array
	 */
	public function resetBlockPopupID( $blocks, $blockID ) {
		// return $blocks;
		$filterBlocks = array( 'kubio/subscribe', 'kubio/promopopup', 'cspromo/subscribe', 'cspromo/promopopup' );
		foreach ( $blocks as &$block ) {
			if ( in_array( $block['blockName'], $filterBlocks ) ) {
				$block['attrs']['popup_id'] = $blockID;
			}

			if ( in_array( $block['blockName'], array( $filterBlocks[0], $filterBlocks[2] ) ) ) {
				$emailServices            = new EmailListsService();
				$block['attrs']['formId'] = $emailServices->getDefaultListID();
			}

			if ( isset( $block['innerBlocks'] ) && ! empty( $block['innerBlocks'] ) ) {
				$block['innerBlocks'] = $this->resetBlockPopupID( $block['innerBlocks'], $blockID );
			}
		}

		return $blocks;
	}

	public function resetBlockDefaults( $blocks ) {
		$filterBlocks = array( 'kubio/countdown', 'cspromo/countdown' );

		foreach ( $blocks as &$block ) {
			if ( in_array( $block['blockName'], $filterBlocks ) ) {
				$newDate = strtotime( '+7 day' );

				if ( isset( $block['attrs']['cdDateTime'] ) ) {
					$block['attrs']['cdDateTime'] = gmdate( 'Y-m-d\T00:00:00', $newDate );
					$defaultTimezone              = ini_get( 'date.timezone' );
					if ( empty( $defaultTimezone ) ) {
						$defaultTimezone = 'Europe/London';
					}
					$block['attrs']['utcZone'] = $defaultTimezone;
				}
			}

			if ( $block['blockName'] === 'cspromo/heading' ) {
				$fancy = Arr::get( $block, 'attrs.kubio.props.fancy.fancyRotatingWords', false );

				if ( $fancy === 'awesomenamazingnimpressive' ) {
					Arr::set( $block, 'attrs.kubio.props.fancy.fancyRotatingWords', "awesome\namazing\nimpressive" );
				}
			}

			if ( isset( $block['innerBlocks'] ) ) {
				$block['innerBlocks'] = $this->resetBlockDefaults( $block['innerBlocks'] );
			}
		}

		return $blocks;
	}


	public function hasListID( $content, $listID ) {
		if ( ! function_exists( ICONVERTPR_KUBIO_NS . '\kubio_serialize_blocks' ) ) {
			return $content;
		}
		$this->hasListID = false;
		$blocks          = $this->getBlocksFromContent( $content );

		$this->contentHasListID( $blocks, $listID );
		return $this->hasListID;
	}

	public function contentHasListID( $blocks, $listID, $hasIt = false ) {
		$filterBlocks = array( 'kubio/subscribe', 'cspromo/subscribe' );

		if ( $this->hasListID == true ) {
			return true;
		}

		foreach ( $blocks as &$block ) {
			if ( in_array( $block['blockName'], $filterBlocks ) && isset( $block['attrs']['formId'] ) && $block['attrs']['formId'] == $listID ) {
				$this->hasListID = true;
			}

			if ( isset( $block['innerBlocks'] ) ) {
				$this->contentHasListID( $block['innerBlocks'], $listID, $hasIt );
			}
		}

		return false;
	}
}
