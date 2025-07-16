<?php

namespace CSPromo\Core\Services;

use CSPromo\Core\DB\BasicCrud;
use CSPromo\Core\PostTypes\PromoPopups;
use CSPromo\Core\Pro\Admin\Pages\IntegrationsProvider;

class EmailListsService extends BasicCrud {

	protected $tablename = 'promo_lists';

	public function __construct() {
		parent::__construct();
	}

	/**
	 * Save a new record
	 *
	 * @return mixed
	 */
	public function store() {
		$payload = wp_parse_args(
			// phpcs:ignore WordPress.Security.NonceVerification.Missing
			$_POST,
			array(
				'name'          => '',
				'subject'       => '',
				'description'   => '',
				'provider'      => '',
				'provider_list' => '',
				'template'      => 0,
			)
		);

		return $this->insert(
			array(
				'name'          => esc_textarea( $payload['name'] ),
				'subject'       => esc_textarea( $payload['subject'] ),
				'description'   => esc_textarea( $payload['description'] ),
				'provider'      => esc_textarea( $payload['provider'] ),
				'provider_list' => esc_textarea( $payload['provider_list'] ),
				'template_id'   => intval( $payload['template'] ),
			)
		);
	}

	/**
	 * Update a record
	 *
	 * @return mixed
	 */
	public function edit() {
		$payload = wp_parse_args(
			// phpcs:ignore WordPress.Security.NonceVerification.Missing
			$_POST,
			array(
				'post_id'       => 0,
				'name'          => '',
				'subject'       => '',
				'description'   => '',
				'provider'      => '',
				'provider_list' => '',
				'template'      => 0,
			)
		);

		return $this->update(
			array(
				'name'          => esc_textarea( $payload['name'] ),
				'subject'       => esc_textarea( $payload['name'] ),
				'description'   => esc_textarea( $payload['description'] ),
				'template_id'   => intval( $payload['template'] ),
				'provider'      => esc_textarea( $payload['provider'] ),
				'provider_list' => esc_textarea( $payload['provider_list'] ),
			),
			array( 'id' => intval( $payload['post_id'] ) )
		);
	}

	/**
	 * Check if the email is already subscribed to the list
	 *
	 * @param  string $email
	 * @param  int $list_id
	 * @return boolean
	 */
	public function isSubscribedToList( $email, $list_id ) {

		global $wpdb;

		$promo_subscriber_list_table = $this->buildTableName( 'promo_subscriber_list' );
		$promo_subscribers_table     = $this->buildTableName( 'promo_subscribers' );

		$records = $wpdb->get_row(
			$wpdb->prepare(
				// phpcs:disable WordPress.DB.PreparedSQL.InterpolatedNotPrepared
				"SELECT subscribers.email FROM {$promo_subscriber_list_table} cl
				LEFT JOIN {$promo_subscribers_table} subscribers ON subscribers.id = cl.subscriber_id
				WHERE cl.list_id = %d AND subscribers.email = %s
				LIMIT 1",
				$list_id,
				$email
				// phpcs:enable WordPress.DB.PreparedSQL.InterpolatedNotPrepared
			)
		);

		if ( $records ) {
			return true;
		}

		return false;
	}

	/**
	 * Subscribe an email to a list
	 *
	 * @param  int $listID
	 * @param  string $email
	 * @param  string $name
	 * @return boolean
	 */
	public function subscribe( $listID, $email, $name ) {
		$subscribers = new SubscribersService();
		$contact_id  = $subscribers->storeOrUpdate( $email, $name );

		if ( $contact_id ) {
			$attached = $subscribers->attachToList( $contact_id, $listID );
		}

		$emailList = $this->find( array( 'id' => $listID ) );

		if ( $emailList ) {
			do_action( 'iconvertpr_popup_subscribe_user', $email, $name, $emailList, $contact_id );
		}

		$this->maybeAddToProvider(
			(object) array(
				'email' => $email,
				'id'    => $contact_id,
				'name'  => $name,
			),
			$emailList
		);

		return $contact_id || $attached;
	}


	public function maybeAddToProvider( $sub, $emails_list ) {
		$provider      = $emails_list->provider;
		$provider_list = $emails_list->provider_list;

		if ( ! $provider || ! $provider_list ) {
			return;
		}

		$integrations_provider = new IntegrationsProvider();
		$response              = $integrations_provider->add_email_to_list( $provider, $provider_list, $sub->email, $sub->name );

		if ( ! $response || is_wp_error( $response ) ) {
			return;
		}

		$this->wpdb->insert(
			$this->buildTableName( 'promo_subscribers_provider_sync' ),
			array(
				'subscriber_id' => $sub->id,
				'provider_name' => $provider,
				'provider_list' => $provider_list,
			),
			array( '%d', '%s', '%s' )
		);
	}

	/**
	 * Get a list of records
	 *
	 * @return array
	 */
	public function getRecords( $numOfRecords = 10, $paged = null ) {
		$total = $this->total();

		global $wpdb;

		$sql = 'SELECT lists.*, COUNT(sl.list_id) AS subscribers
				FROM ' .
				// phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared
				$this->tablename
				. ' lists LEFT JOIN ' .
				// phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared
				$this->buildTableName( 'promo_subscriber_list' ) .
				' sl ON lists.id = sl.list_id GROUP BY lists.id ORDER BY lists.name ASC ' .
				// phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared
				$this->buildLimit( $numOfRecords, $paged );

		// phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared
		$records = $wpdb->get_results( $sql );

		return array(
			'records' => wp_unslash( $records ),
			'total'   => $total,
		);
	}

