<?php

namespace CSPromo\Core\Admin\Actions\Plugin\Setup;

use CSPromo\Core\DB\InstallTable;

class InstallTemplatesTable extends InstallTable {

	/**
	 * tablename
	 *
	 * @var string
	 */
	public $tablename = 'promo_templates';

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
                `description` text NOT NULL,
                `content` text NOT NULL,
                `image` varchar(200) NOT NULL,
                `popuptype` varchar(30) NOT NULL DEFAULT 'simple-popup',
                `order` tinyint(4) NOT NULL DEFAULT '1',
                `custom` tinyint(4) NOT NULL DEFAULT '0',
                `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (id)
			) {$this->wpdb->get_charset_collate()};";

		$this->createTable( $sql );
	}
}
