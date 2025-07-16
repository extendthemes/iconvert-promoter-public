import { __ } from '@wordpress/i18n';

const blockDescription = __(
	'Make your social media profiles stand out across your website. From Instagram to Snapchat and Youtube, you can add any icon you need and style it to match your brand.',
	'kubio'
);

const variationsFilter = ( variation ) => {
	if ( variation?.isDefault ) {
		return {
			...variation,
			description: blockDescription,
			attributes: {
				kubio: {
					props: { styleType: 'individual' },
					style: { descendants: { outer: { textAlign: 'center' } } },
				},
			},
			innerBlocks: [
				{
					clientId: '5c599dc7-e1d5-483e-88f4-2cac032769e5',
					name: 'cspromo/social-icon',
					attributes: {
						kubio: {
							style: {
								descendants: {
									icon: {
										fill: 'rgb(59,89,152)',
										states: {
											hover: { fill: 'rgb(59,89,152)' },
										},
										margin: {
											right: { value: 20, unit: 'px' },
										},
										padding: {
											top: { value: 10, unit: 'px' },
											right: { value: 10, unit: 'px' },
											bottom: { value: 10, unit: 'px' },
											left: { value: 10, unit: 'px' },
										},
										size: { value: 25, unit: 'px' },
										background: {
											color: 'rgba(var(--kubio-color-5),1)',
										},
										border: {
											top: {
												radius: {
													left: {
														value: 5,
														unit: 'px',
													},
													right: {
														value: 5,
														unit: 'px',
													},
												},
												style: 'solid',
												width: { value: 1, unit: 'px' },
												color: 'rgba(var(--kubio-color-6-variant-1),1)',
											},
											bottom: {
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
												style: 'solid',
												width: { value: 1, unit: 'px' },
												color: 'rgba(var(--kubio-color-6-variant-1),1)',
											},
											right: {
												style: 'solid',
												width: { value: 1, unit: 'px' },
												color: 'rgba(var(--kubio-color-6-variant-1),1)',
											},
											left: {
												style: 'solid',
												width: { value: 1, unit: 'px' },
												color: 'rgba(var(--kubio-color-6-variant-1),1)',
											},
										},
										media: {
											mobile: {
												margin: {
													right: {
														value: 10,
														unit: 'px',
													},
												},
											},
										},
									},
								},
							},
							props: { styleType: 'official' },
						},
						link: { typeOpenLink: 'sameWindow' },
						icon: { name: 'font-awesome/facebook-f' },
					},
				},
				{
					name: 'cspromo/social-icon',
					attributes: {
						kubio: {
							style: {
								descendants: {
									icon: {
										margin: {
											right: { value: 20, unit: 'px' },
										},
										padding: {
											top: { value: 10, unit: 'px' },
											right: { value: 10, unit: 'px' },
											bottom: { value: 10, unit: 'px' },
											left: { value: 10, unit: 'px' },
										},
										size: { value: 25, unit: 'px' },
										states: { hover: {} },
										background: {
											color: 'rgba(var(--kubio-color-5),1)',
										},
										border: {
											top: {
												radius: {
													left: {
														value: 5,
														unit: 'px',
													},
													right: {
														value: 5,
														unit: 'px',
													},
												},
												style: 'solid',
												width: { value: 1, unit: 'px' },
												color: 'rgba(var(--kubio-color-6-variant-1),1)',
											},
											bottom: {
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
												style: 'solid',
												width: { value: 1, unit: 'px' },
												color: 'rgba(var(--kubio-color-6-variant-1),1)',
											},
											right: {
												style: 'solid',
												width: { value: 1, unit: 'px' },
												color: 'rgba(var(--kubio-color-6-variant-1),1)',
											},
											left: {
												style: 'solid',
												width: { value: 1, unit: 'px' },
												color: 'rgba(var(--kubio-color-6-variant-1),1)',
											},
										},
										fill: 'rgba(var(--kubio-color-6),1)',
										media: {
											mobile: {
												margin: {
													right: {
														value: 10,
														unit: 'px',
													},
												},
											},
										},
									},
								},
							},
							props: { styleType: 'individual' },
						},
						link: { typeOpenLink: 'sameWindow' },
						icon: { name: 'font-awesome/twitter-x' },
					},
				},
				{
					clientId: '580fef39-c7b1-487e-9d05-32661a6b0596',
					name: 'cspromo/social-icon',
					attributes: {
						kubio: {
							style: {
								descendants: {
									icon: {
										fill: 'rgb(255,0,0)',
										states: {
											hover: { fill: 'rgb(255,0,0)' },
										},
										margin: {
											right: { value: 20, unit: 'px' },
										},
										padding: {
											top: { value: 10, unit: 'px' },
											right: { value: 10, unit: 'px' },
											bottom: { value: 10, unit: 'px' },
											left: { value: 10, unit: 'px' },
										},
										size: { value: 25, unit: 'px' },
										background: {
											color: 'rgba(var(--kubio-color-5),1)',
										},
										border: {
											top: {
												radius: {
													left: {
														value: 5,
														unit: 'px',
													},
													right: {
														value: 5,
														unit: 'px',
													},
												},
												style: 'solid',
												width: { value: 1, unit: 'px' },
												color: 'rgba(var(--kubio-color-6-variant-1),1)',
											},
											bottom: {
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
												style: 'solid',
												width: { value: 1, unit: 'px' },
												color: 'rgba(var(--kubio-color-6-variant-1),1)',
											},
											right: {
												style: 'solid',
												width: { value: 1, unit: 'px' },
												color: 'rgba(var(--kubio-color-6-variant-1),1)',
											},
											left: {
												style: 'solid',
												width: { value: 1, unit: 'px' },
												color: 'rgba(var(--kubio-color-6-variant-1),1)',
											},
										},
										media: {
											mobile: {
												margin: {
													right: {
														value: 10,
														unit: 'px',
													},
												},
											},
										},
									},
								},
							},
							props: { styleType: 'official' },
						},
						link: { typeOpenLink: 'sameWindow' },
						icon: { name: 'font-awesome/youtube-play' },
					},
				},
				{
					name: 'cspromo/social-icon',

					attributes: {
						kubio: {
							style: {
								descendants: {
									icon: {
										fill: 'rgb(37,211,102)',
										states: { hover: {} },
										margin: {
											right: { value: 20, unit: 'px' },
										},
										padding: {
											top: { value: 10, unit: 'px' },
											right: { value: 10, unit: 'px' },
											bottom: { value: 10, unit: 'px' },
											left: { value: 10, unit: 'px' },
										},
										size: { value: 25, unit: 'px' },
										background: {
											color: 'rgba(var(--kubio-color-5),1)',
										},
										border: {
											top: {
												radius: {
													left: {
														value: 5,
														unit: 'px',
													},
													right: {
														value: 5,
														unit: 'px',
													},
												},
												style: 'solid',
												width: { value: 1, unit: 'px' },
												color: 'rgba(var(--kubio-color-6-variant-1),1)',
											},
											bottom: {
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
												style: 'solid',
												width: { value: 1, unit: 'px' },
												color: 'rgba(var(--kubio-color-6-variant-1),1)',
											},
											right: {
												style: 'solid',
												width: { value: 1, unit: 'px' },
												color: 'rgba(var(--kubio-color-6-variant-1),1)',
											},
											left: {
												style: 'solid',
												width: { value: 1, unit: 'px' },
												color: 'rgba(var(--kubio-color-6-variant-1),1)',
											},
										},
										media: {
											mobile: {
												margin: {
													right: {
														value: 10,
														unit: 'px',
													},
												},
											},
										},
									},
								},
							},
							props: { styleType: 'official' },
						},
						link: { typeOpenLink: 'sameWindow' },
						icon: { name: 'font-awesome/whatsapp' },
					},
				},
			],
		};
	}

	return variation;
};

export { variationsFilter };
