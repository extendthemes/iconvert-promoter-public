<?php

namespace CSPromo\Core\Admin\Actions\Plugin\Setup;

use CSPromo\Core\DB\InstallTable;

class InstallListsTable extends InstallTable {

	/**
	 * tablename
	 *
	 * @var string
	 */
	public $tablename = 'promo_lists';

	/**
	 * Install the table
	 *
	 * @return void
	 */
	public function install() {
		// main sql create table
		$sql = "CREATE TABLE {$this->tablename} (
				`id` bigint(20) NOT NULL AUTO_INCREMENT,
                `name` varchar(100) NOT NULL,
                `subject` varchar(150) NULL,
                `description` text NOT NULL,
                `provider` varchar(150) NULL,
                `provider_list` varchar(150) NULL,
                `template_id` bigint(4) NOT NULL DEFAULT '0',
                `listtype` tinyint(4) NOT NULL DEFAULT '0',
                `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (id)
			) {$this->wpdb->get_charset_collate()};";

		$this->createTable( $sql );
	}
}
