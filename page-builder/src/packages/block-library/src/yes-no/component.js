import { useKubioInnerBlockProps } from '@kubio/block-library';
import { CanvasIcon } from '@kubio/controls';
import { withColibriDataAutoSave, withStyledElements } from '@kubio/core';
import { compose } from '@wordpress/compose';
import { useToolbarState } from './toolbar';
import { ElementsEnum } from './elements';

const TEMPLATE = [
	[
		'cspromo/yes-no-inner',
		{
			action: 'yes',
			kubio: {
				props: {},
				style: {
					descendants: {
						container: {
							textAlign: 'center',
						},
					},
				},
			},
		},
	],
	[
		'cspromo/yes-no-inner',
		{
			action: 'no',
			kubio: {
				props: {},
				style: {
					descendants: {
						container: {
							textAlign: 'center',
						},
					},
				},
			},
		},
	],
];

const ButtonPartial = ( props ) => {
	const { StyledElements, buttonType = 'Yes', computed, dataHelper } = props;

	const ButtonEl = StyledElements[ `${ buttonType }Button` ];
	const ButtonTextEl = StyledElements[ `${ buttonType }Text` ];
	const ButtonIconEl = StyledElements[ `${ buttonType }Icon` ];

	const showIconBefore = computed[ `show${ buttonType }IconBefore` ];
	const showIconAfter = computed[ `show${ buttonType }IconAfter` ];
	const text = dataHelper.getAttribute( `${ buttonType.toLowerCase() }Text` );

	return (
		<ButtonEl>
			<ButtonIconEl tag={ CanvasIcon } shouldRender={ showIconBefore } />
			<ButtonTextEl
				dangerouslySetInnerHTML={ {
					__html: text,
				} }
			/>
			<ButtonIconEl tag={ CanvasIcon } shouldRender={ showIconAfter } />
		</ButtonEl>
	);
};

const Component = ( props ) => {
	const { StyledElements, computed = {}, dataHelper } = props;

	const innerBlocksProps = useKubioInnerBlockProps(
		{},
		{
			templateLock: true,
			template: TEMPLATE,
		}
	);

	const { viewState, toolbarComponent } = useToolbarState( dataHelper );

	return (
		<>
			{ toolbarComponent }
			<StyledElements.Container data-current-action={ viewState }>
				<StyledElements.ButtonsContainer>
					<ButtonPartial
						StyledElements={ StyledElements }
						computed={ computed }
						buttonType="Yes"
						dataHelper={ dataHelper }
					/>
					<ButtonPartial
						StyledElements={ StyledElements }
						computed={ computed }
						buttonType="No"
						dataHelper={ dataHelper }
					/>
				</StyledElements.ButtonsContainer>
				<StyledElements.ViewsContainer { ...innerBlocksProps } />
			</StyledElements.Container>
		</>
	);
};

const computed = ( dataHelper ) => {
	const yesIcon = dataHelper.getAttribute( 'yesIcon' );
	const noIcon = dataHelper.getAttribute( 'noIcon' );

	return {
		showYesIconBefore: yesIcon?.show && yesIcon?.position === 'before',
		showYesIconAfter: yesIcon?.show && yesIcon?.position === 'after',
		yesIconValue: yesIcon.name,

		showNoIconBefore: noIcon?.show && noIcon?.position === 'before',
		showNoIconAfter: noIcon?.show && noIcon?.position === 'after',
		noIconValue: noIcon.name,
	};
};

const useStylesMapper = ( { computed: computedProps } = {} ) => {
	return {
		[ ElementsEnum.YES_ICON ]: {
			name: computedProps?.yesIconValue,
		},

		[ ElementsEnum.NO_ICON ]: {
			name: computedProps?.noIconValue,
		},
	};
};

export default compose(
	withColibriDataAutoSave( computed ),
	withStyledElements( useStylesMapper )
)( Component );
