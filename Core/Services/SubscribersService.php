<?php

namespace CSPromo\Core\Services;

use CSPromo\Core\DB\BasicCrud;
use CSPromo\Core\Pro\Admin\Pages\IntegrationsProvider;

class SubscribersService extends BasicCrud {

	protected $tablename = 'promo_subscribers';

	public function __construct() {
		parent::__construct();
	}

	/**
	 * Save a new record
	 *
	 * @return mixed
	 */
	public function store( $email, $name = '' ) {
		$contact = $this->insert(
			array(
				'email' => $email,
				'name'  => $name,
			)
		);

		return $contact;
	}

	public function storeOrUpdate( $email, $name ) {
		$contact = $this->find( array( 'email' => $email ) );

		if ( empty( $contact ) ) {
			return $this->store( $email, $name );
		}

		$this->edit( $email, $name, $contact->id );
		return $contact->id;
	}

	public function attachToList( $contactID, $listID ) {
		/**
		 * @global \wpdb $wpdb
		 */
		global $wpdb;

		return $wpdb->insert(
			$this->buildTableName( 'promo_subscriber_list' ),
			array(
				'subscriber_id' => $contactID,
				'list_id'       => $listID,
			),
			array( '%d', '%d' )
		);
	}

	/**
	 * Get contacts from a list
	 *
	 * @return array
	 */
	public function getRecordsByList( $list_id, $records_no = 10, $paged = null, $search = null ) {
		/**
		 * @global \wpdb $wpdb
		 */
		global $wpdb;

		$subscriber_list_table = $this->buildTableName( 'promo_subscriber_list' );
		$contacts_table        = $this->tablename;

		$where = $wpdb->prepare( 'WHERE cl.list_id = %d', $list_id );

		if ( is_string( $search ) && ! empty( $search ) ) {
			$where .= $wpdb->prepare( ' AND contacts.email LIKE %s', '%' . $wpdb->esc_like( $search ) . '%' );
		}

		$limit = $this->buildLimit( $records_no, $paged );
		$order = $this->buildOrderBy( 'contacts.email', 'ASC' );

		$records = $wpdb->get_results(
			// phpcs:disable WordPress.DB.PreparedSQL.InterpolatedNotPrepared
			"SELECT contacts.*
                FROM {$subscriber_list_table} cl
                LEFT JOIN {$contacts_table} contacts ON contacts.id = cl.subscriber_id
				{$where}
				{$order}
				{$limit}"
			// phpcs:enable WordPress.DB.PreparedSQL.InterpolatedNotPrepared
		);

		$total = $this->countRecordsByList( $list_id, $search );

		return array(
			'records' => $records,
			'total'   => $total,
		);
	}
	/**
	 * Get contacts from a list
	 *
	 * @return array
	 */
	public function getRecordsNotSynced( $list_id, $provider_name, $provider_list, $records_no = 10, $paged = null ) {

		global $wpdb;
		$sub_query = $wpdb->prepare(
			// phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared
			'SELECT subscriber_id FROM ' . $this->buildTableName( 'promo_subscribers_provider_sync' )
			. ' WHERE subscriber_id = contacts.id AND provider_name = %s AND provider_list = %s',
			$provider_name,
			$provider_list
		);

		$promo_subscriber_list_table = $this->buildTableName( 'promo_subscriber_list' );
		$contacts_table              = $this->tablename;

		$sql_filter = $wpdb->prepare(
			// phpcs:disable WordPress.DB.PreparedSQL.InterpolatedNotPrepared
			"FROM {$promo_subscriber_list_table} cl
			LEFT JOIN {$contacts_table} contacts ON contacts.id = cl.subscriber_id
			WHERE cl.list_id = %d AND NOT EXISTS ({$sub_query})",
			$list_id
			// phpcs:enable WordPress.DB.PreparedSQL.InterpolatedNotPrepared
		);

		$limit = $this->buildLimit( $records_no, $paged );

		// phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
		$records = $this->wpdb->get_results( "SELECT contacts.* {$sql_filter} ORDER BY created_at ASC {$limit}" );

		// phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
		$total = $this->wpdb->get_var( "SELECT COUNT(contacts.id) as total {$sql_filter}" );

		return array(
			'records' => $records,
			'total'   => intval( $total ),
		);
	}

	public function getLists( $contactID ) {
		global $wpdb;

		$records = $wpdb->get_results(
			// phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared
			$wpdb->prepare(
				// phpcs:disable WordPress.DB.PreparedSQL.InterpolatedNotPrepared
				"SELECT lists.*
				FROM {$this->buildTableName( 'icv_contact_list' )} cl
				LEFT JOIN {$this->buildTableName( 'icv_lists' )} lists ON lists.id = cl.list_id
				WHERE cl.contact_id = %d
				ORDER BY lists.name DESC",
				$contactID
				// phpcs:enable WordPress.DB.PreparedSQL.InterpolatedNotPrepared
			)
		);

		return $records;
	}



