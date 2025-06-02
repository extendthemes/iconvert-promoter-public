import {
	allowedRichTextFormats,
	useBlockElementProps,
	useDebounce,
	withColibriDataAutoSave,
	withDispatchWpBLock,
	withStyledElements,
} from '@kubio/core';

import { useInheritedTextAlign } from '@kubio/global-data';
import { useBlockProps, RichText } from '@wordpress/block-editor';
import { compose, pure } from '@wordpress/compose';
import { useMemo, useCallback } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import classnames from 'classnames';
import { ElementsEnum } from './elements';
import { onReplaceFactory } from './on-replace-factory';
import { onSplitFactory } from './on-split-factory';
import { TextToolbar } from './toolbar';
import { isEmpty } from 'lodash';

const Component = ( props ) => {
	const { children, name } = props;

	let blockProps = useBlockProps(
		useBlockElementProps( ElementsEnum.TEXT, { 'data-kubio': name } )
	);

	blockProps = useMemo(
		() => ( {
			...blockProps,
			className: classnames( blockProps.className, [
				'kubio-block-wrapper',
			] ),
		} ),
		[ blockProps ]
	);

	return (
		<Component_ { ...props } blockProps={ blockProps }>
			{ children }
		</Component_>
	);
};

const allowedRichTextFormatsKubio = [
	...allowedRichTextFormats,
	'core/link',
	'core/code',
	'core/image',
	'kubio/font-family-weight',
];

const Component_ = pure( ( props ) => {
	const {
		name,
		computed,
		mergeBlocks,
		isDynamic,
		children,
		clientId,
		attributes,
		isSelected,
		blockProps,
	} = props;
	const { textAlign, content } = computed;

	// console.error('text', props, clientId, isSelected);

	const onSplit = useMemo(
		() => onSplitFactory( { attributes, name, clientId } ),
		[ attributes, name, clientId ]
	);

	const onReplace = useMemo(
		() => onReplaceFactory( { attributes, name, clientId } ),
		[ attributes, name, clientId ]
	);

	// do not debounce text change it impacts the undo
	const onReplaceCbk = useCallback( () => onReplace( [] ), [ onReplace ] );

	return (
		<>
			{ ! isDynamic && (
				<>
					{ isSelected && <TextToolbar computed={ computed } /> }
					<RichText
						identifier="content"
						{ ...blockProps }
						tagName={ 'p' }
						value={ content.value }
						onChange={ content.onChange }
						onMerge={ mergeBlocks }
						onSplit={ onSplit }
						onReplace={ onReplace }
						onRemove={ onReplaceCbk }
						textAlign={ textAlign.value }
						aria-label={
							content
								? __( 'Paragraph block', 'kubio' )
								: __( 'Empty paragraph block', 'kubio' )
						}
						placeholder={ __( 'Start writing ', 'kubio' ) }
						__unstableEmbedURLOnPaste
						__unstableAllowPrefixTransformations
						allowedFormats={ allowedRichTextFormatsKubio }
						data-empty={ isEmpty( content.value ) }
					/>
				</>
			) }

			{ isDynamic && <p { ...blockProps }>{ children }</p> }
		</>
	);
} );

const stylesMapper = ( { computed } ) => {
	const { isLead, dropCap } = computed;
	return {
		[ ElementsEnum.TEXT ]: {
			className: () => {
				const classes = [];
				if ( isLead ) {
					classes.push( 'h-lead' );
				}
				if ( dropCap ) {
					classes.push( 'has-drop-cap' );
				}
				return classes;
			},
		},
	};
};

const useComputed = ( dataHelper ) => {
	const defaultTextAlign = useInheritedTextAlign( dataHelper );

	const contentData = dataHelper.useAttributePath( 'content' );

	const onContentChange = useCallback( contentData.onChange, [
		dataHelper?.sharedData?.hash,
	] );

	const content = {
		value: contentData.value,
		onChange: onContentChange,
	};

	return {
		isLead: dataHelper.getProp( 'isLead' ),
		dropCap: dataHelper.getProp( 'dropCap' ),
		content,
		textAlign: dataHelper.useStylePath( 'textAlign', {}, defaultTextAlign ),
	};
};

const TextCompose = compose(
	withColibriDataAutoSave( useComputed ),
	withStyledElements( stylesMapper ),
	withDispatchWpBLock
);

const Text = TextCompose( Component );
export { Text };
