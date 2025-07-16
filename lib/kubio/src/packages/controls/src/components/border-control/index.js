import _, { noop, unset, pickBy, get, each } from 'lodash';

import { useInstanceId } from '@wordpress/compose';
import { useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { UNSET_VALUE } from '@kubio/constants';
import {
	FlexItem,
	FlexBlock,
	Button,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalText as Text,
	SelectControl,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
} from '@wordpress/components';
import BorderControlIcon from './icon';
import UnitControl from '../box-control/unit-control';
import LinkedButton from './linked-button';
import Visualizer from './visualizer';
import {
	Root,
	Header,
	HeaderControlWrapper,
} from './styles/box-control-styles';
import { isValuesMixed, borderStylesOptions } from './utils';
import ColorIndicatorPopover from '../color/color-indicator-popover';
import { ResetIcon } from '@kubio/icons';
import classnames from 'classnames';
import { types, Utils } from '@kubio/style-manager';
import { mergeNoArrays } from '@kubio/utils';
import { GutentagSelectControl } from '../select-control';

function useUniqueId( idProp ) {
	const instanceId = useInstanceId( BorderControl, 'inspector-box-control' );

	return idProp || instanceId;
}

//TODO: make global
const UNITS = [
	{
		label: 'PX',
		value: 'px',
	},
];

const BorderSideControl = ( {
	value = {},
	mergedValue = {},
	side = '',
	onChange,
	onReset,
	units,
	className,
	withColor = true,
	showIcon = true,
	defaults,
} ) => {
	const { style = 'none', color, width = {} } = mergedValue;

	const handleOnReset = () => {
		onReset( side );
	};

	const onPropChange = ( path, nextValue ) => {
		const changes = {
			[ path ]: nextValue,
		};
		onChange( side, changes );
	};
	const handleWidthOnBlur = ( event ) => {
		if ( ! event.target.value && 0 !== event.target.value ) {
			const thisSide = 'all' === side ? 'top' : side;
			if ( defaults?.[ thisSide ]?.width ) {
				onPropChange( 'width', defaults[ thisSide ].width );
			}
		}
	};
	return (
		<HeaderControlWrapper
			className={ classnames(
				'component-box-control__header-control-wrapper',
				'kubio-border-control',
				'kubio-control',
				className
			) }
		>
			{ showIcon && (
				<FlexItem>
					<BorderControlIcon side={ side } />
				</FlexItem>
			) }
			<FlexBlock>
				<GutentagSelectControl
					className={ 'kubio-border-select-control' }
					options={ borderStylesOptions }
					value={ style }
					onChange={ ( nextValue ) =>
						onPropChange( 'style', nextValue )
					}
				/>
			</FlexBlock>

			<FlexBlock className={ 'kubio-border-control__width' }>
				<UnitControl
					value={ width }
					onChange={ ( nextValue ) =>
						onPropChange( 'width', nextValue )
					}
					units={ units }
					min={ 0 }
					onBlur={ handleWidthOnBlur }
				/>
			</FlexBlock>
			{ withColor && (
				<FlexItem>
					<ColorIndicatorPopover
						value={ color }
						onChange={ ( newColor ) =>
							onPropChange( 'color', newColor )
						}
					/>
				</FlexItem>
			) }
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
	);
};

export default function BorderControl( {
	id: idProp,
	onChange = noop,
	onReset = noop,
	value,
	label = __( 'Border', 'kubio' ),
	filters = {},
	withColor = true,
	showLinkButton = true,
	showLabel = true,
	showIcon = true,
	defaults,
} ) {
	const filtersDefault = {
		sides: [ 'top', 'right', 'bottom', 'left' ],
	};
	const mergedFilters = mergeNoArrays( {}, filtersDefault, filters );
	const allowedSides = get( mergedFilters, 'sides', [] );

	const sides = [ 'top', 'right', 'bottom', 'left' ].filter( ( side ) => {
		return allowedSides.includes( side );
	} );

	const mergedValue = _.merge( {}, types.props.border.default, value );

	const mergedTopValue = _.get( mergedValue, 'top', {} );
	const topValue = _.get( value, 'top', {} );

	const id = useUniqueId( idProp );
	const headingId = `${ id }-heading`;

	const [ isLinked, setIsLinked ] = useState(
		! isValuesMixed( mergedValue )
	);

	useEffect( () => {
		const newIsLinked = ! isValuesMixed( mergedValue );
		if ( isLinked !== newIsLinked ) {
			setIsLinked( newIsLinked );
		}
	}, [ JSON.stringify( value ) ] );

	const toggleLinked = () => {
		setIsLinked( ! isLinked );

		if ( isLinked === false ) {
			onValueChange( 'all', topValue );
		}
	};

	const onValueChange = ( side, newValue ) => {
		const noBorderRadiusValue = _.cloneDeep( newValue );
		_.unset( noBorderRadiusValue, 'radius' );
		const changes = {};
		if ( side !== 'all' ) {
			_.set( changes, side, noBorderRadiusValue );
			onChange( changes );
		} else {
			_.unset( noBorderRadiusValue, 'radius' );
			sides.forEach( ( item ) => {
				_.set( changes, item, noBorderRadiusValue );
			} );
		}
		onChange( changes );
	};

	const onValueReset = ( side ) => {
		const onResetFunction = ( side ) => {
			if ( ! _.get( value, [ side, 'radius' ] ) ) {
				onReset( side );
			} else {
				const properties = [ 'color', 'style', 'width' ];
				properties.forEach( ( property ) => {
					const path = [ side, property ].join( '.' );
					if ( _.get( value, path ) ) {
						onReset( path );
					}
				} );
			}
		};
		if ( side !== 'all' ) {
			onResetFunction( side );
		} else {
			sides.forEach( ( item ) => {
				onResetFunction( item );
			} );
		}
	};
	return (
		<Root
			id={ id }
			role="region"
			aria-labelledby={ headingId }
			className="kubio-control"
		>
			{ showLabel && (
				<Header className="component-box-control__header">
					<FlexItem>
						<Text
							id={ headingId }
							className="component-box-control__label"
						>
							{ label }
						</Text>
					</FlexItem>
					{ showLinkButton && (
						<FlexItem>
							<LinkedButton
								onClick={ toggleLinked }
								isLinked={ isLinked }
							/>
						</FlexItem>
					) }
				</Header>
			) }
			{ isLinked && (
				<BorderSideControl
					className={ 'kubio-border-side-control' }
					value={ topValue }
					mergedValue={ mergedTopValue }
					side={ 'all' }
					onChange={ onValueChange }
					onReset={ onValueReset }
					units={ UNITS }
					withColor={ withColor }
					showIcon={ showIcon }
					defaults={ defaults }
				/>
			) }
			{ ! isLinked &&
				sides.map( ( side ) => {
					return (
						<BorderSideControl
							className={ 'kubio-border-side-control' }
							value={ _.get( value, side ) }
							mergedValue={ _.get( mergedValue, side ) }
							side={ side }
							onChange={ onValueChange }
							onReset={ onValueReset }
							key={ side }
							units={ UNITS }
							withColor={ withColor }
							showIcon={ showIcon }
							defaults={ defaults }
						/>
					);
				} ) }
		</Root>
	);
}
export { BorderSideControl };
BorderControl.__Visualizer = Visualizer;
