<?php

namespace CSPromo\Core\DB;

use CSPromo\Core\DB\BasicCrud;

abstract class InstallTable extends BasicCrud {
	public function __construct() {
		parent::__construct();
	}

	/**
	 * Setup the main table
	 *
	 * @return void
	 */
	public function setup() {
		if ( ! $this->tableIsInstalled() ) {
			$this->install();
		}
	}

	/**
	 * Check if the current table is installed
	 *
	 * @return bool
	 */
	public function tableIsInstalled() {
		$query = $this->wpdb->prepare( 'SHOW TABLES LIKE %s', $this->tablename );

		// phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared
		if ( $this->wpdb->get_var( $query ) === $this->tablename ) {
			return true;
		}
		return false;
	}

	/**
	 * Creates the table
	 *
	 * @param  string $sql
	 * @return bool
	 */
	public function createTable( $sql ) {
		require_once ABSPATH . 'wp-admin/includes/upgrade.php';
		dbDelta( $sql );

		return $this->tableIsInstalled();
	}

	/**
	 * install the table
	 *
	 * @return void
	 */
	abstract protected function install();
}
