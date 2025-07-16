import {
	HorizontalTextAlignControlWithPath,
	IconPickerWithPath,
	KubioPanelBody,
	LinkControlWithData,
} from '@kubio/controls';
import { useKubioBlockContext, WithDataPathTypes } from '@kubio/core';
import { useInheritedTextAlign } from '@kubio/global-data';
import { createHigherOrderComponent } from '@wordpress/compose';
import { __ } from '@wordpress/i18n';
import NamesOfBlocks from '../../../blocks-list';
import { ElementsEnum } from '../../elements';

const Panel = ({
	withLinkControl,
	withAlignControl,
	styledContainer = ElementsEnum.OUTER,
	path = 'name',
}) => {
	const defaultTextAlign = useInheritedTextAlign();

	return (
		<KubioPanelBody title={__('Icon Properties', 'kubio')}>
			<IconPickerWithPath
				path={path}
				type={WithDataPathTypes.ATTRIBUTE}
			/>
			{withAlignControl && (
				<HorizontalTextAlignControlWithPath
					path="textAlign"
					defaultValue={defaultTextAlign}
					type={WithDataPathTypes.STYLE}
					style={styledContainer}
				/>
			)}
			{withLinkControl && (
				<LinkControlWithData label={__('Icon link', 'kubio')} />
			)}
		</KubioPanelBody>
	);
};

const checkParent = createHigherOrderComponent(
	(WrappedComponent) => (ownProps) => {
		const { dataHelper } = useKubioBlockContext();
		const hasVideoParent =
			dataHelper.withParent().blockName === NamesOfBlocks.VIDEO;

		return (
			<WrappedComponent
				{...ownProps}
				withLinkControl={
					!!hasVideoParent
						? !hasVideoParent
						: ownProps.withLinkControl
				}
				withAlignControl={
					!!hasVideoParent
						? !hasVideoParent
						: ownProps.withAlignControl
				}
			/>
		);
	},
	'checkParent'
);

export default checkParent(Panel);
