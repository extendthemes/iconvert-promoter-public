import { deepmergeAll } from '@kubio/utils';
import { compose, createHigherOrderComponent } from '@wordpress/compose';
import { useRef } from '@wordpress/element';
import { useKubioBlockContext } from '../../context';
// eslint-disable-next-line no-unused-vars
import isShallowEqual from '@wordpress/is-shallow-equal';
import { each, isFunction } from 'lodash';

const optionsDefault = {
	loadColibriData: false,
	useClientData: false,
	autoSave: false,
	clientId: null,
	propName: 'dataHelper',
};

/**
 * @callback MapSelectToPropsCallback
 * @param {ColibriHelper} dataHelper
 * @param {Object}        props
 * @param {string}        blockType
 */

const optionsAutoSaveDefault = {
	...optionsDefault,
	autoSave: true,
	loadColibriData: true,
};

/**
 * @param {MapSelectToPropsCallback | MapSelectToPropsCallback[]} mapSelectToProps
 * @param {any}                                                   options
 */
const withColibriDataAutoSave = ( mapSelectToProps, options = null ) => {
	const mergedOptions = deepmergeAll( [
		{},
		optionsAutoSaveDefault,
		options,
	] );
	return withColibriData( mapSelectToProps, mergedOptions );
};

const computeProps = ( dataHelper, ownProps, mapSelectToProps ) => {
	const { name } = ownProps;

	if ( isFunction( mapSelectToProps ) ) {
		mapSelectToProps = [ mapSelectToProps ];
	}

	const maps = [ {} ];

	each( mapSelectToProps, ( mapSelectToPropsFct ) => {
		if ( ! isFunction( mapSelectToPropsFct ) ) {
			return;
		}
		maps.push( mapSelectToPropsFct( dataHelper, ownProps, name ) );
	} );

	return deepmergeAll( maps );
};

/**
 * @param {MapSelectToPropsCallback | MapSelectToPropsCallback[]} mapSelectToProps
 * @param {any}                                                   options
 */

const withColibriData = ( mapSelectToProps ) => {
	return compose(
		createHigherOrderComponent(
			( WrappedComponent ) => ( ownProps ) => {
				const { name, ...rest } = ownProps;
				const { dataHelper } = useKubioBlockContext();

				const computedProps = useRef( null );
				const nextComputedProps = computeProps(
					dataHelper,
					ownProps,
					mapSelectToProps
				);

				if ( ! isShallowEqual( nextComputedProps, computedProps ) ) {
					computedProps.current = nextComputedProps;
				}

				return (
					<WrappedComponent
						{ ...rest }
						dataHelper={ dataHelper }
						computed={ computedProps.current }
						name={ name }
					/>
				);
			},
			'withColibriData/computed'
		)
	);
};
export { withColibriData, withColibriDataAutoSave };
