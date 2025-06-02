<?php

namespace KPromo\Blocks;

use KPromo\Core\Blocks\BlockBase;
use KPromo\Core\Registry;
use KPromo\Core\StyleManager\DynamicStyles;

class YesNoInnerBlock extends BlockBase {
	const CONTAINER = 'container';
	const VSPACE    = 'v-space';

	public function mapPropsToElements() {

		return array(
			self::CONTAINER => array(
				'data-action-content' => $this->getAttribute( 'action' ),
			),
		);
	}

	public function mapDynamicStyleToElements() {
		$dynamicStyles                 = array();
		$spaceByMedia                  = $this->getPropByMedia(
			'vSpace',
			array()
		);
		$dynamicStyles[ self::VSPACE ] = DynamicStyles::vSpace( $spaceByMedia );

		return $dynamicStyles;
	}
}

Registry::registerBlock(
	__DIR__,
	YesNoInnerBlock::class
);
