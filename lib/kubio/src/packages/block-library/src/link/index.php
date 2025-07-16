<?php

namespace KPromo\Blocks;
use KPromo\Core\Blocks\BlockBase;
use KPromo\Core\Registry;
use KPromo\Core\Utils;

class LinkBlock extends BlockBase {
	const OUTER = 'outer';
	const LINK  = 'link';
	const TEXT  = 'text';
	const ICON  = 'icon';

	public function computed() {
		$iconEnabled    = $this->getProp( 'showIcon', false );
		$iconPosition   = $this->getProp( 'iconPosition', 'before' );
		$showBeforeIcon = $iconEnabled && $iconPosition == 'before';
		$showAfterIcon  = $iconEnabled && $iconPosition == 'after';
		return array(
			'showBeforeIcon' => $showBeforeIcon,
			'showAfterIcon'  => $showAfterIcon,
		);
	}

	public function mapPropsToElements() {
		$link = $this->getAttribute( 'link' );
		$type = $this->getAttribute( 'link.typeOpenLink' );

		$linkAttributes = Utils::getLinkAttributes( $link );

		if ( $type === 'lightbox' ) {
			$linkAttributes['data-type'] = $this->getAttribute( 'link.lightboxMedia' );
		}

		$iconName = $this->getAttribute( 'icon.name' );
		$text     = $this->getBlockInnerHtml();
		return array(
			self::LINK => $linkAttributes,

			self::ICON => array(
				'name' => $iconName,
			),

			self::TEXT => array(
				'innerHTML' => $text,
			),
		);
	}
}

Registry::registerBlock( __DIR__, LinkBlock::class );
