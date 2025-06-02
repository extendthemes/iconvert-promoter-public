import { TextareaControl as TextareaControlBase } from '@wordpress/components';
import { useCallback, useEffect, useRef, useState } from '@wordpress/element';
import { debounce } from 'lodash';

const TextareaControl = ( { value, onChange, ...rest } ) => {
	const [ localValue, setLocalValue ] = useState( value );
	const [ isFocused, setFocus ] = useState( false );

	const onChangeRef = useRef( onChange );

	useEffect( () => {
		if ( ! isFocused ) {
			setLocalValue( value );
		}
	}, [ isFocused, value ] );

	useEffect( () => {
		onChangeRef.current = debounce( onChange, 300 );
	}, [ onChange ] );

	const onValueChange = useCallback( ( nextValue ) => {
		setLocalValue( nextValue );
		onChangeRef.current( nextValue );
	}, [] );

	return (
		<TextareaControlBase
			value={ localValue }
			onChange={ onValueChange }
			onFocus={ () => setFocus( true ) }
			onBlur={ () => setFocus( false ) }
			{ ...rest }
		/>
	);
};

export { TextareaControl };
