import { compose, createHigherOrderComponent } from '@wordpress/compose';
import { useRef } from '@wordpress/element';
import _, { defaults, get } from 'lodash';
import { useKubioBlockContext } from '../../context';
import { useDataHelperDefaultOptionsContext } from '../../context/data-helper-default-options-context';
import { useDataHelperPath } from '../../hooks';

const WithDataPathTypes = {
	STYLE: 'style',
	PROP: 'prop',
	ATTRIBUTE: 'attr',
	CONTEXT: 'context',
};

const withColibriPath = createHigherOrderComponent(
	( WrappedComponent ) => ( ownProps ) => {
		const {
			path,
			style: styledComponent,
			type = 'style',
			local = false,
			state,
			mergeData = true,
			mergeArrays = false,
			defaultValue,
			dataHelper: customDataHelper,
			...rest
		} = ownProps;

		let { media } = ownProps;

		// send props in desktop only by default//
		if ( media === undefined && type === 'prop' ) {
			media = 'desktop';
		}

		//used to make getPropInMedia/setPropInMedia
		if ( media === 'auto' ) {
			media = undefined;
		}

		const { dataHelper: currentDataHelper } = useKubioBlockContext();
		const dataHelper = customDataHelper
			? customDataHelper
			: currentDataHelper;

		const dataHelperDefaultOptions = useDataHelperDefaultOptionsContext();
		const { defaultOptions: inheritedOptions } = dataHelperDefaultOptions;

		if ( media === 'current' ) {
			media = inheritedOptions.media;
		}
		let attributeConfig = null;

		if ( type === WithDataPathTypes.ATTRIBUTE ) {
			attributeConfig = get(
				dataHelper,
				[ 'block', 'attributes', path ],
				null
			);
		}

		let styledComponentOptions = styledComponent;
		let styledComponentComponent = styledComponent;
		if ( undefined !== styledComponent ) {
			styledComponentOptions = _.castArray( styledComponentOptions );
			styledComponentComponent = styledComponentOptions[ 0 ];
		}

		const options = defaults(
			{
				styledComponent: styledComponentOptions,
				local,
				media,
				state,
				mergeData,
				mergeArrays,
				castType: null,
				attributeConfig,
				onChange: ownProps?.onChange,
			},
			inheritedOptions
		);

		const { value, onChange, onReset } = useDataHelperPath(
			dataHelper,
			type,
			path,
			options,
			defaultValue
		);

		return (
			<WrappedComponent
				styledComponent={ styledComponentComponent }
				value={ value }
				onChange={ onChange }
				onReset={ onReset }
				{ ...rest }
			/>
		);
	},
	'withColibriPath'
);

const withColibriPathWithOptions = ( options = {} ) => {
	return compose(
		createHigherOrderComponent(
			( WrappedComponent ) => ( props ) => {
				return <WrappedComponent { ...props } { ...options } />;
			},
			'withColibriPathNoMerge'
		),
		withColibriPath
	);
};
const withColibriPathNoMerge = compose(
	createHigherOrderComponent(
		( WrappedComponent ) => ( props ) => {
			return <WrappedComponent mergeData={ false } { ...props } />;
		},
		'withColibriPathNoMerge'
	),
	withColibriPath
);

export {
	withColibriPath,
	withColibriPathNoMerge,
	WithDataPathTypes,
	withColibriPathWithOptions,
};
