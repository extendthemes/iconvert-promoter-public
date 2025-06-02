<?php

namespace KPromo\Blocks;

use KPromo\Core\Blocks\BlockBase;
use KPromo\Core\Registry;

/**
 * PromoPopupOverflowBlock: popup content container used to controll overflow
 */
class PromoPopupOverflowBlock extends BlockBase {


	const OUTER = 'outer';

	public function mapPropsToElements() {
		$scrollbarWidth = $this->getStyle( '--scrollbar-width.value', 10, array( 'styledComponent' => self::OUTER ) );
		return array(
			self::OUTER => array(
				'className' => '',
				'style'     => array(
					'--moz-scrollbar-width' => $scrollbarWidth < 10 ? 'thin' : 'auto',
				),
			),
		);
	}
}

Registry::registerBlock( __DIR__, PromoPopupOverflowBlock::class );
