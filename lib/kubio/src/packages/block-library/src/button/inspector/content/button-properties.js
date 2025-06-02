import {
	HorizontalTextAlignControlWithPath,
	IconPickerWithPath,
	KubioPanelBody,
	LinkControlWithData,
	SeparatorHorizontalLine,
	TinymceControlWithPath,
	ToggleControlWithPath,
} from '@kubio/controls';
import { WithDataPathTypes, withComputedData } from '@kubio/core';
import { AddItemIcon } from '@kubio/icons';
import { DataHelperContextFromClientId } from '@kubio/inspectors';

import { InspectorControls } from '@wordpress/block-editor';
import { Button } from '@wordpress/components';
import { compose, createHigherOrderComponent } from '@wordpress/compose';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import NamesOfBlocks from '../../../blocks-list';
import { ElementsEnum } from '../../../button-group/elements';
import LinkGroupProperties from '../../../link-group/inspector/content/group-propeties';
import { ButtonSize } from './button-size/component';

const editorSettings = {
	toolbar1: 'bold,italic',
};

const Component_ = ( props ) => {
	const { withInspector = true, withPanel = true } = props;

	const { groupClientId, showGroup } = props.computed;

	if ( withInspector ) {
		return (
			<InspectorControls>
				{ withPanel ? (
					<KubioPanelBody
						title={ __( 'Button Properties', 'kubio' ) }
					>
						<ButtonControls { ...props } />
					</KubioPanelBody>
				) : (
					<ButtonControls { ...props } />
				) }
				{ showGroup && (
					<DataHelperContextFromClientId clientId={ groupClientId }>
						<LinkGroupProperties
							panelLabel={ __( 'Button Group', 'kubio' ) }
							addButtonText={ __( 'Add button', 'kubio' ) }
							alignLabel={ __( 'Button group align', 'kubio' ) }
							spaceBetweenLabel={ __(
								'Space between buttons',
								'kubio'
							) }
						/>
					</DataHelperContextFromClientId>
				) }
			</InspectorControls>
		);
	}

	return (
		<>
			{ withPanel ? (
				<KubioPanelBody title={ __( 'Button Properties', 'kubio' ) }>
					<ButtonControls { ...props } />
				</KubioPanelBody>
			) : (
				<ButtonControls { ...props } />
			) }
			{ showGroup && (
				<DataHelperContextFromClientId clientId={ groupClientId }>
					<LinkGroupProperties
						panelLabel={ __( 'Button Group', 'kubio' ) }
						addButtonText={ __( 'Add button', 'kubio' ) }
						alignLabel={ __( 'Button group align', 'kubio' ) }
						spaceBetweenLabel={ __(
							'Space between buttons',
							'kubio'
						) }
					/>
				</DataHelperContextFromClientId>
			) }
		</>
	);
};

/**
 * This component holds the options for a selected button.
 *
 * @param               computed.computed
 * @param {Object}      computed                   The return of useComputed.
 * @param {boolean}     dynamicLink                This prop should declare if the selected button owns their link management
 *                                                 (for example Read More computes the link serverside) and should be hidden here.
 * @param {boolean}     withAlign                  If this component should display the align option.
 * @param {JSX.Element} buttonPropsBefore          Optional components before the options.
 * @param {JSX.Element} buttonPropsAfter           Optional components after the options
 * @param               computed.dynamicLink
 * @param               computed.withAlign
 * @param               computed.buttonPropsBefore
 * @param               computed.buttonPropsAfter
 * @param               computed.dataHelper
 * @return {JSX.Element} The Component.
 */
