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
		$this->limit( $numOfRecords, $paged );
		$sql = 'SELECT p.* FROM ' . $this->tablename . ' p';
		global $wpdb;

		if ( ! empty( $filter['sort']['by'] ) && ! empty( $filter['sort']['order'] ) ) {
			$sortBy = $filter['sort']['by'];
			$order  = $filter['sort']['order'] === 'ascending' ? 'ASC' : 'DESC';

			switch ( $sortBy ) {
				case 'active':
					$sql .= ' LEFT JOIN ' . $this->buildTableName( 'postmeta' ) . " pm ON p.id = pm.post_id AND pm.meta_key = '" . esc_sql( $sortBy ) . "'";
					$this->orderBy( 'pm.meta_value', $order );
					break;
				case 'view' || 'click' || 'subscriber' || 'first_view':
					$stats_query = $wpdb->prepare(
						"SELECT post_id, SUM(hits) as hits FROM {$this->buildTableName( 'promo_stats' )} WHERE event = %s GROUP BY post_id",
						$sortBy
					);

					$sql .= ' LEFT JOIN (' . $stats_query . ') ps ON p.id = ps.post_id';
					$this->orderBy( 'ps.hits', $order );
					break;
				default:
					$this->orderBy( 'p.post_date', 'DESC' );
					break;
			}
		} else {
			$this->orderBy( 'p.post_date', 'DESC' );
		}

		$search = preg_replace( '/\s+/', '%', trim( $filter['search'] ) );

		global $wpdb;
		$sql .= " WHERE p.post_type = '" . esc_sql( $postType ) . "' AND p.post_title LIKE '%" . $wpdb->esc_like( $search ) . "%'";
		$sql .= $this->getOrderBy() . ' ' . $this->getLimit();

		$total = $this->countPostsByFilter( $postType, $filter );
		$posts = $this->query( $sql );

		$this->flush();

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

		// replace spaces with mysql wildcard
		$search = preg_replace( '/\s+/', '%', trim( $filter['search'] ) );

		$sql = 'SELECT COUNT(p.id) FROM ' . $this->tablename . " p
                WHERE p.post_type = '" . esc_sql( $postType ) . "' AND p.post_title LIKE '%" . $wpdb->esc_like( $search ) . "%'";

		return $this->totalFromQuery( $sql );
	}
}
