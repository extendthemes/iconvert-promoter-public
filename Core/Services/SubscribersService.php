<?php

namespace CSPromo\Core\Services;

use CSPromo\Core\DB\BasicCrud;

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
		return $this->wpdb->insert(
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
	public function getRecordsByList( $list_id, $records_no = 10, $paged = null ) {
		$this->orderBy( 'email', 'ASC' );
		$this->limit( $records_no, $paged );

		$sql = 'SELECT contacts.*
                FROM ' . $this->buildTableName( 'promo_subscriber_list' ) . ' cl
                LEFT JOIN ' . $this->tablename . ' contacts ON contacts.id = cl.subscriber_id
                WHERE cl.list_id = ' . $list_id . '
                ' . $this->getWhere() . '
                ' . $this->getOrderBy() . '
                ' . $this->getLimit() . '
            ';

		$total   = $this->countRecordsByList( $list_id );
		$records = $this->query( $sql );

		$this->flush();

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
		$this->orderBy( 'created_at', 'ASC' );
		$this->limit( $records_no, $paged );

		global $wpdb;
		$sub_query = $wpdb->prepare(
			// phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared
			'SELECT subscriber_id FROM ' . $this->buildTableName( 'promo_subscribers_provider_sync' )
			. ' WHERE subscriber_id = contacts.id AND provider_name = %s AND provider_list = %s',
			$provider_name,
			$provider_list
		);

		$sql_filter = ' FROM ' . $this->buildTableName( 'promo_subscriber_list' ) . ' cl
                LEFT JOIN ' . $this->tablename . ' contacts ON contacts.id = cl.subscriber_id
                WHERE cl.list_id = ' . $list_id . ' AND NOT EXISTS (' . $sub_query . ')
                ' . $this->getWhere();

		$records_query = 'SELECT contacts.* ' . $sql_filter . ' ' . $this->getOrderBy() . ' ' . $this->getLimit();
		$total_query   = 'SELECT COUNT(contacts.id) as total ' . $sql_filter;

		$total   = $this->query( $total_query );
		$records = $this->query( $records_query );

		$this->flush();

		return array(
			'records' => $records,
			'total'   => intval( $total[0]->total ),
		);
	}

	public function getRecordsByListSearch( $list_id, $numOfRecords = 10, $paged = null, $search = '' ) {
		$this->orderBy( 'email', 'ASC' );
		$this->limit( $numOfRecords, $paged );

		$sql = 'SELECT contacts.*
                FROM ' . $this->buildTableName( 'promo_subscriber_list' ) . ' cl
                LEFT JOIN ' . $this->tablename . ' contacts ON contacts.id = cl.subscriber_id
                WHERE cl.list_id = ' . $list_id . " AND contacts.email LIKE '%" . $search . "%'
                " . $this->getWhere() . '
                ' . $this->getOrderBy() . '
                ' . $this->getLimit() . '
            ';

		$total   = $this->countRecordsByListSearch( $list_id, $search );
		$records = $this->query( $sql );

		$this->flush();

		return array(
			'records' => $records,
			'total'   => $total,
		);
	}


	public function getLists( $contactID ) {
		$sql = 'SELECT lists.*
                FROM ' . $this->buildTableName( 'icv_contact_list' ) . ' cl
                LEFT JOIN ' . $this->buildTableName( 'icv_lists' ) . ' lists ON lists.id = cl.list_id
                WHERE cl.contact_id = ' . $contactID . '
                ORDER BY lists.name DESC
            ';

		$records = $this->query( $sql );

		$this->flush();
		return $records;
	}



	/**
	 * Get the total number of records from a list
	 *
	 * @param  mixed $list_id
	 * @return int
	 */
	public function countRecordsByList( $list_id ) {
		$sqlCount = 'SELECT COUNT(contacts.id)
                FROM ' . $this->buildTableName( 'promo_subscriber_list' ) . ' cl
                LEFT JOIN ' . $this->tablename . ' contacts ON contacts.id = cl.subscriber_id
                WHERE cl.list_id = ' . $list_id . '
                ' . $this->getWhere();

		return $this->totalFromQuery( $sqlCount );
	}

	/**
	 * Get the total number of records from a list based on search term
	 *
	 * @param  mixed $list_id
	 * @return int
	 */
	public function countRecordsByListSearch( $list_id, $search ) {
		$sqlCount = 'SELECT COUNT(contacts.id)
                FROM ' . $this->buildTableName( 'promo_subscriber_list' ) . ' cl
                LEFT JOIN ' . $this->tablename . ' contacts ON contacts.id = cl.subscriber_id
                WHERE cl.list_id = ' . $list_id . " AND contacts.email LIKE '%" . $search . "%'
                " . $this->getWhere();

		return $this->totalFromQuery( $sqlCount );
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

			$this->where( array( 'id' => $post_id ) );
			$del = $this->delete();

			$this->flush();

			return $del;
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


	/**
	 * Delete records from the database
	 *
	 * @return mixed
	 */
	public function bulkDeleteRecords() {

		// phpcs:ignore WordPress.Security.NonceVerification
		$ids = isset( $_POST['ids'] ) ? array_map( 'intval', $_POST['ids'] ) : array();

		if ( ! empty( $ids ) ) {
			$del = $this->bulkDelete( 'id', $ids );

			$this->flush();

			return $del;
		}

		return false;
	}

	public function deleteFromAllLists( $post_id ) {
		$this->where( array( 'id' => $post_id ) );
		$del = $this->delete();

		$this->flush();

		return $del;
	}

	public function deleteFromList( $post_id, $list_id ) {

		if ( ! is_numeric( $post_id ) || ! is_numeric( $list_id ) ) {
			return false;
		}

		$sql = 'DELETE 
                FROM ' . $this->buildTableName( 'promo_subscriber_list' ) . '                                
                WHERE subscriber_id = ' . $post_id . ' AND list_id = ' . $list_id . '
            ';

		$this->query( $sql );
		// check if this post id is still attached to any list
		$sql = 'SELECT COUNT(cl.subscriber_id)
                FROM ' . $this->buildTableName( 'promo_subscriber_list' ) . ' cl                
                WHERE cl.subscriber_id = ' . $post_id . '
                GROUP BY cl.subscriber_id
                ';

		$found = $this->totalFromQuery( $sql );

		if ( $found === 0 ) {
			$this->deleteFromAllLists( $post_id );
		}

		return true;
	}
}
