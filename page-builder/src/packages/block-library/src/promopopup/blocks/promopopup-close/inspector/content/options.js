import _ from 'lodash';
import {
	withComputedData,
	useTransformStyle,
	WithDataPathTypes,
} from '@kubio/core';
import {
	VerticalAlignControlWithPath,
	SeparatorHorizontalLine,
	HorizontalAlignControlWithPath,
	RangeWithUnitControl,
	IconPickerWithPath,
	KubioPanelBody,
} from '@kubio/controls';
import { __ } from '@wordpress/i18n';
import { ElementsEnum } from '../../elements';
import { DataHelperContextFromClientId } from '@kubio/inspectors';
import defaultValues from '../../block.json';

const Panel = ( { computed } ) => {
	const { horizontalOffset, verticalOffset, iconClientId } = computed;
	return (
		<>
			<KubioPanelBody
				title={ __( 'Icon properties', 'iconvert-promoter' ) }
			>
				<DataHelperContextFromClientId clientId={ iconClientId }>
					<IconPickerWithPath
						path="name"
						type={ WithDataPathTypes.ATTRIBUTE }
					/>
				</DataHelperContextFromClientId>
				<HorizontalAlignControlWithPath
					path="horizontalAlign"
					label={ __( 'Horizontal position', 'iconvert-promoter' ) }
					media="auto"
					type={ WithDataPathTypes.PROP }
				/>
				<RangeWithUnitControl
					label={ __( 'Horizontal offset', 'iconvert-promoter' ) }
					min={ -300 }
					max={ 300 }
					step={ 1 }
					capMin={ false }
					{ ...horizontalOffset }
				/>

				<SeparatorHorizontalLine fit={ false } />

				<VerticalAlignControlWithPath
					path="verticalAlign"
					label={ __( 'Vertical position', 'iconvert-promoter' ) }
					media="auto"
					type={ WithDataPathTypes.PROP }
				/>
				<RangeWithUnitControl
					label={ __( 'Vertical offset', 'iconvert-promoter' ) }
					min={ -300 }
					max={ 300 }
					step={ 1 }
					capMin={ false }
					{ ...verticalOffset }
				/>
			</KubioPanelBody>
		</>
	);
};

const useComputed = ( dataHelper, ownProps ) => {
	const iconClientId = _.get( dataHelper.withChildren(), [
		'0',
		'clientId',
	] );
	/**
	 * The vertical and horizontal offset values
	 */
	const transformDataHelper = useTransformStyle( dataHelper );

	// Transform X
	let unsetValue = getDefaultValue( 'inner.transform.translate[0].value' );
	const horizontalOffset = transformDataHelper.useStylePath(
		'transform.translate.x',
		{
			local: true,
			unsetValue,
			styledComponent: ElementsEnum.INNER,
		},
		unsetValue
	);

	// Transform Y
	unsetValue = getDefaultValue( 'inner.transform.translate[1].value' );
	const verticalOffset = transformDataHelper.useStylePath(
		'transform.translate.y',
		{
			local: true,
			unsetValue,
			styledComponent: ElementsEnum.INNER,
		},
		unsetValue
	);

	function getDefaultValue( path ) {
		const returnValue = _.cloneDeep(
			_.get(
				defaultValues.supports.kubio.default,
				`_style.descendants.${ path }`
			)
		);
		if (
			'next' === dataHelper.getAttribute( 'direction' ) &&
			path === 'inner.transform.translate[0].value'
		) {
			let currentValue = _.get( returnValue, 'value' );
			if ( currentValue && ! isNaN( currentValue ) ) {
				currentValue = parseFloat( currentValue ) * -1;
				returnValue.value = currentValue;
			}
		}

		return returnValue;
	}

	return {
		iconClientId,
		horizontalOffset,
		verticalOffset,
	};
};
const ArrowOptions = withComputedData( useComputed )( Panel );

export default ArrowOptions;
