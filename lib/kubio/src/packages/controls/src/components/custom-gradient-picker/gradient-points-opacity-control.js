import { useDebounce, useDeepCallback, useDeepMemo } from '@kubio/core';
import { useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import _ from 'lodash';
import isEqual from 'react-fast-compare';
import tinycolor from 'tinycolor2';
import GutentagRangeControl from '../range-control/range-control';
import { serializeGradient } from './serializer';
import { getMarkerPoints } from './utils';

const sliderConfig = {
	min: 0,
	max: 1,
	step: 0.1,
	capMax: true,
};

const GradientPointsOpacityControl = ( {
	gradientAST,
	onChange,
	resetValue = 0.7,
} ) => {
	const markerPoints = getMarkerPoints( gradientAST );

	const storePointsWithOpacity = useDeepMemo( () => {
		return markerPoints.map( ( point ) => {
			return {
				...point,
				opacity: tinycolor( point.color ).getAlpha(),
			};
		} );
	}, [ markerPoints ] );

	const [ localPointsWithOpacity, setLocalPointsWithOpacity ] = useState(
		storePointsWithOpacity
	);

	const [ isLinked, setIsLinked ] = useState(
		arePointsLinked( localPointsWithOpacity )
	);

	const storePointsWithOpacityMemoized = useDeepMemo( () => {
		return storePointsWithOpacity;
	}, [ storePointsWithOpacity ] );

	useEffect( () => {
		if ( ! isEqual( storePointsWithOpacity, localPointsWithOpacity ) ) {
			setLocalPointsWithOpacity( storePointsWithOpacity );
			const newIsLinked = arePointsLinked( storePointsWithOpacity );
			if ( ! isEqual( isLinked, newIsLinked ) ) {
				setIsLinked( newIsLinked );
			}
		}
	}, [ storePointsWithOpacityMemoized ] );

	const onLinkedValueChange = useDeepCallback(
		( newValue ) => {
			const newPointsWithOpacity = _.cloneDeep( localPointsWithOpacity );
			newPointsWithOpacity.forEach( ( point ) => {
				point.opacity = newValue;
			} );
			onMarkPointsChanged( newPointsWithOpacity );
		},
		[ onChange, localPointsWithOpacity, gradientAST ]
	);
	const onLinkedChangedDebounce = useDebounce( onLinkedValueChange, 250 );

	const onChangeUnlinked = useDeepCallback(
		( index, newValue ) => {
			const newPointsWithOpacity = _.cloneDeep( localPointsWithOpacity );
			_.set( newPointsWithOpacity, [ index, 'opacity' ], newValue );
			onMarkPointsChanged( newPointsWithOpacity );
		},
		[ onChange, localPointsWithOpacity, gradientAST ]
	);

	const onChangeUnlinkedDebounce = useDebounce( onChangeUnlinked, 250 );

	function onLocalChange( newMarkedPoints ) {
		const newIsLinked = arePointsLinked( newMarkedPoints );
		setLocalPointsWithOpacity( newMarkedPoints );
		if ( newIsLinked !== isLinked ) {
			setIsLinked( newIsLinked );
		}
	}

	function onMarkPointsChanged( newMarkedPointsWithOpacity ) {
		const nextGradient = {
			...gradientAST,
			colorStops: newMarkedPointsWithOpacity.map(
				( markedPoint, index ) => {
					const astPoint = _.get( gradientAST, [
						'colorStops',
						index,
					] );
					let opacity = markedPoint?.opacity;
					if ( ! opacity ) {
						opacity = 1;
					}
					const color = tinycolor( markedPoint.color );
					const colorValue = [
						color._r,
						color._g,
						color._b,
						opacity,
					];

					return {
						...astPoint,
						value: colorValue,
						type: 'rgba',
					};
				}
			),
		};
		const serialized = serializeGradient( nextGradient );
		onLocalChange( newMarkedPointsWithOpacity );
		onChange( serialized );
	}

	const firstControlPointOpacity = _.get(
		localPointsWithOpacity,
		[ 0, 'opacity' ],
		1
	);

	return (
		<div className="components-custom-gradient-picker__external-opacity-container">
			{ isLinked && (
				<GutentagRangeControl
					label={ __( 'Opacity', 'kubio' ) }
					value={ firstControlPointOpacity }
					{ ...sliderConfig }
					onChange={ onLinkedChangedDebounce }
					onReset={ () => {
						onLinkedChangedDebounce( resetValue );
					} }
				/>
			) }
			{ ! isLinked &&
				localPointsWithOpacity.map( ( controlPoint, index ) => (
					<GutentagRangeControl
						label={ __(
							'Opacity for point ' + ( index + 1 ),
							'kubio'
						) }
						value={ controlPoint?.opacity }
						{ ...sliderConfig }
						onChange={ ( newValue ) => {
							onChangeUnlinkedDebounce( index, newValue );
						} }
						onReset={ () => {
							onChangeUnlinkedDebounce( index, resetValue );
						} }
					/>
				) ) }
		</div>
	);
};

function arePointsLinked( markedPoints ) {
	const firstPointColor = _.get( markedPoints, [ 0, 'opacity' ] );
	return markedPoints.every(
		( point ) => point?.opacity === firstPointColor
	);
}

export { GradientPointsOpacityControl };
