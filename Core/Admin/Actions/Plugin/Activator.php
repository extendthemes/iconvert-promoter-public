<?php

namespace CSPromo\Core\Admin\Actions\Plugin;

use CSPromo\Core\Admin\Actions\Plugin\Setup\SeedListsTable;
use CSPromo\Core\Admin\Actions\Plugin\Setup\InstallListsTable;
use CSPromo\Core\Admin\Actions\Plugin\Setup\InstallStatsTable;
use CSPromo\Core\Admin\Actions\Plugin\Setup\InstallTemplatesTable;
use CSPromo\Core\Admin\Actions\Plugin\Setup\InstallSubscribersTable;
use CSPromo\Core\Admin\Actions\Plugin\Setup\InstallSubscriberListTable;

/**
 * Activate
 */
class Activator {
	/**
	 * install - Fired during plugin deactivation
	 *
	 * @return void
	 */
	public static function install() {
		//run this code on activation
		self::installTables();
	}

	/**
	 * Install the DB Tables
	 *
	 * @return void
	 */
	public static function installTables() {
		// contacts table
		$subscribers = new InstallSubscribersTable();
		$subscribers->setup();

		// lists table
		$lists = new InstallListsTable();
		$lists->setup();

			// insert the default list if it doesn't exist
			$defaultListSeeder = new SeedListsTable();
			$defaultListSeeder->run();

		// subscriber_list table
		$subscriberList = new InstallSubscriberListTable();
		$subscriberList->setup();

		// stats table
		$stats = new InstallStatsTable();
		$stats->setup();

		// templates table
		$templates = new InstallTemplatesTable();
		$templates->setup();
	}
}
