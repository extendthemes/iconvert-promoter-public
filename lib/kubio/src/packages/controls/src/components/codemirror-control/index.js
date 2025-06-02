import { useCallback, useEffect, useRef } from '@wordpress/element';
import { BaseControl } from '@wordpress/components';

const { codeEditor } = window.wp;

const CodeMirrorControl = ( { label, value = '', onChange, mode = 'css' } ) => {
	const ref = useRef( null );
	const editor = useRef( null );

	// useEffect(() => {
	// 	editor.current?.setValue(value);
	// }, [value]);

	const onEditorChange = useCallback(
		( instance ) => {
			onChange( instance.getValue() );
		},
		[ onChange ]
	);

	useEffect( () => {
		if ( ref.current && codeEditor && ! editor.current ) {
			const { codemirror } = codeEditor.initialize( ref.current, {
				...codeEditor.defaultSettings,
				codemirror: {
					...codeEditor.defaultSettings.codemirror,
					mode,
				},
			} );
			editor.current = codemirror;
			editor.current.setValue( value );
			editor.current.on( 'change', onEditorChange );
		}
	}, [ ref.current ] );

	return (
		<BaseControl label={ label }>
			<div className={ 'kubio-codemirror' }>
				<textarea ref={ ref } />
			</div>
		</BaseControl>
	);
};

export { CodeMirrorControl };
