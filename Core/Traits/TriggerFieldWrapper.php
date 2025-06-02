<?php
namespace CSPromo\Core\Traits;

trait TriggerFieldWrapper {

	/**
	 * Check if the field should only be inserted once
	 *
	 * @return boolean
	 */
	public function isUnique() {
		return $this->unique;
	}

	/**
	 * Response for building the form fields
	 *
	 * @return array
	 */
	public function response( $saved = '' ) {
		return array(
			'html'   => $this->html( $saved ),
			'unique' => $this->isUnique(),
		);
	}

	/**
	 * Get the posted values from the form
	 *
	 * @return array
	 */

	public function getPosted() {
		return true;
	}

	public function createDefault() {
		return $this->wrapHTML( $this->html() );
	}

	/**
	 * Wraps the field with wrapper HTML
	 *
	 * @param  string $html
	 * @return string
	 */
	public function wrapHTML( $html = '', $checked = false ) {
		ob_start() ?>
		<div class="cs-saved-trigger" id="<?php echo esc_attr( $this->fieldType ); ?>-wrapper">
			
			<label class="cs-switch">
				<input type="checkbox" class="cs-triggers-switch-button" data-trigger="<?php echo esc_attr( $this->fieldType ); ?>" value="ch" id="cs-checkbox-<?php echo esc_attr( $this->fieldType ); ?>" 
					<?php echo $checked ? 'checked' : ''; ?> name="triggers[<?php echo esc_attr( $this->fieldType ); ?>][checkbox]">
				<span class="cs-active-slider"></span>
			</label>    
			<?php
			// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			echo $html;
			?>
			<?php if ( ! $this->isUnique() ) : ?>
				<span class="cs-promo-extra-input" data-trigger="<?php echo esc_attr( $this->fieldType ); ?>"><span class="button button-add-min" data- >+</span></span>
			<?php endif; ?>
		</div>
		
		<?php
		$str = ob_get_clean();

		return $str;
	}
}
