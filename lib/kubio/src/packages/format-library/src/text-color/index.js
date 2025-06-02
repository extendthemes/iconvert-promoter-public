import { useGlobalDataColors } from '@kubio/global-data';
import { RichTextToolbarButton } from '@wordpress/block-editor';
import {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { Icon, textColor as textColorIcon } from '@wordpress/icons';
import { removeFormat } from '@wordpress/rich-text';
import { isInsideKubioBlock } from '../custom/utils';
import { default as InlineColorUI, getActiveColor } from './inline';
import _ from 'lodash';

const name = 'kubio/text-color';
const title = __( 'Text color', 'kubio' );

function TextColorEdit( {
	value,
	onChange,
	isActive,
	activeAttributes,
	contentRef,
} ) {
	const [ isAddingColor, setIsAddingColor ] = useState( false );
	const { parseVariableColor } = useGlobalDataColors();

	const enableIsAddingColor = useCallback( () => {
		setIsAddingColor( true );
	}, [] );

	const disableIsAddingColor = useCallback( () => {
		setIsAddingColor( false );
	}, [] );

	const [ activeColor, setActiveColor ] = useState( null );

	useEffect( () => {
		setActiveColor( getActiveColor( name, value ) );
	}, [] );

	const colorIndicatorStyle = useMemo( () => {
		if ( ! activeColor ) {
			return undefined;
		}
		return {
			backgroundColor: parseVariableColor( activeColor ),
		};
	}, [ activeColor, parseVariableColor ] );

	const activeFormatsLength = ( value?.activeFormats || [] ).length;

	//https://mantis.iconvert.pro/view.php?id=51502
	const refreshKey = useMemo( () => {
		if ( activeFormatsLength > 0 ) {
			return Math.random();
		}

		return 0;
	}, [ activeFormatsLength ] );

	if ( ! isInsideKubioBlock( contentRef ) ) {
		return <></>;
	}

	return (
		<>
			<RichTextToolbarButton
				key={ isActive ? 'text-color' : 'text-color-not-active' }
				className="kubio-format-library-text-color-button"
				name={ isActive ? 'italic' : undefined }
				icon={
					<>
						<Icon icon={ textColorIcon } />
						{ isActive && (
							<span
								className="kubio-format-library-text-color-button__indicator"
								style={ colorIndicatorStyle }
							/>
						) }
					</>
				}
				title={ title }
				// If has no colors to choose but a color is active remove the color onClick
				onClick={ enableIsAddingColor }
			/>
			{ isAddingColor && (
				<InlineColorUI
					key={ refreshKey }
					name={ name }
					onClose={ disableIsAddingColor }
					activeAttributes={ activeAttributes }
					value={ value }
					currentColor={ activeColor }
					onChange={ ( nextColor, colorValue ) => {
						setActiveColor( colorValue );
						onChange( nextColor );
					} }
					onReset={ () => {
						onChange( removeFormat( value, name ) );
						disableIsAddingColor();
					} }
					contentRef={ contentRef }
				/>
			) }
		</>
	);
}

const textColor = {
	name,
	title,
	tagName: 'span',
	className: 'kubio-has-inline-color',
	attributes: {
		style: 'style',
	},
	edit: TextColorEdit,
};

export { textColor };
