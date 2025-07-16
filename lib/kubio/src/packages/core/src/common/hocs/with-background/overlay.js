import _ from 'lodash';
import { overlayConfig } from '@kubio/style-manager';
import classnames from 'classnames';
const { computeOverlayShapeStyle, overlayDefaultValue, ShapesValues } =
	overlayConfig;

const getOverlayLayerComputedStyle = ( overlay ) => {
	let style = {};
	try {
		switch ( overlay.type ) {
			case 'color':
				style = {
					backgroundColor: overlay.color.value,
					opacity: overlay.color.opacity,
				};
				break;
			case 'gradient':
				style = {
					backgroundImage: overlay.gradient,
				};
				break;
		}
	} catch ( e ) {}
	return style;
};

const showShape = ( shape ) => {
	return shape.value !== ShapesValues.NONE;
};

const getShapeLayerClass = ( shape ) => {
	const shapeClasses = [ 'shape-layer' ];
	if ( showShape( shape ) ) {
		shapeClasses.push( 'kubio-shape-' + shape.value );
	}
	return shapeClasses;
};

const getShapeLayerStyle = ( shape ) => {
	return computeOverlayShapeStyle( {}, shape );
};

const BackgroundOverlay = ( props ) => {
	const { value } = props;
	const valueWithDefaults = _.merge( {}, overlayDefaultValue, value );
	const { enabled, shape } = valueWithDefaults;
	const overlayImageLayerStyle =
		getOverlayLayerComputedStyle( valueWithDefaults );

	return (
		enabled && (
			<div className="overlay-layer">
				<div
					className="overlay-image-layer"
					style={ overlayImageLayerStyle }
				/>
				{ showShape( shape ) && (
					<div
						style={ getShapeLayerStyle( shape ) }
						className={ classnames( getShapeLayerClass( shape ) ) }
					/>
				) }
			</div>
		)
	);
};

export { BackgroundOverlay };