	/**
	 * Delete a record from the database
	 *
	 * @return mixed
	 */
	public function destroy( $post_id = false ) {
		if ( $post_id === false ) {
			// phpcs:ignore WordPress.Security.NonceVerification.Recommended
			$post_id = isset( $_GET['post_id'] ) && is_numeric( $_GET['post_id'] ) ? intval( $_GET['post_id'] ) : 0;
		}
		if ( $post_id ) {

			$del = $this->delete( array( 'id' => $post_id ) );

			return $del;
		}

		return false;
	}

	public function isAttachedToAForm( $post_id ) {
		$popups = PromoPopups::getRaw();
		foreach ( $popups as $popup ) {
			$template = new TemplatesService( array() );

			if ( $template->hasListID( $popup->post_content, $post_id ) !== false ) {
				return $popup->post_title;
			}
		}

		return false;
	}

	/**
	 * Bulk unsubscribe contacts from the database
	 *
	 * @return mixed
	 */
	public function bulkUnsubscribeRecords() {
		// phpcs:ignore WordPress.Security.NonceVerification.Missing
		if ( isset( $_POST['ids'] ) && ! empty( $_POST['ids'] ) ) {
			// phpcs:ignore WordPress.Security.NonceVerification.Missing,WordPress.Security.ValidatedSanitizedInput.InputNotSanitized,WordPress.Security.ValidatedSanitizedInput.MissingUnslash
			$list_id = isset( $_POST['list_id'] ) ? intval( $_POST['list_id'] ) : 0;
			// phpcs:ignore WordPress.Security.NonceVerification.Missing,WordPress.Security.ValidatedSanitizedInput.InputNotSanitized,WordPress.Security.ValidatedSanitizedInput.MissingUnslash
			foreach ( $_POST['ids'] as $contact_id ) {
				$this->unsubscribeContact( intval( $contact_id ), $list_id );
			}

			return true;
		}

		return false;
	}

	/**
	 * Unsubscribe a contact from a list
	 *
	 * @param  mixed $contact_id
	 * @param  mixed $list_id
	 * @return void
	 */
	public function unsubscribeContact( $contact_id, $list_id ) {
		// phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared
		$sql = $this->wpdb->prepare( 'DELETE FROM ' . $this->buildTableName( 'promo_subscriber_list' ) . ' WHERE subscriber_id = %d AND list_id = %d LIMIT 1', array( $contact_id, $list_id ) );
		// phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared
		$this->wpdb->query( $sql );

		return true;
	}

	/**
	 * Download subscribers from a list
	 *
	 * @param  mixed $list_id
	 * @return void
	 */
	public function download( $list_id ) {
		$list = $this->find( array( 'id' => $list_id ) );

		$subscribers = new SubscribersService();
		$contacts    = $subscribers->getRecordsByList( $list_id, null );

		$csv = $this->buildCsv( $contacts['records'] );

		$this->downloadCsv( $csv, $list );
	}

	/**
	 * Build CSV file
	 *
	 * @param  mixed $contacts
	 * @return string
	 */
	public function buildCsv( $contacts ) {
		$records    = array();
		$records[0] = array( 'Email Address', 'Name', 'Created At' );

		if ( ! empty( $contacts ) ) {
			foreach ( $contacts as $contact ) {
				$records[] = array(
					$contact->email,
					esc_html( wp_unslash( $contact->name ) ),
					$contact->created_at,
				);
			}
		}
		return $this->array2csv( $records );
	}

	/**
	 * array2csv
	 *
	 * @param  mixed $data
	 * @param  mixed $delimiter
	 * @param  mixed $enclosure
	 * @param  mixed $escape_char
	 * @return string
	 */
	public function array2csv( $data, $delimiter = ',', $enclosure = '"', $escape_char = '\\' ) {
		// phpcs:ignore WordPress.WP.AlternativeFunctions.file_system_operations_fopen
		$f = fopen( 'php://memory', 'r+' );
		foreach ( $data as $item ) {
			fputcsv( $f, $item, $delimiter, $enclosure, $escape_char );
		}
		rewind( $f );
		return stream_get_contents( $f );
	}

	/**
	 * Download csv file
	 *
	 * @param  mixed $csv
	 * @param  mixed $list
	 * @return void
	 */
	public function downloadCsv( $csv, $list ) {
		$fileName = $this->cleanCsvFileName( $list->name );

		header( 'Content-Type: application/csv' );
		header( 'Content-Disposition: attachment; filename="' . $fileName . '"' );
		header( 'Pragma: no-cache' );
		header( 'Expires: 0' );
		// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		echo $csv;
		exit;
	}

	private function cleanCsvFileName( $fileName ) {
		$fileName = str_replace( ' ', '_', $fileName );
		$fileName = preg_replace( '/[^A-Za-z0-9\-\_]/', '', $fileName );
		$fileName = preg_replace( '/-+/', '_', $fileName );

		$cleanFileName = $fileName . '.csv';

		return $cleanFileName;
	}

	/**
	 * Get the ID of the default list
	 *
	 * @return int
	 */
	public function getDefaultListID() {
		$defaultList = $this->find( array( 'listtype' => 1 ) );
		if ( $defaultList ) {
			return $defaultList->id;
		}

		return 0;
	}
}