	/**
	 * Get the total number of records from a list
	 *
	 * @param  mixed $list_id
	 * @param  string $search
	 * @return int
	 */
	public function countRecordsByList( $list_id, $search = null ) {
		/**
		 * @global \wpdb $wpdb
		 */
		global $wpdb;

		$subscriber_list_table = $this->buildTableName( 'promo_subscriber_list' );
		$contacts_table        = $this->tablename;

		$where = $wpdb->prepare( 'WHERE cl.list_id = %d', $list_id );

		if ( is_string( $search ) && ! empty( $search ) ) {
			$where .= $wpdb->prepare( ' AND contacts.email LIKE %s', '%' . $wpdb->esc_like( $search ) . '%' );
		}

		$total = $wpdb->get_var(
			// phpcs:disable WordPress.DB.PreparedSQL.InterpolatedNotPrepared
			"SELECT COUNT(contacts.id) as total
			FROM {$subscriber_list_table} cl
			LEFT JOIN {$contacts_table} contacts ON contacts.id = cl.subscriber_id
			{$where}"
			// phpcs:enable WordPress.DB.PreparedSQL.InterpolatedNotPrepared
		);

		if ( ! $total ) {
			return 0;
		}

		return intval( $total );
	}


	/**
	 * Delete a record from the database
	 *
	 * @return mixed
	 */
	public function destroy() {
		// phpcs:ignore WordPress.Security.NonceVerification
		$post_id = isset( $_GET['post_id'] ) ? intval( $_GET['post_id'] ) : 0;

		if ( $post_id ) {

			/**
			 * @global \wpdb $wpdb
			 */
			global $wpdb;

			$wpdb->delete(
				$this->tablename,
				array(
					'id' => $post_id,
				),
				array( '%d' )
			);

		}

		return false;
	}

	/**
	 * Update a record
	 *
	 * @return bool
	 */
	public function edit( $email, $name, $contactID ) {
		$this->update(
			array(
				'email' => $email,
				'name'  => $name,
			),
			array( 'id' => $contactID )
		);

		return true;
	}


	public function deleteFromAllLists( $post_id, $including_providers = false ) {
		if ( $including_providers ) {
			$this->deleteFromMarketingProviders( $post_id );
		}

		/* @global \wpdb $wpdb */
		global $wpdb;

		$del = $wpdb->delete(
			$this->tablename,
			array( 'id' => $post_id ),
			array( '%d' )
		);

		return $del;
	}

	public function deleteFromList( $post_id, $list_id, $including_providers = false ) {

		/**
		 * @global \wpdb $wpdb
		 */
		global $wpdb;

		if ( ! is_numeric( $post_id ) || ! is_numeric( $list_id ) ) {
			return false;
		}

		if ( $including_providers ) {
			$this->deleteFromMarketingProviders( $post_id, $list_id );
		}

		$deleted = $wpdb->delete(
			$this->buildTableName( 'promo_subscriber_list' ),
			array(
				'subscriber_id' => $post_id,
				'list_id'       => $list_id,
			),
			array( '%d', '%d' )
		);
		return $deleted;
	}

	public function deleteFromMarketingProviders( $id, $list_id = null ) {
		global $wpdb;
		// if list_id is null, delete from all providers.
		$sql = 'SELECT id, provider, provider_list
				FROM ' . $this->buildTableName( 'promo_lists' ) .
				" WHERE `{$this->buildTableName( 'promo_lists' )}`.id IN (
					SELECT list_id
					FROM " . $this->buildTableName( 'promo_subscriber_list' ) . '
					WHERE subscriber_id = %d
				) AND provider IS NOT NULL AND provider_list IS NOT NULL';

		// phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared
		$sql = $wpdb->prepare( $sql, $id );
		// phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared
		$lists_data = $wpdb->get_results( $sql );

		if ( $list_id ) {
			$lists_data = array_filter(
				$lists_data,
				function ( $list ) use ( $list_id ) {
					return intval( $list->id ) === intval( $list_id );
				}
			);
		}

		$subscriber = $this->find( array( 'id' => $id ) );

		$integrations_provider = new IntegrationsProvider();

		foreach ( $lists_data as $list ) {
			$integrations_provider->remove_email_from_list(
				$list->provider,
				$list->provider_list,
				$subscriber->email
			);

			$sql = $wpdb->prepare(
				// phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared
				'DELETE FROM ' . $this->buildTableName( 'promo_subscribers_provider_sync' ) .
				' WHERE subscriber_id = %d AND provider_name = %s AND provider_list = %s',
				$id,
				$list->provider,
				$list->provider_list
			);
			// phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared
			$wpdb->query( $sql );
		}
	}
}
