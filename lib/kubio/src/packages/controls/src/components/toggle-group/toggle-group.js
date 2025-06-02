import {
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalRadio as Radio,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalRadioGroup as RadioGroup,
	BaseControl,
	Button,
	Tooltip,
} from '@wordpress/components';
import { Icon } from '@wordpress/icons';
import { ResetIcon } from '@kubio/icons';
import { __ } from '@wordpress/i18n';
import { UNSET_VALUE } from '@kubio/constants';
import _, { isArray } from 'lodash';
import { useCallback, useEffect, useRef, useState } from '@wordpress/element';
import classnames from 'classnames';
import {
	ProBadge,
	proItemOnFreeClass,
	proItemOnFree,
	useProModal,
} from '@kubio/pro';

const RadioGroupItem = ( item ) => {
	const {
		icon,
		value,
		label,
		tooltip,
		disabledOptions,
		utmSource = 'group',
	} = item;
	const [ ProModal, showProModal ] = useProModal();
	const disabled = item?.isProOnFree || disabledOptions.includes( value );

	if ( icon ) {
		icon.key = icon.key || `${ value }-icon`;
		if ( isArray( icon.props.children ) ) {
			icon.props.children.forEach(
				( child, index ) =>
					( child.key =
						child.key || `${ value }-icon-child-${ index }` )
			);
		}
	}

	const onClick = ( e ) => {
		if ( disabled ) {
			e.preventDefault();
			if ( item?.isProOnFree ) {
				showProModal( true, `block-pro-modal-radio-${ value }` );
			}
		}
	};

	const radio = (
		<Radio
			value={ value }
			className={ classnames(
				{
					'kubio-streched-radio--disabled':
						disabledOptions.includes( value ) ||
						proItemOnFree( item ),
					'radio-disabled': disabled,
				},
				proItemOnFreeClass( item )
			) }
			onClick={ onClick }
		>
			<>
				{ icon && <Icon icon={ icon } /> }
				{ ! icon && label }
				{ item?.isProOnFree && (
					<>
						<ProBadge item={ item } />
						<ProModal
							id={ `block-pro-modal-radio-${ value }` }
							urlArgs={ { source: utmSource, content: value } }
						/>
					</>
				) }
			</>
		</Radio>
	);

	if ( tooltip && ! disabled ) {
		return <Tooltip text={ tooltip }>{ radio }</Tooltip>;
	}
	return radio;
};

const ToggleGroupBase = ( props ) => {
	const {
		options,
		disabledOptions,
		checked,
		onChange,
		label,
		className,
		utmSource = 'group',
		...rest
	} = props;

	const [ value, setValue ] = useState( checked );

	const onChangeRef = useRef();
	onChangeRef.current = onChange;

	useEffect( () => {
		setValue( checked );
	}, [ checked ] );

	const handleOnChange = useCallback( ( item ) => {
		if ( proItemOnFree( item ) ) {
			return;
		}
		setValue( item );
		onChangeRef.current( item );
	}, [] );
	return (
		<>
			<RadioGroup
				{ ...rest }
				accessibilityLabel={ label }
				className={ classnames(
					'kubio-streched-radio-group ' + className
				) }
				checked={ value }
				onChange={ handleOnChange }
			>
				{ options.map( ( option ) => (
					<RadioGroupItem
						key={ option.value }
						{ ...option }
						utmSource={ utmSource }
						disabledOptions={ disabledOptions }
					/>
				) ) }
			</RadioGroup>
		</>
	);
};

//gutenberg's radio group does not accept falsey values, if you have an option falsy it will not be selected
//because of that we are using a mapper to workaround this problem
const falseyMapperSetter = {
	zero_placeholder_1232: 0,
	false_placeholder_12323: false,
	null_placeholder_12323: null,
	undefined_placeholder_12323: undefined,
};
const falseySetterMappedValues = Object.keys( falseyMapperSetter );
const falseyMapperGetter = _.invert( falseyMapperSetter );
const falseyGetterMappedValues = [ 0, null, undefined, false ];

const ToggleGroup = ( props ) => {
	let {
		value,
		onChange,
		label,
		className,
		allowReset,
		onReset,
		options,
		disabledOptions = [],
		resetOnLabel = false,
		utmSource = 'content',
		...rest
	} = props;

	const disabledValues = options
		.filter( ( option ) => option.isProOnFree )
		.map( ( option ) => option.value );

	const onResetDefault = () => {
		onChange( UNSET_VALUE );
	};

	const onToggleChange = ( newValue ) => {
		if ( newValue === value || disabledValues.includes( newValue ) ) {
			return;
		}
		if ( falseySetterMappedValues.includes( newValue ) ) {
			newValue = _.get( falseyMapperSetter, newValue );
		}
		onChange( newValue );
	};

	const getMappedOptions = useCallback( () => {
		return options.map( ( option ) => {
			const newOption = _.cloneDeep( option );
			if ( falseyGetterMappedValues.includes( newOption.value ) ) {
				newOption.value = _.get( falseyMapperGetter, option.value );
			}

			return newOption;
		} );
	}, [ options ] );

	const mappedOptions = getMappedOptions();
	const getMappedValue = useCallback( () => {
		if ( falseyGetterMappedValues.includes( value ) ) {
			return _.get( falseyMapperGetter, value );
		}

		return value;
	}, [ value ] );
	const mappedValue = getMappedValue();
	onReset = onReset || onResetDefault;
	return (
		<BaseControl
			className={ classnames(
				'kubio-streched-radio-group__container',
				'kubio-control'
			) }
		>
			<div className="d-flex justify-content-between align-items-center">
				<BaseControl.VisualLabel>{ label }</BaseControl.VisualLabel>
				{ allowReset && resetOnLabel && (
					<ResetButton onReset={ onReset } />
				) }
			</div>
			<div className="kubio-horizontal-align-container">
				<ToggleGroupBase
					{ ...rest }
					className={ className }
					checked={ mappedValue }
					options={ mappedOptions }
					disabledOptions={ disabledOptions }
					onChange={ onToggleChange }
					utmSource={ utmSource }
				/>
				{ allowReset && ! resetOnLabel && (
					<ResetButton onReset={ onReset } />
				) }
			</div>
		</BaseControl>
	);
};
const ResetButton = ( { onReset } ) => {
	return (
		<Button
			isSmall
			icon={ ResetIcon }
			label={ __( 'Reset', 'kubio' ) }
			className={
				'kubio-popover-options-icon kubio-color-indicator-popover-reset-icon kubio-border-control-button'
			}
			onClick={ onReset }
		/>
	);
};
export { ToggleGroup };
