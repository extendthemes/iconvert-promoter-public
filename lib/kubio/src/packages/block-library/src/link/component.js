import { RichText } from '@wordpress/block-editor';
import { compose } from '@wordpress/compose';
import {
	allowedRichTextFormats,
	useBlockElementProps,
	useDebounce,
	withColibriDataAutoSave,
	withStyledElements,
} from '@kubio/core';
import { CanvasIcon, LinkConfig } from '@kubio/controls';
import { __ } from '@wordpress/i18n';
import { properties } from './config';
const { getLinkAttributes } = LinkConfig;
import { ElementsEnum } from './elements';
import { LinkToolbarControl } from './toolbar/link-toolbar';
import { useBindOverlayDimensions } from '../common/hooks/use-bind-overlay-dimensions';
import { useRef, useCallback } from '@wordpress/element';
import { omit } from 'lodash';

const placeholderText = __( 'Start writing', 'kubio' );

const eventPreventDefault = ( event ) => {
	event.preventDefault();
};
const TextEdit = ( { blockProps, value, onChange } ) => {
	// omit editor related attributes - it might impact other elements like popovers behavior
	blockProps = omit( blockProps, [
		'data-block',
		'data-type',
		'data-title',
		'id',
	] );
	return (
		<RichText
			identifier="content"
			{ ...blockProps }
			value={ value }
			onChange={ onChange }
			allowedFormats={ allowedRichTextFormats }
			placeholder={ placeholderText }
		/>
	);
};

const Component = ( {
	computed,
	dataHelper,
	StyledElements,
	isSelected,
	setAttributes,
	clientId,
	withToolbar = true,
	withEditLink= true,
} ) => {
	const { showBeforeIcon, showAfterIcon, text } = computed;

	const textEditProps = useBlockElementProps( ElementsEnum.TEXT ); // removed block props as it messes up with toolbar position

	const onChange = useCallback(
		( newValue ) => {
			setAttributes( { text: newValue } );
		},
		[ setAttributes ]
	);

	const overlayBindRef = useRef();
	const ref = useRef();

	useBindOverlayDimensions( {
		clientId,
		containerRef: ref,
		bindToRef: overlayBindRef,
		offset: isSelected ? 2 : 0,
	} );

	return (
		<>
			{ isSelected && withToolbar && (
				<LinkToolbarControl
					dataHelper={ dataHelper }
					isSelected={ isSelected }
					clientId={ clientId }
					withEditLink={withEditLink}
				/>
			) }
			<StyledElements.Outer ref={ ref }>
				<StyledElements.Link
					onClick={ eventPreventDefault }
					ref={ overlayBindRef }
				>
					<StyledElements.Icon
						tag={ CanvasIcon }
						shouldRender={ showBeforeIcon }
					/>
					{ isSelected && (
						<TextEdit
							blockProps={ textEditProps }
							value={ text }
							onChange={ onChange }
						/>
					) }
					{ ! isSelected && (
						<StyledElements.Text
							dangerouslySetInnerHTML={ {
								__html: text || placeholderText,
							} }
						/>
					) }
					<StyledElements.Icon
						tag={ CanvasIcon }
						shouldRender={ showAfterIcon }
					/>
				</StyledElements.Link>
			</StyledElements.Outer>
		</>
	);
};

const mapPropsToElements = ( { computed } = {} ) => {
	return {
		[ ElementsEnum.ICON ]: {
			name: computed?.icon?.name,
		},
		[ ElementsEnum.LINK ]: {
			...computed?.linkAttributes,
		},
	};
};

const computed = ( dataHelper, ownProps ) => {
	const link = dataHelper.getAttribute( 'link' );
	const linkAttributes = getLinkAttributes( link );

	const icon = dataHelper.getAttribute( 'icon' );
	const iconEnabled = dataHelper.getProp( 'showIcon' );
	const iconPosition = dataHelper.getProp( 'iconPosition' );
	const iconPositionValues = properties.iconPosition.values;
	const showBeforeIcon =
		iconEnabled && iconPosition === iconPositionValues.BEFORE;
	const showAfterIcon =
		iconEnabled && iconPosition === iconPositionValues.AFTER;
	return {
		link,
		icon,
		showBeforeIcon,
		showAfterIcon,
		text: dataHelper.getAttribute( 'text' ),
		linkAttributes,
	};
};

const LinkCompose = compose(
	withColibriDataAutoSave( computed ),
	withStyledElements( mapPropsToElements )
);

const Link = LinkCompose( Component );
export { Link, Component };
