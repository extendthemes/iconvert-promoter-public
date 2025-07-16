<?php

namespace CSPromo\Core\Admin\Actions\Plugin\Setup;

use CSPromo\Core\DB\InstallTable;

class InstallSubscribersProviderSyncTable extends InstallTable {

	/**
	 * tablename
	 *
	 * @var string
	 */
	public $tablename = 'promo_subscribers_provider_sync';

	/**
	 * Install the table
	 *
	 * @return void
	 */
	public function install() {
		// main sql create table

		$sync_sql = "CREATE TABLE {$this->tablename} (
				`id` bigint(20) NOT NULL AUTO_INCREMENT,
				`subscriber_id` bigint(20),
				`provider_name` varchar(320) NOT NULL,
				`provider_list` varchar(320) NOT NULL,
				PRIMARY KEY (id)
			) {$this->wpdb->get_charset_collate()};";

		$this->createTable( $sync_sql );
	}
}
