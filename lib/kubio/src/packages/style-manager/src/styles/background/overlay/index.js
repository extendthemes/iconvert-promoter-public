import { ShapesValues } from './shapes';
import { types } from '../../../types';

const overlayDefaultValue = types.props.background.overlay.default;

const computeOverlayShapeStyle = ( style = {}, shape, {} = {} ) => {
	const shapeName = shape.value;
	if ( shapeName === ShapesValues.NONE ) {
		return style;
	}
	if ( shape.isTile ) {
		style.backgroundPosition = 'top left';
		style.backgroundRepeat = 'repeat';
	} else {
		style.backgroundPosition = 'center center';
		style.backgroundSize = 'cover';
		style.backgroundRepeat = 'no-repeat';
	}
	style.filter = `invert(${ shape.light }%)`;
	return style;
};

export { ShapesValues, overlayDefaultValue, computeOverlayShapeStyle };
