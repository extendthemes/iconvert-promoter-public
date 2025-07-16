<?php

namespace CSPromo\Core\Services;

use CSPromo\Core\DB\BasicCrud;

class StatsService extends BasicCrud {

	protected $tablename = 'promo_stats';


	const EVENTS = array(
		'first_view',
		'view',
		'click',
		'subscribe',
		'yes-action',
		'no-action',
		'close',
	);

	public function __construct() {
		parent::__construct();
	}

	/**
	 * store
	 *
	 * @param  int $postID
	 * @return mixed
	 */
	public function store( $postID ) {
		return $this->insert(
			array(
				'promo_id' => $postID,
			)
		);
	}

	public function destroy( $popupID ) {
		/**
		 * @global \wpdb $wpdb
		 */
		global $wpdb;

		return $wpdb->delete(
			$this->tablename,
			array(
				'post_id' => $popupID,
			),
			array( '%d' )
		);
	}

	/**
	 * Get the stats for a given promo
	 *
	 * @param  int $popupID
	 * @return array
	 */
	public function getBasicStats( $popupID ) {

		global $wpdb;

		$stats = $wpdb->get_results(
			$wpdb->prepare(
				// phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
				"SELECT event, SUM(hits) as hits FROM {$this->tablename} WHERE post_id = %d GROUP BY event",
				$popupID
			)
		);

		$basic_stats = array();

		foreach ( self::EVENTS as $event ) {
			$basic_stats[ $event ] = 0;
		}

		if ( empty( $stats ) ) {
			return $basic_stats;
		}

		foreach ( $stats as $stat ) {
			$basic_stats[ $stat->event ] = $stat->hits;
		}

		return $basic_stats;
	}
	public function updateStat( $post_id, $event, $identifier = '' ) {

		$identifier = trim( $identifier . '' );

		$query = $this->wpdb->prepare(
			// phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
			"INSERT INTO {$this->tablename} (post_id,day,event,identifier,hits) VALUES (%d, %s, %s, %s, 1) ON DUPLICATE KEY UPDATE hits = hits + 1",
			$post_id,
			gmdate( 'Y-m-d' ),
			$event,
			substr( $identifier, 0, 150 ) // Ensure identifier is not too long
		);

		// the query is actually prepared previously, so we can run it directly
		// phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared
		$update = $this->wpdb->query( $query );

		return $update;
	}

	/**
	 * Reset all stats
	 *
	 * @param  int $promoID
	 * @return int
	 */
	public function resetAllStats( $promoID ) {
		$this->destroy( $promoID );

		return $update;
	}

	/**
	 * Increase a stat value by one
	 *
	 * @param  string $what
	 * @param  int $promoID
	 * @return int
	 */
	public function incrementStat( $what, $promo_id ) {

		$what = esc_sql( $what );
		// phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
		$query = $this->wpdb->prepare( "SELECT $what FROM {$this->tablename} WHERE promo_id = %d", $promo_id );
		// phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared
		return $this->wpdb->get_var( $query ) + 1;
	}

	/**
	 * Set the active from date
	 *
	 * @param  int $postID
	 * @param  mixed $date
	 * @return bool
	 */
	public function setActiveFrom( $postID, $date ) {
		return $this->update(
			array( 'active_from' => $date ),
			array( 'promo_id' => $postID )
		);
	}

	/**
	 * Calculate the number of hours active
	 *
	 * @param  int $postID
	 * @param  bool $active
	 * @return void
	 */
	public function calculateHoursActive( $postID, $active ) {
		if ( ! $active ) {
			// set active_from to now
			$this->setActiveFrom( $postID, gmdate( 'Y-m-d H:i:s' ) );
		} else {
			// set active_from to NULL
			$promo = $this->find(
				array(
					'promo_id' => $postID,
				)
			);

			if ( $promo ) {
				$this->setActiveFrom( $postID, null );
				$this->updateHoursActive( $postID, $promo->active_from );
			}
		}
	}

	/**
	 * Update Hours Active
	 *
	 * @param  int $postID
	 * @param  mixed $from_date
	 * @return bool
	 */
	public function updateHoursActive( $postID, $from_date ) {
		$hours = $this->hoursActive( $from_date );

		$update = $this->update(
			array( 'hours_active' => $this->incrementHoursActive( $postID, $hours ) ),
			array( 'promo_id' => $postID )
		);

		return $update;
	}

	/**
	 * Increment hours active
	 *
	 * @param  int $postID
	 * @param  int $hours
	 * @return int
	 */
	public function incrementHoursActive( $post_i_d, $hours = 0 ) {
		// phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
		$query = $this->wpdb->prepare( "SELECT hours_active FROM {$this->tablename} WHERE promo_id = %d", $post_i_d );
		// phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared
		return $this->wpdb->get_var( $query ) + $hours;
	}

	/**
	 * Calculate the hours active from a date
	 *
	 * @param  mixed $from_date
	 * @return int
	 */
	public function hoursActive( $from_date ) {
		if ( $from_date === null ) {
			return 0;
		}

		$from_date = new \DateTime( $from_date );
		$now       = new \DateTime();

		$diff = $now->diff( $from_date );

		$hours = $diff->h + ( $diff->days * 24 );

		return $hours;
	}
}
