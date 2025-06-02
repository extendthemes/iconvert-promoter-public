<?php

namespace KPromo\Blocks;

use KPromo\Core\Blocks\BlockBase;
use KPromo\Core\Registry;
use KPromo\Core\Styles\FlexAlign;

/**
 * PromoPopupCloseBlock The popup navigation: CLOSE
 */
class PromoPopupCloseBlock extends BlockBase {

	const OUTER = 'outer';
	const INNER = 'inner';
	const ICON  = 'icon';

	public function __construct( $block, $autoload = true ) {
		parent::__construct( $block, $autoload );
	}

	public function computed() {
		$parent_block = Registry::getInstance()->getLastBlockOfName( array( 'cspromo/promopopup' ) );

		if ( null !== $parent_block ) {
			return array( 'closeButtonEnabled' => true );
		} else {
			return array( 'closeButtonEnabled' => false );
		}
	}

	public function mapPropsToElements() {
		$direction = $this->getAttribute( 'direction' );

		$verticalAlignByMedia = $this->getPropByMedia( 'verticalAlign' );
		$verticalAlignClasses = FlexAlign::getVAlignClasses( $verticalAlignByMedia, array( 'self' => false ) );

		$horizontalAlignByMedia = $this->getPropByMedia( 'horizontalAlign' );
		$horizontalAlignClasses = FlexAlign::getHAlignClasses( $horizontalAlignByMedia, array( 'self' => false ) );

		return array(
			self::OUTER => array( 'className' => implode( ' ', array_merge( $verticalAlignClasses, $horizontalAlignClasses ) ) ),
			self::INNER => array(
				'className' => 'cs-popup-close',
			),
		);
	}
}


Registry::registerBlock( __DIR__, PromoPopupCloseBlock::class );
