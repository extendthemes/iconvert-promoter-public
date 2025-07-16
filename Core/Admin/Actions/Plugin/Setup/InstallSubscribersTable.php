<?php

namespace CSPromo\Core\Admin\Actions\Plugin\Setup;

use CSPromo\Core\DB\InstallTable;

class InstallSubscribersTable extends InstallTable {

	/**
	 * tablename
	 *
	 * @var string
	 */
	public $tablename = 'promo_subscribers';

	/**
	 * Install the table
	 *
	 * @return void
	 */
	public function install() {
		// main sql create table

		$sql = "CREATE TABLE {$this->tablename} (
				`id` bigint(20) NOT NULL AUTO_INCREMENT,
                `email` varchar(320) NOT NULL,
                `name` varchar(320) NOT NULL,
                `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (id)
			) {$this->wpdb->get_charset_collate()};";

		$this->createTable( $sql );

		$subscribers_sync = new InstallSubscribersProviderSyncTable();
		$subscribers_sync->setup();

		// set foreign key in $subscribers_sync table the id of this table
		$sync_sql = "ALTER TABLE {$subscribers_sync->getTableName()}
						ADD FOREIGN KEY (subscriber_id) REFERENCES {$this->getTableName()}(id) ON DELETE CASCADE;";
		dbDelta( $sync_sql );
	}
}