const ButtonControls = ( {
	computed,
	dynamicLink,
	withAlign,
	buttonPropsBefore,
	buttonPropsAfter,
	dataHelper,
} ) => {
	const {
		showIcon,
		onAdd,
		groupClientId,
		showGroup,
		isOutsideOfGroup,
		groupTextAlign,
	} = computed;

	const onTextChange = ( value ) => {
		const iconSpacingStoreOptions = {
			styledComponent: ElementsEnum.ICON,
		};
		const none = {
			value: 0,
			unit: 'px',
		};

		const { left, right } = dataHelper.getStyle(
			'margin',
			{},
			iconSpacingStoreOptions
		);

		if ( dataHelper.getAttribute( 'text' ) === '' ) {
			if ( left?.value || right?.value ) {
				const newMargin = {
					right: none,
					left: none,
				};

				dataHelper.setStyle(
					'margin',
					newMargin,
					iconSpacingStoreOptions
				);
			}
		}
	};

	return (
		<>
			{ buttonPropsBefore }

			<TinymceControlWithPath
				label={ __( 'Button text', 'kubio' ) }
				path={ 'text' }
				type={ WithDataPathTypes.ATTRIBUTE }
				editorSettings={ editorSettings }
				onTextChange={ onTextChange }
			/>

			<SeparatorHorizontalLine />

			{ ! dynamicLink && (
				<LinkControlWithData label={ __( 'Button link', 'kubio' ) } />
			) }

			<ButtonSize />

			<ToggleControlWithPath
				label={ __( 'Display icon', 'kubio' ) }
				type={ WithDataPathTypes.PROP }
				path="showIcon"
				isProOnly={ true }
				upgradeUrlArgs={ { source: 'button', content: 'icon' } }
			/>

			{ showIcon && (
				<IconPickerWithPath
					path="icon.name"
					type={ WithDataPathTypes.ATTRIBUTE }
				/>
			) }

			{ ! showGroup && withAlign && (
				<DataHelperContextFromClientId clientId={ groupClientId }>
					<SeparatorHorizontalLine />

					<HorizontalTextAlignControlWithPath
						label={ __( 'Button align', 'kubio' ) }
						type={ WithDataPathTypes.STYLE }
						path={ 'textAlign' }
						defaultValue={ groupTextAlign }
						style={ ElementsEnum.SPACING }
					/>
				</DataHelperContextFromClientId>
			) }

			{ ! showGroup && (
				<>
					{ ! isOutsideOfGroup && (
						<div className="components-base-control">
							<Button
								isPrimary
								icon={ AddItemIcon }
								onClick={ onAdd }
								className={
									'kubio-button-group-button sortable-collapse__add-button'
								}
							>
								{ __( 'Add button', 'kubio' ) }
							</Button>
						</div>
					) }
					{ buttonPropsAfter }
				</>
			) }
		</>
	);
};

const useComputed = ( dataHelper ) => {
	const groupColibriData = dataHelper.withParent();
	// some buttons are outside the group ( e.g. read more button )
	const groupClientId =
		groupColibriData.blockName === NamesOfBlocks.BUTTON_GROUP
			? groupColibriData?.clientId
			: false;

	const groupSpacingStoreOptions = {
		styledComponent: ElementsEnum.SPACING,
	};

	const groupTextAlign = groupColibriData.useStylePath(
		'textAlign',
		groupSpacingStoreOptions
	);

	const { childrenIds } = useSelect( ( select ) => {
		const { getBlockOrder } = select( 'core/block-editor' );

		return {
			childrenIds: groupClientId ? getBlockOrder( groupClientId ) : [],
		};
	} );

	const showGroup = childrenIds?.length > 1;
	const onAdd = () => {
		dataHelper.duplicate( {
			unlink: true,
			selectDuplicate: false,
		} );
	};

	const isOutsideOfGroup =
		groupColibriData.blockName !== NamesOfBlocks.BUTTON_GROUP;

	return {
		showIcon: dataHelper.getProp( 'showIcon' ),
		isOutsideOfGroup,
		groupTextAlign,
		showGroup,
		onAdd,
		groupClientId,
	};
};

const Component = compose( [
	withComputedData( useComputed ),
	createHigherOrderComponent(
		( WrappedComponent ) => ( ownProps ) => {
			const { dataHelper } = ownProps;
			const hasVideoParent =
				dataHelper.withParent().blockName === NamesOfBlocks.VIDEO;
			const dynamicLink = ownProps.dynamicLink || hasVideoParent;

			const withAlign = hasVideoParent ? false : ownProps.withAlign;
			return (
				<WrappedComponent
					{ ...ownProps }
					withAlign={ withAlign }
					dynamicLink={ dynamicLink }
				/>
			);
		},
		'checkParent'
	),
] )( Component_ );

export default Component;
