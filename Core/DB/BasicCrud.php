<?php
namespace CSPromo\Core\DB;

class BasicCrud {
	/**
	 * wpdb
	 *
	 * @var \wpdb
	 */
	protected $wpdb;

	/**
	 * tablename
	 *
	 * @var string
	 */
	protected $tablename = '';

	/**
	 * Primary key name
	 *
	 * @var string
	 */
	protected $pk = 'id';

	public function __construct() {
		global $wpdb;
		$this->wpdb = $wpdb;

		$this->initTableName();
	}

	public function getTableName() {
		return $this->tablename;
	}

	/**
	 * Initialiaze the table name
	 *
	 * @return void
	 */
	public function initTableName() {
		$this->tablename = $this->wpdb->prefix . $this->tablename;
	}

	/**
	 * Adds the wp table prefix to a tablename
	 *
	 * @param  string $tablename
	 * @return string
	 */
	public function buildTableName( $tablename ) {
		return $this->wpdb->prefix . $tablename;
	}

	/**
	 * DELETE a single record
	 *
	 * @param  mixed $limit
	 * @return void
	 */
	public function delete( $where = array() ) {
		return $this->wpdb->delete(
			$this->tablename,
			$where
		);
	}

	/**
	 * Find a record base on a condition
	 *
	 * @param  array $where
	 * @return mixed
	 */
	public function find( $where = array() ) {
		/**
		 * @global \wpdb $wpdb
		 */
		global $wpdb;

		$where_clause = 'WHERE 1=1 ';
		foreach ( $where as $field => $value ) {
			if ( is_numeric( $value ) ) {
				// phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
				$where_clause .= $wpdb->prepare( " AND {$field} = %d", $value );
			} else {
				// phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
				$where_clause .= $wpdb->prepare( " AND {$field} LIKE %s", $value );
			}
		}

		$results = $wpdb->get_results(
			// phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
			"SELECT * FROM {$this->tablename} {$where_clause} LIMIT 1"
		);

		return $results ? $results[0] : null;
	}

	/**
	 * Total number of records
	 *
	 * @return int
	 */
	public function total( $where = array() ) {
		$where_clause = '';

		foreach ( $where as $field => $value ) {
			if ( is_numeric( $value ) ) {
				// phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
				$where_clause .= $this->wpdb->prepare( " AND {$field} = %d", $value );
			} else {
				// phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
				$where_clause .= $this->wpdb->prepare( " AND {$field} LIKE %s", $value );
			}
		}

		return $this->wpdb->get_var(
			// phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
			"SELECT COUNT(*) FROM {$this->tablename} {$where_clause}"
		);
	}

	/**
	 * insert
	 *
	 * @param  array $data
	 * @param  array $format
	 * @return mixed
	 */
	public function insert( $data, $format = array() ) {
		$insert = $this->wpdb->insert(
			$this->tablename,
			$data,
			$format
		);

		if ( $insert ) {
			return $this->wpdb->insert_id;
		}

		return false;
	}

	/**
	 * Update a record
	 *
	 * @param  array $data
	 * @param  array $where
	 * @param  array $format
	 * @return mixed
	 */
	public function update( $data, $where, $format = array() ) {
		$update = $this->wpdb->update(
			$this->tablename,
			$data,
			$where,
			$format
		);

		if ( $update ) {
			return true;
		}

		return false;
	}

	/**
	 * Create a record if it doesn't exist
	 *
	 * @param  mixed $data
	 * @param  mixed $where
	 * @return bool
	 */
	public function shouldCreate( $data, $where = array() ) {
		if ( ! $this->find( $where ) ) {
			$this->insert( $data );
		}
		return false;
	}

	public function buildLimit( $limit = null, $page = null ) {
		if ( ! is_numeric( $limit ) || $limit <= 0 ) {
			return '';
		}

		$limit = intval( $limit );

		if ( $page !== null ) {
			return 'LIMIT ' . ( ( $page - 1 ) * $limit ) . ', ' . $limit;
		} else {
			return 'LIMIT ' . $limit;
		}

		return '';
	}

	public function buildOrderBy( $orderBy, $order = 'ASC' ) {

		if ( empty( $orderBy ) ) {
			return '';
		}

		if ( ! is_string( $orderBy ) || ! in_array( strtoupper( $order ), array( 'ASC', 'DESC' ), true ) ) {
			return '';
		}

		return 'ORDER BY ' . esc_sql( $orderBy ) . ' ' . esc_sql( $order );
	}
}
