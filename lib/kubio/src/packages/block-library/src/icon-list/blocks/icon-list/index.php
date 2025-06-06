<?php

namespace KPromo\Blocks;

use KPromo\Core\Blocks\BlockBase;
use KPromo\Core\Registry;

class IconListBlock extends BlockBase {
	const OUTER = 'outer';

	public function mapPropsToElements() {
		$listLayoutByMedia = $this->getStyleByMedia( 'flexDirection', null, array( 'styledComponent' => 'outer' ) );
		$layoutMapper      = array(
			'column' => 'vertical',
			'row'    => 'horizontal',
		);
		$layoutClasses     = array();
		foreach ( $listLayoutByMedia as $media => $listLayout ) {
			$direction       = $layoutMapper[ $listLayout ];
			$layoutClasses[] = sprintf( 'list-type-%s-on-%s', $direction, $media );
		}
		return array(
			self::OUTER => array(
				'className' => $layoutClasses,
			),
		);
	}
}

Registry::registerBlock(
	__DIR__,
	IconListBlock::class
);
