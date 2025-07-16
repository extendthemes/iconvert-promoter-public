<?php

namespace CSPromo\Core\Admin\Actions\Plugin\Setup;

use CSPromo\Core\DB\InstallTable;

class InstallStatsTable extends InstallTable {

	/**
	 * tablename
	 *
	 * @var string
	 */
	public $tablename = 'promo_stats';

	/**
	 * Install the table
	 *
	 * @return void
	 */
	public function install() {
		// main sql create table
		$sql = "CREATE TABLE {$this->tablename} (
				`post_id` BIGINT NOT NULL,
				`day` DATE NOT NULL,
				`event` VARCHAR(50) NOT NULL DEFAULT '',
				`identifier` VARCHAR(150) NOT NULL DEFAULT '',
				`hits` BIGINT NULL DEFAULT 0,
				PRIMARY KEY (`post_id`, `day`, `event`, `identifier`)
			) {$this->wpdb->get_charset_collate()};";

		$this->createTable( $sql );
	}
}
