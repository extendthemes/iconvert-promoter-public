<?php

namespace CSPromo\Core\Admin\Actions\Plugin\Setup;

use CSPromo\Core\Services\EmailListsService;

class SeedListsTable {
	/**
	 * Insert the values into the DB
	 *
	 * @return void
	 */
	public function run() {
		$items = array(
			array(
				'id'       => 1,
				'name'     => __( 'Default email list', 'iconvert-promoter' ),
				'listtype' => 1,
			),
		);

		$templates = new EmailListsService();

		foreach ( $items as $item ) {
			$templates->shouldCreate(
				$item,
				array(
					'id'       => $item['id'],
					'listtype' => $item['listtype'],
				)
			);
		}
	}
}
