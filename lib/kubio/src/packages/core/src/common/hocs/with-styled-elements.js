import { pascalCase } from '@kubio/utils';
import { compose, createHigherOrderComponent } from '@wordpress/compose';
import { useMemo } from '@wordpress/element';
import { applyFilters } from '@wordpress/hooks';
import classnames from 'classnames';
import {
	each,
	isArray,
	isFunction,
	isObject,
	// eslint-disable-next-line no-restricted-syntax
	memoize,
	merge,
	mergeWith,
	omit,
	reduce,
	set,
} from 'lodash';
import { BlockElementsContext, useKubioBlockContext } from '../../context';
import { useLocalId } from '../../hooks/filters/local-id';
import { getBlockStyledElementsWithClass } from '../../utils/index';
import { mergeWithConcatArrays } from '../../utils/lodash-extra';
import { BlockElementFactory } from '../styled-element/index';
import { getStyledElementBaseClasses } from '../styled-element/pure';

const hash = ( ...rest ) => {
	return JSON.stringify( ...rest );
};

const getStyledElementClassName = memoize(
	( { name, localId, styleRef, className, blockName, options } ) => {
		const newClassName = classnames(
			getStyledElementBaseClasses( {
				name,
				localId,
				styleRef,
				blockName,
				extraClasses: className,
				options,
			} )
		);
		return newClassName;
	},
	hash
);

const getStyledElementProps = memoize(
	( { name, styleRef, localId, props, blockName, options } ) => {
		const newProps = omit( props, [
			'disableStyleClasses',
			'withoutClasses',
		] );
		return {
			...newProps,
			className: getStyledElementClassName( {
				blockName,
				name,
				styleRef,
				localId,
				className: props?.className,
				options,
			} ),
		};
	},
	hash
);

const executeFunctions = ( mapElementStyles_ ) => {
	each( mapElementStyles_, ( item, key ) => {
		if ( isFunction( item ) ) {
			mapElementStyles_[ key ] = item();
		} else if ( isObject( item ) ) {
			executeFunctions( item );
		}
	} );
	return mapElementStyles_;
};

const mapStyledElementsProps = memoize(
	( { elements, styleRef, localId, blockName } ) => {
		const props = {};
		Object.keys( elements ).forEach( ( name ) => {
			const options = {
				disableStyleClasses: !! elements[ name ]?.disableStyleClasses,
				withoutClasses: elements[ name ]?.withoutClasses,
			};
			props[ name ] = getStyledElementProps( {
				name,
				styleRef,
				localId,
				props: elements[ name ],
				blockName,
				options,
			} );
		} );
		return props;
	}
);

const computeElementProps = memoize(
	( { currentElementProps, mappedProps, styleRef, localId, blockName } ) => {
		const elementProps = mapStyledElementsProps( {
			elements: mappedProps,
			styleRef,
			localId,
			blockName,
		} );
		const propsByElements = currentElementProps || [];
		propsByElements.push( elementProps );
		return {
			propsByElements,
		};
	},
	hash
);

const withStyledElementsProps = ( ...mapElementStyles ) => {
	function mergeArrayValues( objValue, srcValue ) {
		if ( isArray( objValue ) && ! isArray( srcValue ) ) {
			srcValue = [ srcValue ];
		}
		if ( ! isArray( objValue ) && isArray( srcValue ) ) {
			objValue = [ objValue ];
		}
		if ( isArray( objValue ) && isArray( srcValue ) ) {
			return objValue.concat( srcValue );
		}
	}

	const mapComputedToElements = ( computed, dataHelper, blockName ) => {
		let result = {};
		const fns = applyFilters( 'kubio.style-mappers', [
			...mapElementStyles,
		] );

		each( fns, ( mapFct ) => {
			result = mergeWith(
				result,
				executeFunctions(
					mapFct( { computed, dataHelper, blockName } )
				),
				mergeArrayValues
			);
		} );

		return result;
	};

	return createHigherOrderComponent(
		( WrappedComponent ) => ( ownProps ) => {
			const { propsByElements, attributes, computed, kubio } = ownProps;

			const { dataHelper } = useKubioBlockContext();
			const { name: blockName } = ownProps;

			const styleRef = ( kubio || attributes?.kubio )?.styleRef;
			const localId = useLocalId();

			const styledElementsByName = useMemo( () => {
				const styledElementsWithClass =
					getBlockStyledElementsWithClass( blockName );
				return reduce(
					styledElementsWithClass,
					function ( result, value ) {
						const wrapperAttributes = {};
						if ( value?.wrapper ) {
							set( wrapperAttributes, 'data-kubio', blockName );
						}
						result[ value.name ] = merge(
							{},
							{ tag: value.tag },
							{ className: value.classes || [] },
							wrapperAttributes,
							value.props
						);
						return result;
					},
					{}
				);
			}, [ blockName ] );

			const mappedProps = useMemo(
				() =>
					mergeWithConcatArrays(
						window.structuredClone( styledElementsByName ),
						mapComputedToElements( computed, dataHelper, blockName )
					),
				[ computed, dataHelper ]
			);

			const newProps = computeElementProps( {
				currentElementProps: propsByElements,
				mappedProps,
				styleRef,
				localId,
				blockName,
			} );

			return (
				<>
					<WrappedComponent { ...ownProps } { ...newProps } />
				</>
			);
		},
		'withStyledElementsProps'
	);
};

const mapPropsToStyledElements = ( propsByElements ) => {
	const mergedProps = {};
	( propsByElements || [] ).forEach( ( props ) => {
		Object.keys( props ).forEach( ( name ) => {
			const { className, ...rest } = props[ name ];
			const { className: currentClassName, ...restCurrent } =
				mergedProps[ name ] || {};
			mergedProps[ name ] = {
				...merge( {}, restCurrent, rest ),
				className: classnames( className, currentClassName ),
			};
		} );
	} );

	return mergedProps;
};

const mapBlockElements = memoize( ( { keys, blockName, clientId } ) => {
	const elements = {};
	keys.forEach( ( name ) => {
		elements[ pascalCase( name ) ] = BlockElementFactory(
			blockName,
			name,
			clientId
		);
	} );
	return elements;
}, hash );

const withStyledElements = ( ...mapElementStyles ) => {
	return compose(
		withStyledElementsProps( ...mapElementStyles ),
		createHigherOrderComponent(
			( WrappedComponent ) => ( ownProps ) => {
				const { name: blockName, clientId } = ownProps;
				const { propsByElements = [] } = ownProps;

				const finalProps = useMemo(
					() =>
						mapPropsToStyledElements( propsByElements, blockName ),
					[ propsByElements ]
				);

				const StyledElements = useMemo(
					() =>
						mapBlockElements( {
							keys: Object.keys( finalProps ),
							blockName,
							clientId,
						} ),
					[ finalProps ]
				);

				const rest = useMemo(
					() => omit( ownProps, [ 'propsByElements' ] ),
					[ ownProps ]
				);

				return (
					<BlockElementsContext.Provider value={ finalProps }>
						<WrappedComponent
							{ ...rest }
							StyledElements={ StyledElements }
						/>
					</BlockElementsContext.Provider>
				);
			},
			'withStyledElements'
		)
	);
};

export {
	withStyledElements,
	withStyledElementsProps,
	getStyledElementClassName,
};
