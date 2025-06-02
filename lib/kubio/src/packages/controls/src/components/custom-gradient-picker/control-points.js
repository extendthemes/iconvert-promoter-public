/**
 * External dependencies
 */
import classnames from 'classnames';
import _ from 'lodash';

/**
 * WordPress dependencies
 */
import {
	Component,
	useEffect,
	useRef,
	useCallback,
	forwardRef,
} from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';
import { useInstanceId } from '@wordpress/compose';

/**
 * Internal dependencies
 */
import {
	Button,
	Dropdown,
	VisuallyHidden,
	KeyboardShortcuts,
	Tooltip,
} from '@wordpress/components';
import { useOnClickOutside } from '@kubio/utils';
import { useDeepCallback } from '@kubio/core';
import {
	getGradientWithColorAtIndexChanged,
	getGradientWithControlPointRemoved,
	getGradientWithPositionAtIndexChanged,
	getGradientWithPositionAtIndexDecreased,
	getGradientWithPositionAtIndexIncreased,
	getHorizontalRelativeGradientPosition,
	isControlPointOverlapping,
} from './utils';
import {
	COLOR_POPOVER_PROPS,
	GRADIENT_MARKERS_WIDTH,
	MINIMUM_SIGNIFICANT_MOVE,
} from './constants';
import { GutentagColorPickerWithPalette } from '../color/gutentag-color-picker-with-palette';
import tinycolor from 'tinycolor2';
import { trash } from '@wordpress/icons';
class ControlPointKeyboardMove extends Component {
	constructor() {
		super( ...arguments );
		this.increase = this.increase.bind( this );
		this.decrease = this.decrease.bind( this );
		this.shortcuts = {
			right: this.increase,
			left: this.decrease,
		};
	}
	increase( event ) {
		// Stop propagation of the key press event to avoid focus moving
		// to another editor area.
		event.stopPropagation();
		const { gradientIndex, onChange, gradientAST } = this.props;
		onChange(
			getGradientWithPositionAtIndexIncreased(
				gradientAST,
				gradientIndex
			)
		);
	}

	decrease( event ) {
		// Stop propagation of the key press event to avoid focus moving
		// to another editor area.
		event.stopPropagation();
		const { gradientIndex, onChange, gradientAST } = this.props;
		onChange(
			getGradientWithPositionAtIndexDecreased(
				gradientAST,
				gradientIndex
			)
		);
	}
	render() {
		const { children } = this.props;
		return (
			<KeyboardShortcuts shortcuts={ this.shortcuts }>
				{ children }
			</KeyboardShortcuts>
		);
	}
}

function ControlPointButton_(
	{
		isOpen,
		position,
		color,
		onChange,
		gradientIndex,
		gradientAST,
		...additionalProps
	},
	ref
) {
	const instanceId = useInstanceId( ControlPointButton );
	const descriptionId = `components-custom-gradient-picker__control-point-button-description-${ instanceId }`;
	return (
		<ControlPointKeyboardMove
			onChange={ onChange }
			gradientIndex={ gradientIndex }
			gradientAST={ gradientAST }
		>
			<Tooltip text={ position }>
				<Button
					ref={ ref }
					aria-label={ sprintf(
						// translators: %1$s: gradient position e.g: 70%, %2$s: gradient color code e.g: rgb(52,121,151).
						__(
							'Gradient control point at position %1$s with color code %2$s.',
							'kubio'
						),
						position,
						color
					) }
					aria-describedby={ descriptionId }
					aria-haspopup="true"
					aria-expanded={ isOpen }
					className={ classnames(
						'components-custom-gradient-picker__control-point-button',
						{
							'is-active': isOpen,
						}
					) }
					style={ {
						left: position,
					} }
					{ ...additionalProps }
				/>
			</Tooltip>
			<VisuallyHidden id={ descriptionId }>
				{ __(
					'Use your left or right arrow keys or drag and drop with the mouse to change the gradient position. Press the button to change the color or remove the control point.',
					'kubio'
				) }
			</VisuallyHidden>
		</ControlPointKeyboardMove>
	);
}

const ControlPointButton = forwardRef( ControlPointButton_ );

