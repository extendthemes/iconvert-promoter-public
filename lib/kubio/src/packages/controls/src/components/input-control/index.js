import { ResetIcon } from '@kubio/icons';
import {
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalInputControl as InputControl,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalNumberControl as NumberControl,
	BaseControl,
	Button,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { cog } from '@wordpress/icons';
import { useMemo, forwardRef } from '@wordpress/element';
import classnames from 'classnames';
import _ from 'lodash';

const isEmptyCanBeZero = ( value ) => {
	return ! value && value !== 0 && value !== '0';
};

const GutentagInputControl = forwardRef( ( props, ref ) => {
	const {
		value,
		onChange = _.noop,
		allowSettings,
		allowReset,
		onClick,
		onReset,
		className,
		inline = false,
		numeric = false,
		debounceDelay = 300,
		onEnter = _.noop,
		useDebounce = true,
		...rest
	} = props;

	const baseControlClassName = classnames(
		'kubio-input-control-container',
		'kubio-control',
		{
			'settings-on': allowSettings || allowReset,
			'kubio-inline-input': inline,
		}
	);

	const onChangeDebounce = useMemo( () => {
		return _.debounce( onChange, debounceDelay );
	}, [ onChange, debounceDelay ] );

	const onInputChange = ( newValue ) => {
		if ( useDebounce ) {
			onChangeDebounce( newValue );
		} else {
			onChange( newValue );
		}
	};

	const onInputBlur = () => {
		if ( isEmptyCanBeZero( value ) ) {
			onReset();
		}
	};

	const onKeyDown = ( event ) => {
		if ( event.key === 'Enter' ) {
			onEnter( value );
		}
	};
	const inputControlsProps = {
		ref,
		className,
		value: value || ( numeric ? 0 : '' ),
		onChange: onInputChange,
		onKeyDown,
		...rest,
	};

	return (
		<>
			<BaseControl className={ baseControlClassName }>
				{ numeric && (
					<NumberControl
						onBlur={ onInputBlur }
						{ ...inputControlsProps }
					/>
				) }
				{ ! numeric && <InputControl { ...inputControlsProps } /> }
				{ allowSettings && (
					<Button
						isSmall
						icon={ cog }
						className={ 'kubio-input-control-button' }
						onClick={ onClick }
					/>
				) }
				{ allowReset && (
					<Button
						isSmall
						icon={ ResetIcon }
						label={ __( 'Reset', 'kubio' ) }
						className={ [
							'kubio-input-control-button',
							'kubio-popover-options-icon',
							'kubio-color-indicator-popover-reset-icon',
							'kubio-border-control-button',
						].join( ' ' ) }
						onClick={ () => onReset() }
					/>
				) }
			</BaseControl>
		</>
	);
} );

export { GutentagInputControl };
