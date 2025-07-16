import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { useSelect, withSelect } from '@wordpress/data';

import {
	withComputedData,
	WithDataPathTypes,
	withObserveOtherBlocks,
} from '@kubio/core';
import {
	SeparatorHorizontalLine,
	ColorWithPath,
	ToggleGroup,
	BordersAndRadiusWithPath,
	GradientColorPickerWithPath,
	GutentagSelectControl,
	RangeWithUnitWithPath,
	KubioPanelBody,
} from '@kubio/controls';
import { useInheritedTypographyValue } from '@kubio/global-data';
import { DataHelperContextFromClientId } from '@kubio/inspectors';
import { UNSET_VALUE } from '@kubio/constants';
import { ElementsEnum } from '../../elements';
import { properties } from './config';
import { compose } from '@wordpress/compose';

const commonOptions = {
	type: WithDataPathTypes.STYLE,
	style: ElementsEnum.ICON,
};

const Component_ = ( props ) => {
	const { computed, clientData } = props;
	const { clientId } = clientData;

	const {
		iconSpacing,
		iconPadding,
		styleType,
		borderColor,
		iconSize,
		currentState,
		setCurrentState,
		parentDataHelper,
	} = computed;

	const selectedClientId =
		styleType.value !== 'individual' ? parentDataHelper.clientId : clientId;

	return (
		<>
			<KubioPanelBody
				title={ __( 'Icon style', 'kubio' ) }
				initialOpen={ true }
			>
				<GutentagSelectControl
					label={ __( 'Style type', 'kubio' ) }
					options={ properties.styleTypeOptions }
					{ ...styleType }
				/>

				<DataHelperContextFromClientId clientId={ selectedClientId }>
					<SeparatorHorizontalLine fit={ false } />

					<ToggleGroup
						label={ __( 'State', 'kubio' ) }
						options={ properties.stateToggle.options }
						value={ currentState }
						onChange={ setCurrentState }
					/>

					{ styleType.value !== 'official' && (
						<ColorWithPath
							label={ __( 'Icon color', 'kubio' ) }
							showReset={ true }
							path={ 'fill' }
							{ ...commonOptions }
							state={ currentState }
						/>
					) }

					<GradientColorPickerWithPath
						label={ __( 'Icon background', 'kubio' ) }
						showReset={ true }
						path={ 'background' }
						{ ...commonOptions }
						state={ currentState }
					/>

					<ColorWithPath
						label={ __( 'Border color', 'kubio' ) }
						showReset={ true }
						path={ [
							'border.top.color',
							'border.bottom.color',
							'border.left.color',
							'border.right.color',
						] }
						{ ...commonOptions }
						state={ currentState }
						defaultValue={ borderColor[ currentState ] }
					/>

					<SeparatorHorizontalLine fit={ false } />

					<RangeWithUnitWithPath
						label={ __( 'Icon size', 'kubio' ) }
						capMin={ true }
						path={ 'size' }
						style={ ElementsEnum.ICON }
						{ ...iconSize }
					/>

					<RangeWithUnitWithPath
						label={ __( 'Icon spacing', 'kubio' ) }
						max={ 50 }
						path={ 'margin.right' }
						style={ ElementsEnum.ICON }
						{ ...iconSpacing }
					/>

					<RangeWithUnitWithPath
						label={ __( 'Icon padding', 'kubio' ) }
						capMin={ true }
						path={ [
							'padding.top',
							'padding.bottom',
							'padding.left',
							'padding.right',
						] }
						max={ 50 }
						style={ ElementsEnum.ICON }
						{ ...iconPadding }
					/>

					<SeparatorHorizontalLine fit={ false } />

					<BordersAndRadiusWithPath
						type="style"
						style={ ElementsEnum.ICON }
						path={ 'border' }
						withColor={ false }
					/>
				</DataHelperContextFromClientId>
			</KubioPanelBody>
		</>
	);
};

