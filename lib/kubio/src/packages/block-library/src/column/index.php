<?php

namespace KPromo\Blocks;

use KPromo\Core\Blocks\BlockContainerBase;
use KPromo\Core\Layout\LayoutHelper;
use KPromo\Core\LodashBasic;
use KPromo\Core\Registry;
use KPromo\Core\StyleManager\DynamicStyles;

class ColumnBlock extends BlockContainerBase {


	const CONTAINER = 'container';
	const INNER     = 'inner';
	const ALIGN     = 'align';
	const VSPACE    = 'v-space';


	public function mapDynamicStyleToElements() {
		$dynamicStyles                 = array();
		$spaceByMedia                  = $this->getPropByMedia(
			'layout.vSpace',
			array()
		);
		$dynamicStyles[ self::VSPACE ] = DynamicStyles::vSpace( $spaceByMedia );
		return $dynamicStyles;
	}

	public function mapPropsToElements() {
		$row_block = Registry::getInstance()->getLastKubioBlockOfName( 'row' );

		$columnWidthByMedia = $this->getStyleByMedia(
			'columnWidth',
			array(),
			array(
				'styledComponent' => self::CONTAINER,
				'local'           => true,
			)
		);

		$layoutByMedia    = $this->getPropByMedia( 'layout' );
		$rowLayoutByMedia = $row_block->getPropByMedia( 'layout' );

		$columnWidth  = $columnWidthByMedia['desktop'];
		$layoutHelper = new LayoutHelper( $layoutByMedia, $rowLayoutByMedia );

		$container_cls = LodashBasic::concat(
			$layoutHelper->getColumnLayoutClasses( $columnWidthByMedia ),
			$layoutHelper->getInheritedColumnVAlignClasses()
		);

		$equalWidth = LodashBasic::get( $rowLayoutByMedia, 'desktop.equalWidth', false );

		$align_cls = LodashBasic::concat(
			$layoutHelper->getColumnContentFlexBasis( $equalWidth, $columnWidth ),
			$layoutHelper->getSelfVAlignClasses()
		);

		$inner = $layoutHelper->getColumnInnerGapsClasses();

		$map                    = array();
		$map[ self::CONTAINER ] = array( 'className' => $container_cls );
		$map[ self::INNER ]     = array( 'className' => $inner );
		$map[ self::ALIGN ]     = array( 'className' => $align_cls );
		return $map;
	}
}

Registry::registerBlock(
	__DIR__,
	ColumnBlock::class
);
