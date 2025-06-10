import {
	composeWithKubioDataAndStyle,
	WithDataPathTypes,
	withComputedData,
} from '@kubio/core';
import { getBlocksMap } from '@kubio/block-library';
import { __ } from '@wordpress/i18n';
import {
	ContentInspectorControls,
	DataHelperContextFromClientId,
} from '@kubio/inspectors';
import { AddItemIcon } from '@kubio/icons';
import { Button, Notice } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import {
	HorizontalTextAlignControlWithPath,
	IconPickerWithPath,
	InputControlWithPath,
	KubioPanelBody,
	LinkControlWithData,
	SelectControlWithPath,
	SeparatorHorizontalLine,
	TinymceControlWithPath,
	ToggleControlWithPath,
} from '@kubio/controls';
import { ElementsEnum } from '../../elements';
import { ButtonSize } from './button-size/component';
import NamesOfBlocks from '../../../blocks-list';
import _ from 'lodash';

import { getBackendData } from '@kubio/utils';

const BlocksMap = getBlocksMap();
const button = BlocksMap?.button;
const buttonComponents = button?.Components || {};
const { ButtonProperties } = buttonComponents;
const buttonGroup = BlocksMap?.buttonGroup;
const { LinkGroupProperties } = buttonGroup?.Components?.ComponentParts || {};
const editorSettings = {
	toolbar1: 'bold,italic',
};

const Panel = ( { computed } ) => {
	const {
		dataHelper,
		buttonType,
		showIcon,
		isOutsideOfGroup,
		groupTextAlign,
		showGroup,
		onAdd,
		groupClientId,
	} = computed;

	const coupons = useSelect( ( select ) => {
		const { getEntityRecords } = select( 'core' );
		const couponsColection = [];
		const couponsRaw =
			getEntityRecords( 'postType', 'shop_coupon', {
				per_page: -1,
				_embed: true,
			} ) || [];

		couponsRaw.forEach( buildCoupons );
		function buildCoupons( coupon, index ) {
			couponsColection.push( {
				label: _.unescape( coupon.title.raw ),
				value: coupon.title.raw,
			} );
		}
		return couponsColection;
	} );

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
		<ContentInspectorControls>
			<KubioPanelBody
				title={ __( 'Button Properties', 'iconvert-promoter' ) }
			>
				<TinymceControlWithPath
					label={ __( 'Button text', 'iconvert-promoter' ) }
					path={ 'text' }
					type={ WithDataPathTypes.ATTRIBUTE }
					editorSettings={ editorSettings }
					onTextChange={ onTextChange }
				/>

				<SeparatorHorizontalLine />

				<SelectControlWithPath
					label={ __( 'Type', 'iconvert-promoter' ) }
					options={ [
						{ label: 'Link', value: 'link' },
						{ label: 'Copy text', value: 'copy' },
						{ label: 'Close Popup', value: 'close' },
						{ label: 'Apply coupon', value: 'coupon' },
						{ label: 'Empty page', value: 'empty' },
					] }
					type={ WithDataPathTypes.ATTRIBUTE }
					path={ 'buttonType' }
				/>
				{ buttonType === 'coupon' && (
					<>
						{ ! getBackendData( 'wooIsActive' ) && (
							<Notice
								spokenMessage={ null }
								status="warning"
								isDismissible={ false }
								className="cspromo-sidebar-button-notice-warning"
							>
								{ __(
									'This option requires WooCommerce plugin.',
									'iconvert-promoter'
								) }
							</Notice>
						) }
						{ !! getBackendData( 'wooIsActive' ) && (
							<SelectControlWithPath
								label={ __(
									'Select Coupon',
									'iconvert-promoter'
								) }
								options={ coupons }
								type={ WithDataPathTypes.ATTRIBUTE }
								path={ 'coupon' }
							/>
						) }
					</>
				) }
				{ buttonType === 'copy' && (
					<>
						<InputControlWithPath
							label={ __(
								'Copy this text',
								'iconvert-promoter'
							) }
							type={ WithDataPathTypes.ATTRIBUTE }
							path={ 'copyText' }
						/>

						<InputControlWithPath
							label={ __(
								'Copy text success',
								'iconvert-promoter'
							) }
							type={ WithDataPathTypes.ATTRIBUTE }
							path={ 'copyTextSuccess' }
						/>
					</>
				) }
				{ buttonType === 'link' && (
					<LinkControlWithData
						label={ __( 'Button link', 'iconvert-promoter' ) }
					/>
				) }

				{ buttonType !== 'close' && (
					<ToggleControlWithPath
						label={ __( 'Track conversions', 'iconvert-promoter' ) }
						type={ WithDataPathTypes.ATTRIBUTE }
						path="buttonTracking"
					/>
				) }

				<SeparatorHorizontalLine />

				<ToggleControlWithPath
					label={ __( 'Display icon', 'iconvert-promoter' ) }
					type={ WithDataPathTypes.PROP }
					path="showIcon"
					isProOnly={ false }
					upgradeUrlArgs={ { source: 'button', content: 'icon' } }
				/>
				{ showIcon && (
					<IconPickerWithPath
						path="icon.name"
						type={ WithDataPathTypes.ATTRIBUTE }
					/>
				) }

				<ButtonSize />

				{ ! showGroup && (
					<DataHelperContextFromClientId clientId={ groupClientId }>
						<SeparatorHorizontalLine />

						<HorizontalTextAlignControlWithPath
							label={ __( 'Button align', 'iconvert-promoter' ) }
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
									{ __( 'Add button', 'iconvert-promoter' ) }
								</Button>
							</div>
						) }
					</>
				) }
			</KubioPanelBody>
			{ showGroup && (
				<DataHelperContextFromClientId clientId={ groupClientId }>
					<LinkGroupProperties
						panelLabel={ __( 'Button Group', 'iconvert-promoter' ) }
						addButtonText={ __(
							'Add button',
							'iconvert-promoter'
						) }
						alignLabel={ __(
							'Button group align',
							'iconvert-promoter'
						) }
						spaceBetweenLabel={ __(
							'Space between buttons',
							'iconvert-promoter'
						) }
					/>
				</DataHelperContextFromClientId>
			) }
			{ /*<ButtonProperties withInspector={false}/>*/ }
		</ContentInspectorControls>
	);
};

const useComputed = ( dataHelper ) => {
	const groupColibriData = dataHelper.withParent();
	// some buttons are outside the group ( e.g. read more button )
	const groupClientId =
		groupColibriData.blockName === NamesOfBlocks.BUTTON_GROUP_EXTENDED
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
		groupColibriData.blockName !== NamesOfBlocks.BUTTON_GROUP_EXTENDED;

	return {
		dataHelper,
		buttonType: dataHelper.getAttribute( 'buttonType' ),
		showIcon: dataHelper.getProp( 'showIcon' ),
		isOutsideOfGroup,
		groupTextAlign,
		showGroup,
		onAdd,
		groupClientId,
	};
};
const Content = withComputedData( useComputed )( Panel );
export { Content };