const useComputed = ( dataHelper, ownProps ) => {
	const { getBlockAttributes } = useSelect( 'core/block-editor' );
	// const { updateBlockAttributes } = useDispatch(blockEditorStore);
	const parentDataHelper = dataHelper.withParent();
	const [ currentState, setCurrentState ] = useState(
		properties.stateToggle.values.NORMAL
	);

	const commonStoreOptions = {
		styledComponent: ElementsEnum.ICON,
	};

	const parentStyle = ( style ) => {
		return parentDataHelper.getStyle( style, '', commonStoreOptions );
	};

	const setFillInBothStates = function ( color, store ) {
		store.setStyle( 'fill', color, {
			styledComponent: 'icon',
			state: 'normal',
		} );

		store.setStyle( 'fill', color, {
			styledComponent: 'icon',
			state: 'hover',
		} );
	};

	const styleType = {
		value: parentDataHelper.getProp( 'styleType', 'shared' ),
		onChange: ( newColorType ) => {
			// here we need a refreshed parent dataHelper to avoid cached data in sharedStyle
			const parentDataHelper2 = dataHelper.withParent();
			const kids = parentDataHelper2.withChildren();

			parentDataHelper2.setProp( 'styleType', newColorType );

			const blockAttributes = getBlockAttributes(
				parentDataHelper2.clientId
			);
			const { icon } = blockAttributes.kubio?.style?.descendants;

			switch ( newColorType ) {
				case 'official':
					// also reset the parent style when you change a child to official.
					setFillInBothStates( UNSET_VALUE, parentDataHelper2 );
					setFillInBothStates( UNSET_VALUE, dataHelper );
					kids.forEach( ( child ) => {
						child.unsetStyle( '', null, commonStoreOptions );
						setFillInBothStates( UNSET_VALUE, child );
						const tmp = child.getAttribute( 'icon' );
						const iconName = tmp.name.split( '/' ).pop();
						const colorProp = properties.objectColorIcons.find(
							( elem ) => iconName.startsWith( elem.name )
						);
						if ( ! colorProp ) {
							return;
						}
						setFillInBothStates( colorProp.color, child );
					} );
					break;
				case 'individual':
					kids.forEach( ( child ) => {
						child.setStyle( '', icon, commonStoreOptions );
					} );
					parentDataHelper2.unsetStyle(
						'',
						null,
						commonStoreOptions
					);
					break;
				case 'shared':
					let isFirst = true;

					kids.forEach( ( child ) => {
						const childAttributes = getBlockAttributes(
							child.clientId
						);
						// while switching from official style to shared we need to keep the block attributes
						// but when we switch from an individual icon, the source must be the first icon block
						const newStyle =
							styleType.value === 'individual'
								? childAttributes.kubio.style.descendants.icon
								: icon;

						if ( isFirst ) {
							parentDataHelper2.setStyle(
								'',
								newStyle,
								commonStoreOptions
							);
							isFirst = false;
						}

						child.unsetStyle( '', null, commonStoreOptions );
					} );
					break;

				default:
					break;
			}
		},
	};

	const borderColor = {
		normal: useInheritedTypographyValue( 'a', 'color' ),
		hover: useInheritedTypographyValue( 'a', 'states.hover.color' ),
	};

	const iconSize = {
		value: dataHelper.getStyle(
			'size',
			parentStyle( 'size' ),
			commonStoreOptions
		),
	};

	const iconSpacing = {
		value: dataHelper.getStyle(
			'margin.right',
			parentStyle( 'margin.right' ),
			commonStoreOptions
		),
	};

	const iconPadding = {
		value: dataHelper.getStyle(
			'padding.right',
			parentStyle( 'padding.right' ),
			commonStoreOptions
		),
	};

	return {
		iconSpacing,
		iconPadding,
		styleType,
		borderColor,
		iconSize,
		currentState,
		setCurrentState,
		parentDataHelper,
	};
};

const socialIconCompose = compose(
	withSelect( ( select, { clientId } ) => {
		const parentClientId =
			select( 'core/block-editor' ).getBlockRootClientId( clientId );
		return {
			parentClientId,
		};
	} ),
	withObserveOtherBlocks( ( select, { parentClientId } ) => {
		return parentClientId;
	} ),
	withComputedData( useComputed )
);
const Component = socialIconCompose( Component_ );

export default Component;
