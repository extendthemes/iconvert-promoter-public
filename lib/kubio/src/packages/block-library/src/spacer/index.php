<?php

namespace KPromo\Blocks;

use KPromo\Core\Blocks\BlockBase;
use KPromo\Core\Registry;

class SpacerBlock extends BlockBase {


	const CONTAINER = 'container';
}

Registry::registerBlock( __DIR__, SpacerBlock::class );
