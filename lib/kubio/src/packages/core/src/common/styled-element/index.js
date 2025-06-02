import { useBlockProps } from '@wordpress/block-editor';
import { getBlockType } from '@wordpress/blocks';
import { useRegistry } from '@wordpress/data';
import { forwardRef, useEffect, useMemo, useRef } from '@wordpress/element';
import classnames from 'classnames';
import { get, isEmpty, isString, merge, omit } from 'lodash';
import { useBlockElementsContext } from '../../context';
import { getBlockWrapperElement } from '../../utils';

const mergeProps = ( oldProps, newProps ) => {
	const { className: oldClassName, ...oldRest } = oldProps || {};
	const { className: currentClassName, ...currentRest } = newProps || {};

	return {
		...merge( {}, currentRest, oldRest ),
		className: classnames( oldClassName, currentClassName ),
	};
};

const BlockElementFactory = ( blockName, elementName, clientId ) => {
	const wrapperElement = getBlockWrapperElement( blockName );
	const useWrapper =
		wrapperElement?.name === elementName &&
		wrapperElement.useBlockProps !== false;
	const component = forwardRef( ( props, ref ) => {
		const newProps = omit(
			{
				...props,
				elementName,
				ref,
				clientId,
				blockName,
			},
			'href' // disable href attribute in editor
		);
		const TagName = useWrapper ? WrapperStyledElement : StyledElement;
		return <TagName { ...newProps } />;
	} );

	component.displayName = `@StyledElement[${
		useWrapper ? 'Wrapper' : 'Element'
	}]:${ blockName }:${ elementName }`;

	return component;
};

const eventPreventDefault = ( event ) => {
	event.preventDefault();
};

const Element = forwardRef( ( props, ref ) => {
	// eslint-disable-next-line no-unused-vars
	const { tag: Tag = 'div', clientId, tagName, ...rest } = props;
	const localRef = useRef();

	let nextRef;

	if ( isString( Tag ) ) {
		nextRef = ref;
		if ( ! nextRef ) {
			nextRef = localRef;
		}
	}

	useEffect( () => {
		const element = nextRef?.current;
		if ( Tag === 'a' && element ) {
			element.addEventListener( 'click', eventPreventDefault );

			return () => {
				element.removeEventListener( 'click', eventPreventDefault );
			};
		}
	}, [ Tag, nextRef ] );

	return <Tag { ...rest } ref={ nextRef } />;
} );

const StyledElement = forwardRef( ( props, ref ) => {
	const { elementName, children, ...restOfProps } = props;

	const propsByElementName = useBlockElementsContext();
	const newProps = useMemo(
		() => mergeProps( restOfProps, propsByElementName?.[ elementName ] ),
		[ elementName, propsByElementName, restOfProps ]
	);

	const { shouldRender = true, ...rest } = newProps;
	const key = elementName;
	const { key: elementKey, ...elementProps } = {
		...omit( rest, 'blockName' ),
		key,
		ref,
		children: ! rest?.dangerouslySetInnerHTML ? children : undefined,
	};
	return ! shouldRender ? (
		<></>
	) : (
		<Element key={ elementKey } { ...elementProps } />
	);
} );

const WrapperStyledElement = forwardRef( ( props, ref ) => {
	const {
		elementName,
		children,
		// eslint-disable-next-line no-unused-vars
		clientId,
		// eslint-disable-next-line no-unused-vars
		blockName,
		style,
		...restOfProps
	} = props;

	const registry = useRegistry();

	const block = registry.select( 'core/block-editor' ).getBlock( clientId );
	const migrationClasses = get( block, 'attributes.kubio.migrations', [] )
		.map( ( migrationId ) => `kubio-migration--${ migrationId }` )
		.join( ' ' );

	const styleRef = get( block, 'attributes.kubio.styleRef' );

	const propsByElementName = useBlockElementsContext();
	const newProps = useMemo(
		() => mergeProps( restOfProps, propsByElementName?.[ elementName ] ),
		[ elementName, propsByElementName, restOfProps ]
	);

	const { shouldRender = true, ...rest } = newProps;
	const key = elementName;

	const wrapperRef = useRef();

	const { key: elementKey, ...blockProps } = useBlockProps( {
		...rest,
		ref: ref || wrapperRef,
		key,

		style: isEmpty( style ) ? undefined : style,
		'data-kubio-disable-inbetween-inserter':
			getBlockType( blockName ).innerBlocksDisableInBetweenInserter,
		className: classnames(
			rest.className,
			[ 'kubio-block-wrapper' ],
			migrationClasses
		),
		'data-kubio-style-ref': styleRef ? styleRef : undefined,
	} );

	return ! shouldRender ? (
		<></>
	) : (
		<Element
			children={ ! rest?.dangerouslySetInnerHTML ? children : undefined }
			key={ elementKey }
			{ ...blockProps }
			data-kubio={ blockProps[ 'data-type' ] || '' } // make sure to always set the data-kubio attribute on wrapper
		/>
	);
} );

WrapperStyledElement.displayName = 'WrapperStyledElement';
StyledElement.displayName = 'StyledElement';

export { BlockElementFactory, StyledElement, WrapperStyledElement };
