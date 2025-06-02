import { ResetIcon } from '@kubio/icons';
import {
	Button,
	FlexBlock,
	FlexItem,
	__experimentalText as Text,
} from '@wordpress/components';
import { useInstanceId } from '@wordpress/compose';
import { useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import _, { merge, noop } from 'lodash';
import isEqual from 'react-fast-compare';
import AllInputControl from './all-input-control';
import BoxControlIcon from './icon';
import InputControls from './input-controls';
import LinkedButton from './linked-button';
import {
	Header,
	HeaderControlWrapper,
	Root,
} from './styles/box-control-styles';
import { DEFAULT_VALUES, isValuesMixed } from './utils';
import Visualizer from './visualizer';

const defaultInputProps = {
	min: 0,
};

function useUniqueId( idProp ) {
	const instanceId = useInstanceId( BoxControl, 'inspector-box-control' );

	return idProp || instanceId;
}

export default function BoxControl( {
	id: idProp,
	inputProps = defaultInputProps,
	onChange = noop,
	onReset = noop,
	onChangeShowVisualizer = noop,
	label = __( 'Box Control', 'kubio' ),
	values: valuesProp = {},
	isRadius,
	min = 0,
	capMin = false,
	capMax = false,
	units = [
		{
			label: 'PX',
			value: 'px',
		},
		{
			label: '%',
			value: '%',
		},
		{
			label: 'EM',
			value: 'em',
		},
		{
			label: 'REM',
			value: 'rem',
		},
	],
} ) {
	const [ values, setValues ] = useState( valuesProp );
	const inputValues = merge( {}, DEFAULT_VALUES, values );
	const initialIsLinked = ! isValuesMixed( inputValues );
	const [ isLinked, setIsLinked ] = useState( initialIsLinked );
	const [ side, setSide ] = useState( isLinked ? 'all' : 'top' );

	useEffect( () => {
		if ( ! isEqual( valuesProp, values ) ) {
			// if not all sides are defined, the control must be unlinked by default.
			const newIsLinked = ! isValuesMixed( valuesProp );

			if ( newIsLinked !== isLinked ) {
				setIsLinked( newIsLinked );
			}

			setValues( valuesProp );
		}
	}, [ JSON.stringify( valuesProp ), isLinked ] );

	const id = useUniqueId( idProp );
	const headingId = `${ id }-heading`;

	const toggleLinked = () => {
		setIsLinked( ! isLinked );
		setSide( ! isLinked ? 'all' : 'top' );
	};

	const handleOnFocus = ( event, { side: nextSide } ) => {
		setSide( nextSide );
	};
	const handleOnChange = ( nextValues ) => {
		const localValue = _.merge( {}, values, nextValues );
		setValues( localValue );

		onChange( nextValues );
	};

	const handleOnReset = () => {
		const defaultValue = null;
		onReset();
		setIsLinked( true );
		setValues( defaultValue );
	};

	const inputControlProps = {
		...inputProps,
		onChange: handleOnChange,
		onFocus: handleOnFocus,
		isLinked,
		units,
		values: inputValues,
		capMin,
		capMax,
		min,
	};
	return (
		<Root
			id={ id }
			className="kubio-control"
			role="region"
			aria-label={ headingId }
		>
			<Header className="component-box-control__header">
				<FlexItem>
					<Text
						id={ headingId }
						className="component-box-control__label"
					>
						{ label }
					</Text>
				</FlexItem>
				<FlexItem>
					<LinkedButton
						onClick={ toggleLinked }
						isLinked={ isLinked }
					/>
				</FlexItem>
			</Header>

			<HeaderControlWrapper className="component-box-control__header-control-wrapper">
				<FlexItem>
					<BoxControlIcon side={ side } isRadius={ isRadius } />
				</FlexItem>
				{ isLinked && (
					<FlexBlock className={ 'kubio-spacing-box-container' }>
						<AllInputControl { ...inputControlProps } />
					</FlexBlock>
				) }
				{ ! isLinked && <InputControls { ...inputControlProps } /> }

				<FlexItem>
					<Button
						isSmall
						icon={ ResetIcon }
						label={ __( 'Reset', 'kubio' ) }
						className={
							'kubio-popover-options-icon kubio-color-indicator-popover-reset-icon kubio-border-control-button'
						}
						// disabled={!isDirty}
						onClick={ handleOnReset }
					/>
				</FlexItem>
			</HeaderControlWrapper>
		</Root>
	);
}

BoxControl.__Visualizer = Visualizer;
