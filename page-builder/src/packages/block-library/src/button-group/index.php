<?php
namespace KPromo\Blocks;
use KPromo\Core\Registry;
use CsPromoKubio\Utils as CSPromoUtils;


class CsPromoButtonGroupBlock extends ButtonGroupBlock {
}

Registry::registerBlock(
	__DIR__,
	CsPromoButtonGroupBlock::class,
	array(
		'metadata'        => CSPromoUtils::getKubioBlockJsonPath( 'button-group' ),
		'metadata_mixins' => array( 'block.json' ),
	)
);