export default function ControlPoints( {
	gradientPickerDomRef,
	ignoreMarkerPosition,
	markerPoints,
	onChange,
	gradientAST,
	onStartControlPointChange,
	onStopControlPointChange,
	alpha = true,
} ) {
	const controlPointMoveState = useRef();
	const colorPickerRef = useRef();
	const renderDataRef = useRef();
	const controlPointsButtonsRefs = useRef( [] );
	const onMouseMove = useDeepCallback(
		( event ) => {
			const relativePosition = getHorizontalRelativeGradientPosition(
				event.clientX,
				gradientPickerDomRef.current,
				GRADIENT_MARKERS_WIDTH
			);
			const {
				gradientAST: referenceGradientAST,
				position,
				significantMoveHappened,
			} = controlPointMoveState.current;
			if ( ! significantMoveHappened ) {
				const initialPosition =
					referenceGradientAST.colorStops[ position ].length.value;
				if (
					Math.abs( initialPosition - relativePosition ) >=
					MINIMUM_SIGNIFICANT_MOVE
				) {
					controlPointMoveState.current.significantMoveHappened = true;
				}
			}

			if (
				! isControlPointOverlapping(
					referenceGradientAST,
					relativePosition,
					position
				)
			) {
				onChange(
					getGradientWithPositionAtIndexChanged(
						referenceGradientAST,
						position,
						relativePosition
					)
				);
			}
		},
		[ controlPointMoveState.current, onChange ]
	);

	const cleanEventListeners = useDeepCallback( () => {
		if (
			window &&
			window.removeEventListener &&
			controlPointMoveState.current &&
			controlPointMoveState.current.listenersActivated
		) {
			jQuery( window ).off( 'mousemove.controlPoint' );
			jQuery( window ).off( 'mouseup.controlPoint' );
			// window.removeEventListener('mousemove', onMouseMove);
			// window.removeEventListener('mouseup', cleanEventListeners);
			onStopControlPointChange();
			controlPointMoveState.current.listenersActivated = false;
		}
	}, [
		onMouseMove,
		controlPointMoveState.current,
		onStopControlPointChange,
	] );

	useEffect( () => {
		return () => {
			cleanEventListeners();
		};
	}, [] );
	const onClickOutside = useCallback( () => {
		const onClose = _.get(
			renderDataRef,
			[ 'current', 'onClose' ],
			_.noop
		);
		onStopControlPointChange();
		onClose();
	}, [ renderDataRef?.current, onStopControlPointChange ] );
	useOnClickOutside( colorPickerRef, onClickOutside );

	const onClose = () => {
		onStopControlPointChange();
	};
	const onControlPointChange = ( { isOpen, onToggle } ) => {
		if (
			controlPointMoveState.current &&
			controlPointMoveState.current.significantMoveHappened
		) {
			return;
		}
		if ( isOpen ) {
			onStopControlPointChange();
		} else {
			onStartControlPointChange();
		}
		if ( isOpen ) {
			onToggle();
		}
	};

	const onMouseDown = ( index ) => {
		if ( window && window.addEventListener ) {
			controlPointMoveState.current = {
				gradientAST,
				position: index,
				significantMoveHappened: false,
				listenersActivated: true,
			};
			onStartControlPointChange();
			jQuery( window ).on( 'mousemove.controlPoint', onMouseMove );
			jQuery( window ).on( 'mouseup.controlPoint', cleanEventListeners );
			// window.addEventListener('mousemove', onMouseMove);
			// window.addEventListener('mouseup', cleanEventListeners);
		}
	};
	return markerPoints.map( ( point, index ) => {
		const anchorRef = _.get(
			controlPointsButtonsRefs.current,
			[ index ],
			gradientPickerDomRef.current
		);
		const popoverProps = {
			...COLOR_POPOVER_PROPS,
			anchorRef,
			shift: true,
		};
		return (
			point &&
			ignoreMarkerPosition !== point.positionValue && (
				<Dropdown
					key={ index }
					onClose={ onClose }
					renderToggle={ ( { isOpen, onToggle } ) => (
						<ControlPointButton
							ref={ ( node ) =>
								_.set(
									controlPointsButtonsRefs.current,
									[ index ],
									node
								)
							}
							key={ index }
							onClick={ () => {
								onControlPointChange( { isOpen, onToggle } );
								if ( isOpen ) {
									onToggle();
								}
							} }
							onDoubleClick={ () => {
								onControlPointChange( { isOpen, onToggle } );
								onToggle();
							} }
							onMouseDown={ () => {
								onMouseDown( index );
							} }
							isOpen={ isOpen }
							position={ point.position }
							color={ point.color }
							onChange={ onChange }
							gradientAST={ gradientAST }
							gradientIndex={ index }
						/>
					) }
					renderContent={ ( { onClose, isOpen, ...rest } ) => {
						renderDataRef.current = { onClose, isOpen };

						return (
							<>
								<GutentagColorPickerWithPalette
									ref={ colorPickerRef }
									returnRawValue={ true }
									value={ point.color }
									onChange={ ( color ) => {
										const rgb = tinycolor( color ).toRgb();
										onChange(
											getGradientWithColorAtIndexChanged(
												gradientAST,
												index,
												rgb
											)
										);
									} }
									hasButton={ markerPoints.length > 2 }
									buttonIcon={ trash }
									onButtonClick={ () => {
										onChange(
											getGradientWithControlPointRemoved(
												gradientAST,
												index
											)
										);
										onClose();
									} }
									alpha={ alpha }
								/>
							</>
						);
					} }
					popoverProps={ popoverProps }
				/>
			)
		);
	} );
}
