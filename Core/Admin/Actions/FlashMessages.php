<?php
namespace CSPromo\Core\Admin\Actions;

use CSPromo\Core\Traits\IsSingleton;


class FlashMessages {
	use IsSingleton;

	/**
	 * optionName
	 *
	 * @var string
	 */
	private $optionName = 'iconvertpr_flash_messages';

	/**
	 * Adds a Flash Message
	 *
	 * @param  mixed $message
	 * @param  mixed $status
	 * @return array
	 */
	public function addMessage( $message, $status = 'success' ) {
		$messages   = $this->getMessages();
		$messages[] = array(
			'status'  => $status,
			'message' => $message,
		);
		$this->saveMessages( $messages );
	}

	/**
	 * Display all the Flash Messages
	 *
	 * @param  mixed $echo
	 * @return string
	 */
	public function displayMessages( $echo = true ) {
		$messages = $this->getMessages();
		$str      = '';

		if ( ! empty( $messages ) ) {
			ob_start();
			?>
			<div class="cs-flash-messages">
				<?php foreach ( $messages as $message ) : ?>
					<div data-type="<?php echo esc_attr( $message['status'] ); ?>" class="cs-flash-message cs-flash-message-<?php echo esc_attr( $message['status'] ); ?> alert alert-<?php echo esc_attr( $this->bootstrapStatus( $message['status'] ) ); ?>">
						<?php echo wp_kses_post( $message['message'] ); ?>
					</div>
				<?php endforeach; ?>
			</div>
			<!-- /.cs-flash-messages -->
			<?php
			$str = ob_get_clean();
			$this->deleteMessages();
		}

		if ( ! $echo ) {
			return $str;
		}

		// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		echo $str;
	}

	/**
	 * Convert to bootstrap status classes
	 *
	 * @param  string $status
	 * @return string
	 */
	public function bootstrapStatus( $status ) {
		switch ( $status ) {
			case 'success':
				return 'success';
			case 'error':
				return 'danger';
			case 'warning':
				return 'warning';
			case 'info':
				return 'info';
			default:
				return 'info';
		}
	}


	/**
	 * Get a list of Flash Messages
	 *
	 * @return array
	 */
	private function getMessages() {
		return get_transient( $this->optionName, array() );
	}

	/**
	 * Save a Flash Message
	 *
	 * @param  mixed $messages
	 * @return void
	 */
	private function saveMessages( $messages ) {
		set_transient( $this->optionName, $messages, 5 * MINUTE_IN_SECONDS ); //expires in 5 minutes
	}

	/**
	 * Deletes a Flash Message
	 *
	 * @return void
	 */
	private function deleteMessages() {
		delete_transient( $this->optionName );
	}
}
