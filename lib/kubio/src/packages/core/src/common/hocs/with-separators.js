import { createHigherOrderComponent } from '@wordpress/compose';

import { Separators as SeparatorsComponent } from '../separator';
import { memoize } from 'lodash';
import { getBlockSeparatorElementName } from '../../utils';
import { useKubioBlockContext } from '../../context';

const SeparatorsRender = memoize( ( separators, enabledByMedia ) => {
	return () =>
		separators && (
			<SeparatorsComponent
				separators={ separators }
				enabledByMedia={ enabledByMedia }
			/>
		);
} );

const withSeparators = () => {
	return createHigherOrderComponent(
		( WrappedComponent ) => ( ownProps ) => {
			const { name } = ownProps;
			const { dataHelper } = useKubioBlockContext();
			const styledComponent = getBlockSeparatorElementName( name );
			const separators = dataHelper.getStyle(
				'separators',
				{},
				{
					styledComponent,
				}
			);
			const topEnabledByMedia = dataHelper.getStyleByMedia(
				'separators.top.enabled',
				false,
				{
					styledComponent,
				}
			);
			const bottomEnabledByMedia = dataHelper.getStyleByMedia(
				'separators.bottom.enabled',
				false,
				{
					styledComponent,
				}
			);
			const enabledByMedia = {
				top: topEnabledByMedia,
				bottom: bottomEnabledByMedia,
			};
			const Separators = SeparatorsRender( separators, enabledByMedia );
			return (
				<>
					<WrappedComponent
						{ ...ownProps }
						Separators={ Separators }
					/>
				</>
			);
		},
		'withSeparators'
	);
};

export { withSeparators };
