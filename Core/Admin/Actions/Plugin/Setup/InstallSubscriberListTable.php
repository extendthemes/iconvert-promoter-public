<?php

namespace CSPromo\Core\Admin\Actions\Plugin\Setup;

use CSPromo\Core\DB\InstallTable;
use CSPromo\Core\Admin\Actions\Plugin\Setup\InstallListsTable;
use CSPromo\Core\Admin\Actions\Plugin\Setup\InstallSubscribersTable;

class InstallSubscriberListTable extends InstallTable {

	/**
	 * tablename
	 *
	 * @var string
	 */
	public $tablename = 'promo_subscriber_list';

	/**
	 * Install the table
	 *
	 * @return void
	 */
	public function install() {
		$subscribers = new InstallSubscribersTable();
		$lists       = new InstallListsTable();

		// main sql create table
		$sql = "CREATE TABLE {$this->tablename} (
				`subscriber_id` bigint(20) NOT NULL,
                `list_id` bigint(20) NOT NULL,
                FOREIGN KEY (subscriber_id) REFERENCES {$subscribers->tablename}(id) ON DELETE CASCADE,
                FOREIGN KEY (list_id) REFERENCES {$lists->tablename}(id) ON DELETE CASCADE
			) {$this->wpdb->get_charset_collate()};";

		$this->createTable( $sql );
	}
}
