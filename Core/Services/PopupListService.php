<?php

namespace CSPromo\Core\Services;

use CSPromo\Core\DB\BasicCrud;

class PopupListService extends BasicCrud {

	protected $tablename = 'posts';

	public function __construct() {
		parent::__construct();
	}

	/**
	 * Get posts by filter
	 *
	 * @param string $postType
	 * @param int $numOfRecords
	 * @param int $paged
	 * @param array('search') $filter
	 * @return array('posts', 'total')
	 */
	public function getPostsByFilter( $postType, $filter, $numOfRecords = 10, $paged = null ) {
		$sql = 'SELECT p.* FROM ' . $this->tablename . ' p';
		global $wpdb;

		$order_by = '';
		$limit    = $this->buildLimit( $numOfRecords, $paged );

		if ( ! empty( $filter['sort']['by'] ) && ! empty( $filter['sort']['order'] ) ) {
			$sortBy = $filter['sort']['by'];
			$order  = $filter['sort']['order'] === 'ascending' ? 'ASC' : 'DESC';

			switch ( $sortBy ) {
				case 'active':
					$sql .= $wpdb->prepare(
						// phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
						" LEFT JOIN {$this->buildTableName( 'postmeta' )} pm ON p.id = pm.post_id AND pm.meta_key = %s",
						$sortBy
					);

					$order_by = $this->buildOrderBy( 'pm.meta_value', $order );

					break;
				case 'view' || 'click' || 'subscriber' || 'first_view':
					$stats_query = $wpdb->prepare(
						// phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared 
						"SELECT post_id, SUM(hits) as hits FROM {$this->buildTableName( 'promo_stats' )} WHERE event = %s GROUP BY post_id",
						$sortBy
					);

					$sql     .= ' LEFT JOIN (' . $stats_query . ') ps ON p.id = ps.post_id';
					$order_by = $this->buildOrderBy( 'ps.hits', $order );

					break;
				default:
					$order_by = $this->buildOrderBy( 'p.post_date', $order );
					break;
			}
		} else {
			$order_by = $this->buildOrderBy( 'p.post_date', 'DESC' );
		}

		$search = preg_replace( '/\s+/', '%', $wpdb->esc_like( trim( $filter['search'] ) ) );
		$search = trim( $search, '% ' );

		$sql .= $wpdb->prepare(
			// phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
			" WHERE p.post_type = %s AND p.post_title LIKE %s {$order_by} {$limit}",
			$postType,
			trim( $search, ' %' ) ? '%' . $search . '%' : '%'
		);

		$total = $this->countPostsByFilter(
			$postType,
			array_merge(
				$filter,
				array( 'search' => $search )
			)
		);

		// phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared
		$posts = $wpdb->get_results( $sql );

		return array(
			'posts' => $posts,
			'total' => $total,
		);
	}

	/**
	 * Get the total number of records from a list
	 *
	 * @param string $postType
	 * @param array $filter
	 * @return int
	 */
	public function countPostsByFilter( $postType, $filter ) {

		global $wpdb;

		$filter['search'] = isset( $filter['search'] ) ? $filter['search'] : '';

		return $wpdb->get_var(
			$wpdb->prepare(
				// phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
				"SELECT COUNT(p.id) FROM {$this->tablename} p
				WHERE p.post_type = %s AND p.post_title LIKE %s",
				$postType,
				$filter['search'] ? '%' . $filter['search'] . '%' : '%'
			)
		);
	}
}
