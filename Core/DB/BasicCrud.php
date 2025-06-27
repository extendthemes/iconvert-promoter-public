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
	 * select
	 *
	 * @var string
	 */
	private $select = '*';

	/**
	 * where
	 *
	 * @var string
	 */
	private $where = '';

	/**
	 * whereIn
	 *
	 * @var string
	 */
	private $whereIn = '';

	/**
	 * orderBy
	 *
	 * @var string
	 */
	private $orderBy = '';

	/**
	 * order
	 *
	 * @var string
	 */
	private $order = 'ASC';

	/**
	 * lastSQL
	 *
	 * @var string
	 */
	private $lastSQL = '';

	/**
	 * limit
	 *
	 * @var int
	 */
	private $limit = 10;

	/**
	 * page
	 *
	 * @var int
	 */
	private $page = null;

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
	 * Get results from a SQL statement
	 *
	 * @param  mixed $limit
	 * @param  mixed $page
	 * @return mixed
	 */
	public function get( $limit = false, $page = false ) {
		$this->limit( $limit, $page );

		$sql = ' SELECT ' . esc_sql( $this->getSelect() ) . ' 
            FROM ' . $this->tablename . ' 
            ' . $this->getWhere() . '
            ' . $this->getOrderBy() . ' 
            ' . $this->getLimit();

		return $this->getResults( $sql );
	}

	/**
	 * DELETE a single record
	 *
	 * @param  mixed $limit
	 * @return void
	 */
	public function delete( $limit = 1 ) {
		$this->limit( $limit );

		$sql = ' DELETE 
            FROM ' . $this->tablename . ' 
            ' . $this->getWhere() . '
            ' . $this->getLimit();

		return $this->getResults( $sql, true );
	}

	/**
	 * Bulk delete records by field
	 *
	 * @param  string $field
	 * @param  array $values
	 * @return string
	 */
	public function bulkDelete( $field, $values ) {
		$this->whereIn( $field, $values );

		return $this->delete( count( $values ) );
	}

	/**
	 * Find a record base on a condition
	 *
	 * @param  array $where
	 * @return mixed
	 */
	public function find( $where ) {
		$this->where( $where );
		$record = $this->get( 1 );

		$this->flush();

		if ( $record ) {
			return $record[0];
		}

		return false;
	}

	/**
	 * Total number of records
	 *
	 * @return int
	 */
	public function total() {
		// the getWhere method returns an already escaped WHERE clause, so we can use it directly in the SQL statement
		// without having to escape it again
		$sql = sprintf( 'SELECT COUNT(*) FROM %s %s', $this->tablename, $this->getWhere() );

		// phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared
		return $this->wpdb->get_var( $sql );
	}

	/**
	 * Total number of rows from a query
	 *
	 * @param  mixed $sql - the SQL query should be already prepared and escaped at this point
	 * @return void
	 */
	public function totalFromQuery( $sql ) {
		// phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared
		return $this->wpdb->get_var( $sql );
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
	 * Update or create
	 *
	 * @param  mixed $data
	 * @param  mixed $where
	 * @return void
	 */
	public function updateOrCreate( $data, $where = array() ) {
		if ( $this->find( $where ) ) {
			$this->flush();
			$this->update( $data, $where );
		} else {
			$this->insert( $data );
		}
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
			$this->flush();
			$this->insert( $data );
		}
		return false;
	}

	/**
	 * Query a database
	 *
	 * @param  string $query
	 * @return array
	 */
	public function query( $sql ) {
		return $this->getResults( $sql );
	}

	/**
	 * Get results from a SQL statement
	 *
	 * @param  string $sql the sql query should be already prepared and escaped at this point
	 * @param  bool $affectedRows if true, return the number of affected rows,
	 * @return mixed
	 */
	public function getResults( $sql, $affectedRows = false ) {
		$this->lastSQL = $sql;

		// phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared
		$rows = $this->wpdb->get_results( $sql );

		if ( $affectedRows === false && $rows === null ) {
			return false;
		}

		if ( $affectedRows ) {
			return $this->wpdb->rows_affected;
		}

		return $rows;
	}

	/**
	 * Get WHERE clause
	 *
	 * This method combines the where and whereIn clauses into a single WHERE statement.
	 * The where and whereIn clauses are escaped and sanitized when where and whereIn methods are called.
	 * @return string
	 */
	public function getWhere() {
		$clause = '';

		if ( $this->where !== '' ) {
			$clause .= $this->where . ' ';
		}

		if ( $this->whereIn !== '' ) {
			if ( $clause !== '' ) {
				$clause .= ' AND ' . $this->whereIn;
			} else {
				$clause .= $this->whereIn;
			}
		}

		if ( $clause !== '' ) {
			return 'WHERE ' . $clause;
		}

		return '';
	}

	/**
	 * Set the ORDER BY statement
	 *
	 * @param  string $orderBy
	 * @return void
	 */
	public function orderBy( $orderBy, $order = 'ASC' ) {
		$this->orderBy = esc_sql( $orderBy );
		$this->order   = esc_sql( $order );
	}

	/**
	 * Set the SELECT fields
	 *
	 * @param  string $fields
	 * @return void
	 */
	public function select( $fields ) {
		$this->select = esc_sql( $fields );
	}

	/**
	 * Set the WHERE clause
	 *
	 * @param  array $fields
	 * @param  string $condition
	 * @return void
	 */
	public function where( $fields, $condition = 'AND' ) {
		if ( is_array( $fields ) ) {
			$clause = $this->condition( $fields, $condition );
		}

		$this->where .= $clause;
	}

	/**
	 * Set the WHERE IN clause
	 *
	 * @param  array $fields
	 * @param  string $condition
	 * @return void
	 */
	public function whereIn( $field, $values ) {
		if ( ! empty( $values ) ) {
			$numericVals = implode( ',', array_filter( $values, 'absint' ) );
			if ( ! empty( $numericVals ) ) {
				$this->whereIn .= $field . ' IN(' . $numericVals . ')';
			} else {
				$this->whereIn .= '1 == 2';
			}
		}
	}

	/**
	 * Parse WHERE condition
	 *
	 * @param  array $fields
	 * @param  string $condition
	 * @return string
	 */
	public function condition( $fields, $condition ) {
		$clause = array();
		foreach ( $fields as $fieldname => $fieldvalue ) {
			$clause[] = $fieldname . ' ' . $this->operator( $fieldvalue ) . ' ' . $this->escapeForQuery( $fieldvalue );
		}

		return implode( ' ' . $condition . ' ', $clause );
	}

	private function escapeForQuery( $value ) {
		if ( is_numeric( $value ) ) {
			return $this->wpdb->prepare( '%d', $value );
		}

		return $this->wpdb->prepare( '%s', $value );
	}

	public function operator( $value ) {
		if ( str_starts_with( $value, '%' ) || str_ends_with( $value, '%' ) ) {
			return 'LIKE';
		}

		return '=';
	}

	/**
	 * Get the last SQL string
	 *
	 * @return string
	 */
	public function getLastSQL() {
		return $this->lastSQL;
	}

	/**
	 * Get SELECT fields
	 *
	 * @return string
	 */
	public function getSelect() {
		return $this->select;
	}

	/**
	 * Get ORDER BY statement
	 *
	 * @return string
	 */
	public function getOrderBy() {
		if ( $this->orderBy ) {
			return 'ORDER BY ' . $this->orderBy . ' ' . $this->order;
		}

		return '';
	}

	/**
	 * Set the LIMIT statement
	 *
	 * @param  mixed $limit
	 * @param  mixed $page
	 * @return void
	 */
	public function limit( $limit = false, $page = null ) {
		if ( $limit !== false ) {
			$this->limit = $limit;

			if ( $page !== null ) {
				$this->page = $page;
			}
		}
	}

	/**
	 * Get the LIMIT statement
	 *
	 * @return string
	 */
	public function getLimit() {
		if ( is_numeric( $this->limit ) ) {
			if ( $this->page ) {
				return 'LIMIT ' . ( ( $this->page - 1 ) * $this->limit ) . ', ' . $this->limit;
			} else {
				return 'LIMIT ' . $this->limit;
			}
		}

		return '';
	}

	/**
	 * Reset all the conditions and other sql statements
	 *
	 * @return void
	 */
	public function flush() {
		$this->select  = '*';
		$this->where   = '';
		$this->whereIn = '';
		$this->orderBy = '';
		$this->order   = 'ASC';
		$this->lastSQL = '';
		$this->limit   = 10;
		$this->page    = null;
	}
}
