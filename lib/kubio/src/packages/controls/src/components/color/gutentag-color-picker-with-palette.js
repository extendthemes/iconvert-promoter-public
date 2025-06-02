import { BaseControl } from '@wordpress/components';
import { useEffect, useState, forwardRef } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { noop } from 'lodash';
import { SeparatorHorizontalLine } from '../index';
import GutentagColorPalette from './gutentag-color-palette';
import GutentagColorPicker from './gutentag-color-picker';
import isEqual from 'react-fast-compare';

const GutentagColorPickerWithPalette = forwardRef(
	(
		{
			showPalette = true,
			value,
			defaultValue = null,
			onChange,
			alpha,
			returnRawValue = false,
			onLiveChange = noop,
			hasButton = false,
			onReset = noop,
			onButtonClick = onReset,
			buttonIcon,
			buttonText,
		},
		ref
	) => {
		const [ currentColor, setCurrentColor ] = useState(
			defaultValue || value
		);

		const setColor = ( nextValue ) => {
			setCurrentColor( nextValue );
			onChange( nextValue );
		};

		const updateLiveColor = ( nextValue ) => {
			setCurrentColor( nextValue );
			onLiveChange( nextValue );
		};

		useEffect( () => {
			if ( value !== undefined && ! isEqual( value, currentColor ) ) {
				setCurrentColor( value );
			}
		}, [ currentColor, value ] );

		return (
			<div ref={ ref } className="kubio-control">
				<div className="h-dummy-focus-control">
					<BaseControl>
						<button></button>
						<BaseControl />
					</BaseControl>
				</div>
				{ showPalette && (
					<>
						<GutentagColorPalette
							onChange={ setColor }
							value={ currentColor }
							returnRawValue={ returnRawValue }
						/>
						<SeparatorHorizontalLine
							className={ 'kubio-color-picker-separator' }
						/>
					</>
				) }

				<GutentagColorPicker
					label={ __( 'Custom color', 'kubio' ) }
					value={ currentColor }
					onChange={ setColor }
					onLiveChange={ updateLiveColor }
					alpha={ alpha }
					hasButton={ hasButton }
					onButtonClick={ onButtonClick }
					returnRawValue={ returnRawValue }
					buttonIcon={ buttonIcon }
					buttonText={ buttonText }
				/>
			</div>
		);
	}
);

export { GutentagColorPickerWithPalette };
