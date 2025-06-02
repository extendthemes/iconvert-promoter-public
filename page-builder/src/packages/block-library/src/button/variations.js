import { BlockIcons } from '@kubio/icons';
import { __ } from '@wordpress/i18n';
//TEMPORARY VARIATION
const defaultVariation = {
	name: 'default',
	title: __( 'Button', 'iconvert-promoter' ),
	icon: BlockIcons.ReadMore,
	isDefault: true,
	innerBlocks: [],
	attributes: {
		kubio: {
			props: {
				buttonWidth: 'fitToContent',
				iconPosition: 'after',
				showIcon: false,
				buttonSize: 'medium',
				horizontalAlign: 'center',
			},
			style: {
				descendants: {
					link: {
						textAlign: 'center',
						background: {
							color: 'rgba(var(--kubio-color-1),1)',
						},
						typography: {
							color: '#fff',
							family: 'Open Sans',
							margin: {
								top: '',
								bottom: '2rem',
							},
							size: {
								unit: 'px',
								value: '12',
							},
							weight: '600',
							lineHeight: {
								value: '1',
								unit: '',
							},
							transform: 'uppercase',
							letterSpacing: {
								value: '1',
								unit: 'px',
							},
						},
						border: {
							top: {
								color: 'rgba(var(--kubio-color-1),1)',
								style: 'solid',
								width: {
									value: '2',
									unit: 'px',
								},
								radius: {
									right: {
										value: 5,
										unit: 'px',
									},
									left: {
										value: 5,
										unit: 'px',
									},
								},
							},
							bottom: {
								color: 'rgba(var(--kubio-color-1),1)',
								style: 'solid',
								width: {
									value: '2',
									unit: 'px',
								},
								radius: {
									right: {
										value: 5,
										unit: 'px',
									},
									left: {
										value: 5,
										unit: 'px',
									},
								},
							},
							right: {
								color: 'rgba(var(--kubio-color-1),1)',
								style: 'solid',
								width: {
									value: '2',
									unit: 'px',
								},
							},
							left: {
								color: 'rgba(var(--kubio-color-1),1)',
								style: 'solid',
								width: {
									value: '2',
									unit: 'px',
								},
							},
						},
						padding: {
							top: {
								unit: 'px',
								value: '12',
							},
							bottom: {
								unit: 'px',
								value: '12',
							},
							left: {
								unit: 'px',
								value: '24',
							},
							right: {
								unit: 'px',
								value: '24',
							},
						},
						states: {
							hover: {
								background: {
									color: 'rgba(var(--kubio-color-1-variant-4),1)',
								},
								border: {
									top: {
										color: 'rgba(var(--kubio-color-1-variant-4),1)',
									},
									right: {
										color: 'rgba(var(--kubio-color-1-variant-4),1)',
									},
									bottom: {
										color: 'rgba(var(--kubio-color-1-variant-4),1)',
									},
									left: {
										color: 'rgba(var(--kubio-color-1-variant-4),1)',
									},
								},
							},
						},
					},
					icon: {
						size: {
							unit: 'px',
							value: '12',
						},
						margin: {
							left: {
								value: 10,
								unit: 'px',
							},
							right: {
								value: 0,
								unit: 'px',
							},
						},
					},
				},
			},
		},
	},
};
const variations = [ defaultVariation ];
export { defaultVariation, variations };
