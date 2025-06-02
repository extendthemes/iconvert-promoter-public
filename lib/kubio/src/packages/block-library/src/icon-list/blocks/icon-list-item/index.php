<?php

namespace KPromo\Blocks;

use KPromo\Core\LodashBasic;
use KPromo\Core\Blocks\BlockBase;
use KPromo\Core\Registry;


class IconListItemBlock extends BlockBase {
	const ITEM        = 'item';
	const ICON        = 'icon';
	const LINK        = 'link';
	const TEXT        = 'text';
	const TEXTWRAPPER = 'text-wrapper';

	private $parent_block = null;

	public function __construct( $block, $autoload = true ) {

		parent::__construct( $block, $autoload );
	}

	public function mapPropsToElements() {
		$text               = $this->getBlockInnerHtml();
		$text               = preg_replace( '/\r?\n/', '<br/>', $text );
		$iconName           = $this->getAttribute( 'icon' );
		$parent_block       = Registry::getInstance()->getLastKubioBlockOfName( 'iconlist' );
		$wrapper            = new IconListBlock( $parent_block->block_data );
		$this->parent_block = $wrapper;
		return array(
			self::ICON        => array(
				'name' => $iconName,
			),
			self::TEXT        => array(
				'innerHTML' => $text,
			),
			self::TEXTWRAPPER => array(),
		);
	}

	public function computed() {
		$iconListBlock       = Registry::getInstance()->getLastKubioBlockOfName( 'iconlist' );
		$divider             = $iconListBlock->getProp( 'divider' );
		$listItems           = LodashBasic::get( $iconListBlock->block_data, 'innerBlocks', array() );
		$currentItemPosition = 0;
		foreach ( $listItems as $index => $item ) {
			$itemId    = LodashBasic::get( $item, array( 'attrs', 'kubio', 'hash' ) );
			$currentId = LodashBasic::get( $this->block_data, array( 'attrs', 'kubio', 'hash' ) );
			if ( $itemId && $currentId && $itemId === $currentId ) {
				$currentItemPosition = $index;
			}
		}

		$isFirstChild = $currentItemPosition === 0;
		$isLastChild  = $currentItemPosition === count( $listItems ) - 1;
		return array(
			'isFirstChild'   => $isFirstChild,
			'isLastChild'    => $isLastChild,
			'dividerEnabled' => $divider['enabled'],
		);
	}
}


Registry::registerBlock(
	__DIR__,
	IconListItemBlock::class
);
