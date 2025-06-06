<?php

namespace KPromo\Blocks;
use KPromo\Core\Blocks\BlockBase;
use KPromo\Core\Registry;

class TextBlock extends BlockBase {

	const TEXT = 'text';

	public function mapPropsToElements() {
		$content = $this->getBlockInnerHtml();
		$isLead  = $this->getProp( 'isLead' );
		$dropCap = $this->getProp( 'dropCap' );
		$classes = array();
		if ( $isLead ) {
			$classes[] = 'h-lead';
		}
		if ( $dropCap ) {
			$classes[] = 'has-drop-cap';
		}
		return array(
			self::TEXT => array(
				'className' => $classes,
				'innerHTML' => $content,
			),
		);
	}
}


Registry::registerBlock( __DIR__, TextBlock::class );
