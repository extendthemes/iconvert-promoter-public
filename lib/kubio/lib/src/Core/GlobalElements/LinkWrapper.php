<?php

namespace KPromo\Core\GlobalElements;

use KPromo\Core\Blocks\BlockElement;
use KPromo\Core\Element;
use KPromo\Core\Utils;

class LinkWrapper extends BlockElement {


	public function __construct( $tag_name, $props = array(), $children = array(), $block = null ) {
		$linkObject     = $block->getLinkAttribute();
		$linkAttributes = Utils::getLinkAttributes( $linkObject );
		if ( $props && isset( $props['heading'] ) && $props['heading'] ) {
			$linkAttributes['className'] = 'd-block h-link';
		}
		$type = $linkObject && isset( $linkObject['value'] ) && $linkObject['value'] ? Element::A : Element::FRAGMENT;
		parent::__construct( $type, $linkAttributes, $children, $block );
	}

	public function __toString() {
		return parent::__toString();
	}
}
