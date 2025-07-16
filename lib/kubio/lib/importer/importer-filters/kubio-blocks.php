<?php

namespace KPromo;

use IlluminateAgnostic\Arr\Support\Arr;
use KPromo\Core\Importer;
use KPromo\Core\Utils;


/**
 * @param WP_Block_Parser_Block $block
 */
function kubio_maybe_import_background_assets( $block ) {
	$kubio_attr = Arr::get( $block->attrs, 'kubio', array() );

	if ( Utils::isKubioBlock( $block ) && ! empty( $kubio_attr ) ) {
		array_walk_recursive(
			$kubio_attr,
			function ( &$value ) {

				if ( Importer::isValidURLORHasKubioPlaceholder( $value ) ) {

					$imported = Importer::importRemoteFile( $value );

					if ( $imported ) {
						$value = $imported['url'];
					}
				}
			}
		);
		// put back the kubio attr
		Arr::set( $block->attrs, 'kubio', $kubio_attr );
	}

	return $block;
}

add_filter( Utils::getStringWithNamespacePrefix( 'kubio/importer/maybe_import_block_assets' ), __NAMESPACE__ . '\\kubio_maybe_import_background_assets', 10 );
