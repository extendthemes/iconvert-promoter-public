<?php

namespace KPromo\Blocks;

use KPromo\Core\Blocks\BlockBase;
use KPromo\Core\Registry;
use KPromo\Core\StyleManager\DynamicStyles;

class LinkGroupBlock extends BlockBase {

	const OUTER         = 'outer';
	const SPACING       = 'spacing';
	const H_SPACE       = 'hspace';
	const H_SPACE_GROUP = 'hSpaceGroup';

	public function __construct( $block, $autoload = true ) {
		parent::__construct( $block, $autoload );
	}

	public function mapDynamicStyleToElements() {
		$dynamicStyles                        = array();
		$spaceByMedia                         = $this->getPropByMedia(
			'layout.hSpace',
			array()
		);
		$dynamicStyles[ self::H_SPACE ]       = DynamicStyles::hSpace( $spaceByMedia );
		$dynamicStyles[ self::H_SPACE_GROUP ] = DynamicStyles::hSpaceParent( $spaceByMedia );
		return $dynamicStyles;
	}

	public function mapPropsToElements() {
		return array();
	}
}

Registry::registerBlock( __DIR__, LinkGroupBlock::class );
