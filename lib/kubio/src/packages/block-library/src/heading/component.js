import { LinkWrapper } from '@kubio/controls';
import {
	allowedRichTextFormats,
	useBlockElementProps,
	useDebounce,
	useUndoTrapDispatch,
	withColibriDataAutoSave,
	withDispatchWpBLock,
	withIsSelected,
	withStyledElements,
} from '@kubio/core';
import { useInheritedTextAlign } from '@kubio/global-data';
import { RichText, useBlockProps } from '@wordpress/block-editor';
import { compose } from '@wordpress/compose';
import { useCallback, useEffect, useMemo } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import _ from 'lodash';
import { onReplaceFactory } from '../text/on-replace-factory';
import { onSplitFactory } from '../text/on-split-factory';
import { getFancyHtml } from './computed';
import { getTagName, getTagNameLevel } from './config';
import { ElementsEnum } from './elements';
import { HeadingToolbar } from './toolbar';
import { withFancyTitle } from './with-fancy-title';

const allowedFormats = [
	...allowedRichTextFormats,
	'core/link',
	'core/code',
	'core/image',
	'kubio/font-family-weight',
];

const HeadingComponent = ( props ) => {
	const {
		name,
		computed,
		StyledElements,
		mergeBlocks,
		isDynamicContent = false,
		children,
		showRichText = true,
		fancyOnMouseEnter = _.noop,
		fancyOnMouseLeave = _.noop,
		attributes,
		clientId,
	} = props;
	const {
		tagName,
		textAlign,
		content,
		link,
		htmlContent,
		headerType,
		shouldUpdateHeaderAttribute,
		level,
	} = computed;

	const blockProps = useBlockProps( {
		...useBlockElementProps( ElementsEnum.TEXT, { 'data-kubio': name } ),
		onMouseEnter: fancyOnMouseEnter,
		onMouseLeave: fancyOnMouseLeave,
	} );

	const applyUndoTrap = useUndoTrapDispatch();
	useEffect( () => {
		if ( shouldUpdateHeaderAttribute ) {
			applyUndoTrap(
				// transfom the set into a promise so we can properly trap the undo
				() =>
					new Promise( ( resolve ) => {
						headerType.onChange( level );
						setTimeout( resolve, 10 ); // delay the resolve to allow the store change
					} ),
				{ silent: true }
			);
		}
	}, [] );

	const onSplit = useMemo(
		() => onSplitFactory( { attributes, name, clientId } ),
		[ attributes, name, clientId ]
	);

	const onReplace = useMemo(
		() => onReplaceFactory( { attributes, name, clientId } ),
		[ attributes, name, clientId ]
	);

	const onRemove = useCallback( () => onReplace( [] )(), [ onReplace ] );

	return (
		<>
			<HeadingToolbar computed={ computed } />
			<LinkWrapper className={ 'd-block h-link' } link={ link }>
				{ ! showRichText && (
					<StyledElements.Text
						{ ...blockProps }
						dangerouslySetInnerHTML={ { __html: htmlContent } }
					/>
				) }
				{ isDynamicContent && children }
				{ showRichText && ! isDynamicContent && (
					<RichText
						identifier="content"
						tagName={ tagName }
						{ ...blockProps }
						style={ null }
						value={ content.value }
						onChange={ content.onChange }
						onMerge={ mergeBlocks }
						onSplit={ onSplit }
						onRemove={ onRemove }
						placeholder={ __( 'Write heading…', 'kubio' ) }
						textAlign={ textAlign.value }
						allowedFormats={ allowedFormats }
					/>
				) }
			</LinkWrapper>
		</>
	);
};

const stylesMapper = ( { computed } = {} ) => {
	return {
		[ ElementsEnum.TEXT ]: {
			tag: computed?.tagName,
		},
	};
};

const useComputed = ( dataHelper, ownProps ) => {
	const { isSelected } = ownProps;
	const defaultTextAlign = useInheritedTextAlign( dataHelper );

	const contentData = dataHelper.useAttributePath( 'content' );

	const onContentChange = useCallback( contentData.onChange, [
		dataHelper?.sharedData?.hash,
	] );

	const content = {
		value: contentData.value.replaceAll( '\\n', '<br>' ),
		onChange: onContentChange,
	};

	const fancy = dataHelper.getProp( 'fancy' );
	const fancyRotatingWords = dataHelper.usePropPath(
		'fancy.fancyRotatingWords'
	);
	const fancyData = {
		content: content.value,
		fancy,
	};

	let htmlContent = useMemo( () => {
		return getFancyHtml( fancyData );
	}, [ isSelected, fancyData ] );

	if ( ! htmlContent ) {
		htmlContent = __( 'Write heading…', 'kubio' );
	}

	const tagName = getTagName( dataHelper );

	const tagLevelProp = dataHelper.getProp( 'level', false, {
		media: 'desktop',
	} );

	return {
		isSelected,
		content,
		htmlContent,
		tagName,
		fancy,
		headerType: dataHelper.usePropPath( 'level', { media: 'desktop' } ),
		link: dataHelper.getAttribute( 'link' ),
		textAlign: dataHelper.useStylePath( 'textAlign', {}, defaultTextAlign ),
		shouldUpdateHeaderAttribute: tagLevelProp !== parseInt( tagLevelProp ),
		level: getTagNameLevel( dataHelper ),
		shouldUpdateFancyRotatingWords:
			fancyRotatingWords.value === 'beautifulnamazingnimpressive',
		fancyRotatingWords,
	};
};

const HeadingCompose = compose(
	withIsSelected,
	withColibriDataAutoSave( useComputed ),
	withStyledElements( stylesMapper ),
	withDispatchWpBLock,
	withFancyTitle
);

const Heading = HeadingCompose( HeadingComponent );
export { Heading };
