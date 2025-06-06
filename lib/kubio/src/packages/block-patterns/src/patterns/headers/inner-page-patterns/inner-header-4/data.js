//select block and use this in console:
// kubio.utils.transformBlockToTemplate(wp.data.select('core/block-editor').getSelectedBlock())

const header = [
	'kubio/header',
	{
		kubio: {
			styleRef: 'theme-Zam-Tq5W3',
			id: 'fhBpYKTtmZg',
		},
		tagName: 'div',
	},
	[
		[
			'kubio/navigation',
			{
				kubio: {
					id: 'mRidJaG9Q0',
					styleRef: 'Gp3qTlxXlu',
					props: {
						width: 'boxed',
						showHeader: false,
						overlap: true,
						sticky: false,
						stickyStartAt: 'immediately',
						showTopBar: false,
						animation: {
							name: 'slideDown',
						},
					},
					style: {
						descendants: {
							section: {
								animation: {
									duration: {
										unit: 's',
										value: 0.5,
									},
								},
								media: {
									mobile: {
										padding: {
											top: {
												value: 10,
												unit: 'px',
											},
											bottom: {
												value: 10,
												unit: 'px',
											},
										},
										background: {},
									},
								},
								padding: {
									top: {
										value: 20,
										unit: 'px',
									},
									bottom: {
										value: 20,
										unit: 'px',
									},
								},
								background: {
									color: 'rgba(var(--kubio-color-5),1)',
								},
							},
						},
						ancestor: {
							sticky: {
								descendants: {
									section: {
										background: {
											color: '#ffffff',
										},
										padding: {
											top: {
												value: 10,
												unit: 'px',
											},
											bottom: {
												value: 10,
												unit: 'px',
											},
										},
										media: {
											mobile: {
												padding: {
													top: {
														value: '0',
													},
													bottom: {
														value: '0',
													},
												},
												background: {
													color:
														'rgba(var(--kubio-color-5),1)',
												},
											},
										},
										boxShadow: {
											enabled: true,
											layers: [
												{
													spread: '0',
													blur: '10',
													color:
														'rgba(23, 25, 39, 0.1)',
												},
											],
										},
									},
								},
							},
						},
					},
					hash: '01dcca6a',
				},
				anchor: 'navigation',
				attrs: {
					id: 'navigation',
					name: 'Navigation',
				},
			},
			[
				[
					'kubio/navigation-top-bar',
					{
						kubio: {
							id: 'Zs06wExINw',
							styleRef: 'RhaNNW9G3W',
							props: {
								width: 'boxed',
								media: {
									mobile: {
										isHidden: true,
									},
								},
							},
							style: {
								descendants: {
									outer: {
										background: {
											color:
												'rgba(var(--kubio-color-5),1)',
										},
										padding: {
											top: {
												value: '5',
												unit: 'px',
											},
											right: {
												unit: 'px',
											},
											bottom: {
												value: '5',
												unit: 'px',
											},
											left: {
												unit: 'px',
											},
										},
										border: {
											bottom: {
												style: 'solid',
												width: {
													value: 1,
													unit: 'px',
												},
											},
										},
									},
								},
							},
							hash: '2b175344',
						},
					},
					[
						[
							'kubio/row',
							{
								kubio: {
									id: 'BTBuWohZv6',
									styleRef: '40fNPTO2lt',
									props: {
										fullBackground: true,
										layout: {
											equalWidth: false,
											equalHeight: true,
											itemsPerRow: 2,
											verticalAlign: 'center',
											horizontalAlign: 'center',
											horizontalGap: 0,
											verticalGap: 0,
											horizontalInnerGap: 0,
											verticalInnerGap: 0,
											custom: {
												horizontalGap: {
													unit: 'px',
													value: '',
												},
												verticalGap: {
													unit: 'px',
													value: '',
												},
												horizontalInnerGap: {
													unit: 'px',
													value: '',
												},
												verticalInnerGap: {
													unit: 'px',
													value: '',
												},
											},
										},
										media: {
											mobile: {
												layout: {
													itemsPerRow: 1,
													horizontalGap: 0,
													outerGapLinked: false,
												},
												isHidden: true,
											},
										},
									},
									hash: '62ab43a8',
								},
							},
							[
								[
									'kubio/column',
									{
										kubio: {
											id: 'QaO4vg4NOl',
											styleRef: 'tbUkHu4b_',
											style: {
												descendants: {
													inner: {
														textAlign: 'left',
													},
												},
											},
											props: {
												layout: {
													verticalAlign: 'center',
												},
											},
											_props: {},
											_style: {
												descendants: {
													container: {
														columnWidth: {
															type:
																'fitToContent',
															custom: {
																value: '',
																unit: '%',
															},
														},
													},
												},
											},
											hash: '11a9afcc',
										},
									},
									[
										[
											'kubio/heading',
											{
												kubio: {
													id: 'JCpWSqIqX3',
													styleRef: 'Py_Pg_KN3Y',
													style: {
														descendants: {
															text: {
																typography: {
																	size: {
																		value: 0.6,
																		unit:
																			'em',
																	},
																},
															},
														},
													},
													props: {
														level: 6,
														fancy: {
															fancyRotatingWords:
																"awesome\namazing\nimpressive",
														},
													},
													_props: {},
													_style: {},
													hash: 'c5b9120c',
												},
												link: {
													typeOpenLink: 'sameWindow',
												},
												content: 'Follow us:',
												anchor: 'heading',
											},
											[],
										],
									],
								],
								[
									'kubio/column',
									{
										kubio: {
											id: 'q75DZ10k1SX',
											styleRef: 'KYMA7hDk_Tt',
											props: {
												overlapOptions: false,
												layout: {
													horizontalGap: 2,
													verticalGap: 2,
													custom: {
														horizontalGap: {
															unit: 'px',
															value: '',
														},
														verticalGap: {
															unit: 'px',
															value: '',
														},
														horizontalInnerGap: {
															unit: 'px',
															value: '',
														},
														verticalInnerGap: {
															unit: 'px',
															value: '',
														},
													},
													verticalAlign: 'center',
													verticalInnerGap: 'inherit',
													horizontalInnerGap: 1,
												},
												internal: {
													heroSection: {
														type: null,
													},
												},
												media: {
													tablet: {
														layout: {
															horizontalInnerGap: 0,
														},
													},
												},
											},
											style: {
												descendants: {
													inner: {
														textAlign: 'center',
														customHeight: {
															type:
																'fit-to-content',
															'min-height': {
																value: '',
																unit: 'px',
															},
														},
														padding: {
															left: {
																unit: 'px',
															},
															right: {
																unit: 'px',
															},
															top: {
																unit: 'px',
															},
															bottom: {
																unit: 'px',
															},
														},
													},
													container: {
														padding: {
															left: {
																unit: 'px',
															},
															right: {
																unit: 'px',
															},
															top: {
																unit: 'px',
															},
															bottom: {
																unit: 'px',
															},
														},
													},
												},
											},
											_style: {
												descendants: {
													container: {
														media: {
															mobile: {
																columnWidth: {
																	type:
																		'custom',
																	custom: {
																		value: 100,
																		unit:
																			'%',
																	},
																},
															},
														},
														columnWidth: {
															type:
																'fitToContent',
															custom: {
																unit: '%',
																value: '25',
															},
														},
													},
												},
											},
											hash: '000fc5ae',
										},
									},
									[
										[
											'kubio/social-icons',
											{
												kubio: {
													id: 'a6YowSD_UmY',
													styleRef: 'NW-UBaFvP_o',
													props: {
														styleType: 'shared',
													},
													style: {
														descendants: {
															icon: {
																margin: {
																	right: {
																		value:
																			'0',
																		unit:
																			'px',
																	},
																},
																padding: {
																	top: {
																		value:
																			'5',
																		unit:
																			'px',
																	},
																	right: {
																		value:
																			'5',
																		unit:
																			'px',
																	},
																	bottom: {
																		value:
																			'5',
																		unit:
																			'px',
																	},
																	left: {
																		value:
																			'5',
																		unit:
																			'px',
																	},
																},
																fill:
																	'rgba(var(--kubio-color-6),1)',
																size: {
																	value: 12,
																	unit: 'px',
																},
																states: {
																	hover: {
																		fill:
																			'rgba(var(--kubio-color-6-variant-4),1)',
																	},
																},
															},
															outer: {
																textAlign:
																	'right',
																media: {
																	mobile: {
																		textAlign:
																			'center',
																	},
																},
															},
														},
													},
													hash: '748d49b2',
												},
											},
											[
												[
													'kubio/social-icon',
													{
														kubio: {
															id: '6Y3xjJmgFg1',
															styleRef:
																'cD5xBdPTDZN',
															hash: '798a92f8',
														},
														link: {
															typeOpenLink:
																'sameWindow',
															value: '#',
														},
														icon: {
															name:
																'socicon/facebook',
														},
													},
													[],
												],
												[
													'kubio/social-icon',
													{
														kubio: {
															id: '4ricB_fhkaH',
															styleRef:
																'hg5KofdePlS',
															hash: 'd416fce0',
														},
														link: {
															typeOpenLink:
																'sameWindow',
															value: '#',
														},
														icon: {
															name:
																'socicon/instagram',
														},
													},
													[],
												],
												[
													'kubio/social-icon',
													{
														kubio: {
															id: 'q55MC0GehLm',
															styleRef:
																'A5DhxJhRsKw',
															hash: '4e8b9efb',
														},
														link: {
															typeOpenLink:
																'sameWindow',
															value: '#',
														},
														icon: {
															name:
																'socicon/twitter',
														},
													},
													[],
												],
												[
													'kubio/social-icon',
													{
														kubio: {
															id: 'mc2WRNf0jb3',
															styleRef:
																'j0IcrV0A3IO',
															hash: 'd399e9bc',
														},
														link: {
															typeOpenLink:
																'sameWindow',
															value: '#',
														},
														icon: {
															name:
																'socicon/linkedin',
														},
													},
													[],
												],
											],
										],
									],
								],
								[
									'kubio/column',
									{
										kubio: {
											id: '40akAu2KPv',
											styleRef: '-8dUCxTxZm',
											props: {
												overlapOptions: false,
												layout: {
													horizontalGap: 2,
													verticalGap: 2,
													custom: {
														horizontalGap: {
															unit: 'px',
															value: '',
														},
														verticalGap: {
															unit: 'px',
															value: '',
														},
														horizontalInnerGap: {
															unit: 'px',
															value: '',
														},
														verticalInnerGap: {
															unit: 'px',
															value: '',
														},
													},
													verticalAlign: 'center',
													verticalInnerGap: 'inherit',
													horizontalInnerGap: 2,
												},
												internal: {
													heroSection: {
														type: null,
													},
												},
											},
											style: {
												descendants: {
													inner: {
														textAlign: 'left',
														customHeight: {
															type:
																'fit-to-content',
															'min-height': {
																value: '',
																unit: 'px',
															},
														},
														padding: {
															left: {
																unit: 'px',
															},
															right: {
																unit: 'px',
															},
															top: {
																unit: 'px',
															},
															bottom: {
																unit: 'px',
															},
														},
													},
													container: {
														padding: {
															left: {
																unit: 'px',
															},
															right: {
																unit: 'px',
															},
															top: {
																unit: 'px',
															},
															bottom: {
																unit: 'px',
															},
														},
													},
												},
											},
											_style: {
												descendants: {
													container: {
														media: {
															mobile: {
																columnWidth: {
																	type:
																		'custom',
																	custom: {
																		value: 100,
																		unit:
																			'%',
																	},
																},
															},
														},
														columnWidth: {
															type: 'flexgrow',
															custom: {
																unit: '%',
																value: '75',
															},
														},
													},
												},
											},
											hash: '9c29c88a',
										},
									},
									[
										[
											'kubio/iconlist',
											{
												kubio: {
													id: 'nEZ7VEDkHw',
													styleRef: 'ZpGddm-LcJ',
													props: {
														listLayout:
															'horizontal',
														listDivider: false,
														iconList: [
															{
																title: 'List',
																link: {
																	newWindow: false,
																	noFollow: false,
																},
																text:
																	'List item #1',
																allIcons: false,
																icon:
																	'font-awesome/check',
																type: 'svg',
																id: 0.15907223444395013,
															},
															{
																title: 'List',
																link: {
																	newWindow: false,
																	noFollow: false,
																},
																text:
																	'List item #2',
																allIcons: false,
																icon:
																	'font-awesome/check',
																type: 'svg',
																id: 0.34341111083051734,
															},
															{
																title: 'List',
																link: {
																	newWindow: false,
																	noFollow: false,
																},
																text:
																	'List item #3',
																allIcons: false,
																icon:
																	'font-awesome/check',
																type: 'svg',
																id: 0.0941660601972718,
															},
															{
																title: 'List',
																link: {
																	newWindow: false,
																	noFollow: false,
																},
																text:
																	'List item #4',
																allIcons: false,
																icon:
																	'font-awesome/check',
																type: 'svg',
																id: 0.5295691579821964,
															},
														],
													},
													style: {
														descendants: {
															outer: {
																flexDirection:
																	'row',
																justifyContent:
																	'flex-end',
																alignContent:
																	'flex-end',
															},
															text: {
																margin: {
																	left: {
																		value:
																			'5',
																	},
																},
																color:
																	'rgba(var(--kubio-color-6),1)',
																typography: {
																	size: {
																		unit:
																			'px',
																		value:
																			'14',
																	},
																},
																alignItems:
																	'center',
															},
															'text-wrapper': {
																padding: {
																	bottom: {
																		value: 0,
																		unit:
																			'px',
																	},
																	right: {
																		value: 0,
																		unit:
																			'px',
																	},
																},
																alignItems:
																	'center',
															},
															icon: {
																width: {
																	value: '18',
																	unit: 'px',
																},
																height: {
																	value: '18',
																	unit: 'px',
																},
																padding: {
																	left: {
																		value:
																			'0',
																		unit:
																			'px',
																	},
																	top: {
																		unit:
																			'px',
																	},
																	right: {
																		unit:
																			'px',
																	},
																	bottom: {
																		unit:
																			'px',
																	},
																},
																border: {
																	top: {
																		style:
																			'none',
																		radius: {
																			left: {
																				unit:
																					'px',
																			},
																			right: {
																				unit:
																					'px',
																			},
																		},
																		width: {
																			value:
																				'2',
																			unit:
																				'px',
																		},
																		color:
																			'rgba(var(--kubio-color-1),1)',
																	},
																	right: {
																		style:
																			'none',
																		width: {
																			value:
																				'2',
																			unit:
																				'px',
																		},
																		color:
																			'rgba(var(--kubio-color-1),1)',
																	},
																	bottom: {
																		style:
																			'none',
																		radius: {
																			left: {
																				unit:
																					'px',
																			},
																			right: {
																				unit:
																					'px',
																			},
																		},
																		width: {
																			value:
																				'2',
																			unit:
																				'px',
																		},
																		color:
																			'rgba(var(--kubio-color-1),1)',
																	},
																	left: {
																		style:
																			'none',
																		width: {
																			value:
																				'2',
																			unit:
																				'px',
																		},
																		color:
																			'rgba(var(--kubio-color-1),1)',
																	},
																},
																states: {
																	hover: {
																		background: {
																			color:
																				'rgba(3, 169, 244, 0)',
																		},
																	},
																},
																fill:
																	'rgba(var(--kubio-color-6),1)',
															},
															divider: {
																color:
																	'rgb(0,0,0)',
																width: {
																	value: 100,
																	unit: '%',
																},
																height: {
																	value: 100,
																	unit: '%',
																},
																border: {
																	bottom: {
																		style:
																			'solid',
																		color:
																			'rgb(0,0,0)',
																		width: {
																			value: 0,
																			unit:
																				'px',
																		},
																	},
																	top: {
																		style:
																			'solid',
																		width: {
																			value: 0,
																			unit:
																				'px',
																		},
																	},
																	left: {
																		style:
																			'solid',
																		width: {
																			value: 1,
																			unit:
																				'px',
																		},
																	},
																	right: {
																		style:
																			'solid',
																		width: {
																			value: 0,
																			unit:
																				'px',
																		},
																	},
																},
																margin: {
																	left: {
																		value: 0,
																		unit:
																			'px',
																	},
																},
															},
															'divider-wrapper': {
																width: {
																	value: 1,
																	unit: 'px',
																},
																padding: {
																	bottom: {
																		value: 0,
																		unit:
																			'px',
																	},
																	top: {
																		value: 0,
																		unit:
																			'px',
																	},
																	left: {
																		value: 10,
																		unit:
																			'px',
																	},
																	right: {
																		value: 10,
																		unit:
																			'px',
																	},
																},
																height: 'auto',
																alignItems:
																	'center',
															},
														},
													},
													hash: '553ddc70',
												},
											},
											[
												[
													'kubio/iconlistitem',
													{
														kubio: {
															id: 'hXYpg_FNLz-',
															styleRef:
																'3UzObSPKBWQ',
															hash: '48c03a66',
														},
														text:
															'Location, State, Country',
														icon:
															'icons8-line-awesome/map-marker',
														link: {
															typeOpenLink:
																'sameWindow',
															value: '#',
														},
														useForAll: false,
													},
													[],
												],
												[
													'kubio/iconlistitem',
													{
														kubio: {
															id: 'tAHrB504dPf',
															styleRef:
																'DdZZPIfitqQ',
															hash: '23c00b2c',
														},
														text: '(000) 123 12345',
														icon:
															'icons8-line-awesome/phone',
														link: {
															typeOpenLink:
																'sameWindow',
															value: '#',
														},
														useForAll: false,
													},
													[],
												],
												[
													'kubio/iconlistitem',
													{
														kubio: {
															id: '8ZbB0boWPmo',
															styleRef:
																'Hn9MHC4SoKC',
															hash: '6e9244f3',
														},
														text:
															'email@yoursite.com',
														icon:
															'icons8-line-awesome/envelope',
														link: {
															typeOpenLink:
																'sameWindow',
															value: '#',
														},
														useForAll: false,
													},
													[],
												],
											],
										],
									],
								],
							],
						],
					],
				],
				[
					'kubio/navigation-section',
					{
						kubio: {
							styleRef: 'xLwdIMLPC_l',
							id: 'Kpx0v3mGVY8',
							hash: '7slsXb9M8Nf',
						},
					},
					[
						[
							'kubio/navigation-items',
							{
								kubio: {
									styleRef: 'DqcL_YF9LKJ',
									id: 'e6Fr95nVkTv',
									hash: '4slf86H8Rco',
								},
							},
							[
								[
									'kubio/row',
									{
										kubio: {
											id: '3BghGwtr8sy',
											styleRef: 'MqErEXZ17Jm',
											props: {
												fullBackground: false,
												layout: {
													equalWidth: false,
													equalHeight: true,
													itemsPerRow: 1,
													verticalAlign: 'center',
													horizontalAlign: 'center',
													horizontalGap: 2,
													verticalGap: 0,
													horizontalInnerGap: 0,
													verticalInnerGap: 0,
													custom: {
														horizontalGap: {
															unit: 'px',
															value: '',
														},
														verticalGap: {
															unit: 'px',
															value: '',
														},
														horizontalInnerGap: {
															unit: 'px',
															value: '',
														},
														verticalInnerGap: {
															unit: 'px',
															value: '',
														},
													},
												},
												media: {
													mobile: {
														layout: {
															itemsPerRow: 1,
															horizontalGap: 2,
															outerGapLinked: false,
															verticalGap: 0,
														},
													},
													tablet: {
														layout: {
															horizontalGap: 0,
														},
													},
												},
												containerWidth: 'boxed',
											},
											hash: 'ccb276c0',
										},
									},
									[
										[
											'kubio/column',
											{
												kubio: {
													id: 'KtcARP3I11P',
													styleRef: 'SFXC9Ze09eu',
													props: {
														overlapOptions: false,
														layout: {
															horizontalGap: 2,
															verticalGap: 2,
															custom: {
																horizontalGap: {
																	unit: 'px',
																	value: '',
																},
																verticalGap: {
																	unit: 'px',
																	value: '',
																},
																horizontalInnerGap: {
																	unit: 'px',
																	value: '',
																},
																verticalInnerGap: {
																	unit: 'px',
																	value: '',
																},
															},
															verticalAlign:
																'center',
															verticalInnerGap: 0,
															horizontalInnerGap: 0,
														},
														media: {
															tablet: {
																layout: {
																	horizontalInnerGap: 2,
																},
															},
															mobile: {
																layout: {
																	verticalInnerGap: 2,
																	horizontalInnerGap: 2,
																},
															},
														},
														internal: {
															heroSection: {
																type: null,
															},
															navContent: {
																type: 'logo',
															},
															mirror:
																'navigation-logo',
														},
													},
													style: {
														descendants: {
															inner: {
																textAlign:
																	'left',
																customHeight: {
																	type:
																		'fit-to-content',
																	'min-height': {
																		value:
																			'',
																		unit:
																			'px',
																	},
																},
																media: {
																	tablet: {
																		padding: {
																			left: {
																				unit:
																					'px',
																			},
																			right: {
																				unit:
																					'px',
																			},
																		},
																	},
																	mobile: {
																		textAlign:
																			'left',
																	},
																},
																padding: {
																	left: {
																		unit:
																			'px',
																	},
																	right: {
																		unit:
																			'px',
																	},
																	top: {
																		unit:
																			'px',
																	},
																	bottom: {
																		unit:
																			'px',
																	},
																},
															},
															container: {
																padding: {
																	left: {
																		unit:
																			'px',
																	},
																	right: {
																		unit:
																			'px',
																	},
																	top: {
																		unit:
																			'px',
																	},
																	bottom: {
																		unit:
																			'px',
																	},
																},
																media: {
																	mobile: {
																		padding: {
																			left: {
																				unit:
																					'px',
																			},
																			right: {
																				unit:
																					'px',
																			},
																			top: {
																				unit:
																					'px',
																			},
																			bottom: {
																				unit:
																					'px',
																			},
																		},
																	},
																},
															},
														},
														ancestor: {
															sticky: {
																descendants: {
																	inner: {
																		textAlign:
																			'left',
																		media: {
																			mobile: {
																				textAlign:
																					'left',
																			},
																		},
																	},
																},
															},
														},
													},
													_style: {
														descendants: {
															container: {
																columnWidth: {
																	type:
																		'fitToContent',
																	custom: {
																		unit:
																			'%',
																	},
																},
																media: {
																	mobile: {
																		columnWidth: {
																			type:
																				'flexgrow',
																			custom: {
																				value: 100,
																				unit:
																					'%',
																			},
																		},
																	},
																},
															},
														},
														ancestor: {
															sticky: {
																descendants: {
																	container: {
																		columnWidth: {
																			type:
																				'fitToContent',
																			custom: {
																				unit:
																					'%',
																			},
																		},
																		media: {
																			mobile: {
																				columnWidth: {
																					type:
																						'flexgrow',
																					custom: {
																						value: 100,
																						unit:
																							'%',
																					},
																				},
																			},
																		},
																	},
																},
															},
														},
													},
													hash: '4d09e38c',
												},
											},
											[
												[
													'kubio/logo',
													{
														kubio: {
															id: 'FBUFMa_ePe',
															styleRef:
																'0xSC3AT64',
															hash: '416b3f3c',
															props: {
																layoutType:
																	'text',
															},
															style: {
																descendants: {
																	text: {
																		typography: {
																			color:
																				'rgba(var(--kubio-color-6),1)',
																			size: {
																				value: 24,
																				unit:
																					'px',
																			},
																		},
																	},
																	container: {
																		media: {
																			mobile: {
																				justifyContent:
																					'flex-start',
																				alignItems:
																					'flex-start',
																			},
																		},
																	},
																},
															},
														},
														linkTo: 'homePage',
														link: {
															typeOpenLink:
																'sameWindow',
														},
														mode: 'autodetect-mode',
													},
													[],
												],
											],
										],
										[
											'kubio/column',
											{
												kubio: {
													id: 'Kr0w6laDj5',
													styleRef: 'DJ3dK9XoVZ',
													props: {
														layout: {
															verticalAlign:
																'center',
														},
														internal: {
															navContent: {
																type: 'spacing',
															},
														},
														media: {
															mobile: {
																isHidden: true,
															},
														},
													},
													_style: {
														descendants: {
															container: {
																columnWidth: {
																	type:
																		'flexgrow',
																},
															},
														},
														ancestor: {
															sticky: {
																descendants: {
																	container: {
																		columnWidth: {
																			type:
																				'flexgrow',
																		},
																	},
																},
															},
														},
													},
													hash: '0ad949ac',
												},
											},
											[
												[
													'kubio/spacer',
													{
														kubio: {
															styleRef:
																'mRmagmI3LJv',
															id: 'm_7zFALmX0-',
														},
													},
													[],
												],
											],
										],
										[
											'kubio/column',
											{
												kubio: {
													id: 'R6mqrW6b5Z1',
													styleRef: 'ZEkYpBrx7RA',
													props: {
														overlapOptions: false,
														layout: {
															horizontalGap: 2,
															verticalGap: 2,
															custom: {
																horizontalGap: {
																	unit: 'px',
																	value: '',
																},
																verticalGap: {
																	unit: 'px',
																	value: '',
																},
																horizontalInnerGap: {
																	unit: 'px',
																	value: '',
																},
																verticalInnerGap: {
																	unit: 'px',
																	value: '',
																},
															},
															verticalAlign:
																'center',
															verticalInnerGap: 0,
															horizontalInnerGap: 0,
														},
														media: {
															mobile: {
																layout: {
																	horizontalInnerGap: 2,
																	verticalInnerGap: 2,
																},
															},
															tablet: {
																layout: {
																	horizontalInnerGap: 0,
																	verticalInnerGap: 0,
																},
															},
														},
														internal: {
															heroSection: {
																type: null,
															},
															navContent: {
																type: 'menu',
															},
															mirror:
																'navigation-menu',
														},
													},
													style: {
														descendants: {
															inner: {
																textAlign:
																	'right',
																customHeight: {
																	type:
																		'fit-to-content',
																	'min-height': {
																		value:
																			'',
																		unit:
																			'px',
																	},
																},
																media: {
																	mobile: {
																		textAlign:
																			'right',
																		padding: {
																			left: {
																				unit:
																					'px',
																			},
																			right: {
																				unit:
																					'px',
																			},
																			top: {
																				unit:
																					'px',
																			},
																			bottom: {
																				unit:
																					'px',
																			},
																		},
																	},
																	tablet: {
																		padding: {
																			left: {
																				unit:
																					'px',
																			},
																			right: {
																				unit:
																					'px',
																			},
																			top: {
																				unit:
																					'px',
																			},
																			bottom: {
																				unit:
																					'px',
																			},
																		},
																	},
																},
																padding: {
																	left: {
																		unit:
																			'px',
																	},
																	right: {
																		unit:
																			'px',
																	},
																	top: {
																		unit:
																			'px',
																	},
																	bottom: {
																		unit:
																			'px',
																	},
																},
															},
															container: {
																padding: {
																	left: {
																		unit:
																			'px',
																	},
																	right: {
																		unit:
																			'px',
																	},
																	top: {
																		unit:
																			'px',
																	},
																	bottom: {
																		unit:
																			'px',
																	},
																},
															},
														},
														ancestor: {
															sticky: {
																descendants: {
																	inner: {
																		textAlign:
																			'right',
																		media: {
																			mobile: {
																				textAlign:
																					'right',
																			},
																		},
																	},
																},
															},
														},
													},
													_style: {
														descendants: {
															container: {
																columnWidth: {
																	type:
																		'fitToContent',
																	custom: {
																		unit:
																			'%',
																		value:
																			'86.16',
																	},
																},
																media: {
																	mobile: {
																		columnWidth: {
																			type:
																				'fitToContent',
																			custom: {
																				value: 100,
																				unit:
																					'%',
																			},
																		},
																	},
																},
															},
														},
														ancestor: {
															sticky: {
																descendants: {
																	container: {
																		columnWidth: {
																			type:
																				'fitToContent',
																			custom: {
																				unit:
																					'%',
																				value:
																					'86.16',
																			},
																		},
																		media: {
																			mobile: {
																				columnWidth: {
																					type:
																						'fitToContent',
																					custom: {
																						value: 100,
																						unit:
																							'%',
																					},
																				},
																			},
																		},
																	},
																},
															},
														},
													},
													hash: '79ffa156',
												},
											},
											[
												[
													'kubio/dropdown-menu',
													{
														kubio: {
															id: 'Q1rCj3xZSIa',
															styleRef:
																'c6BbujDIAOY',
															props: {
																menu: null,
																horizontalAlign:
																	'start',
																hoverEffect: {
																	type:
																		'bordered-active-item bordered-active-item--bottom',
																	background: {
																		effect:
																			'solid-active-item effect-pull-down',
																	},
																	border: {
																		effect:
																			'effect-borders-grow grow-from-left',
																	},
																},
															},
															style: {
																descendants: {
																	'hover-effect-border': {
																		height: {
																			value: 1,
																			unit:
																				'px',
																		},
																	},
																	'hover-effect-background': {
																		background: {
																			color:
																				'white',
																		},
																		border: {
																			top: {
																				radius: {
																					left: {
																						unit:
																							'%',
																						value:
																							'0',
																					},
																					right: {
																						unit:
																							'%',
																						value:
																							'0',
																					},
																				},
																			},
																			bottom: {
																				radius: {
																					left: {
																						unit:
																							'%',
																						value:
																							'0',
																					},
																					right: {
																						unit:
																							'%',
																						value:
																							'0',
																					},
																				},
																			},
																		},
																	},
																	'main-menu-ul': {
																		justifyContent:
																			'flex-end',
																		gap: {
																			value: 30,
																			unit:
																				'px',
																		},
																		media: {
																			mobile: {
																				justifyContent:
																					'flex-end',
																			},
																		},
																	},
																	'main-menu-a': {
																		typography: {
																			color:
																				'rgba(var(--kubio-color-6),1)',
																			size: {
																				value:
																					'14',
																				unit:
																					'px',
																			},
																			weight: 400,
																			transform:
																				'none',
																			family:
																				'Open Sans',
																			lineHeight: {
																				unit:
																					'em',
																				value:
																					'1.5',
																			},
																			letterSpacing: {
																				unit:
																					'px',
																				value:
																					'0',
																			},
																		},
																		padding: {
																			top: {
																				value:
																					'10',
																				unit:
																					'px',
																			},
																			right: {
																				value: 0,
																				unit:
																					'px',
																			},
																			bottom: {
																				value:
																					'10',
																				unit:
																					'px',
																			},
																			left: {
																				value: 0,
																				unit:
																					'px',
																			},
																		},
																	},
																	'main-menu-icon': {
																		padding: {
																			left: {
																				value: 5,
																				unit:
																					'px',
																			},
																			right: {
																				value: 5,
																				unit:
																					'px',
																			},
																		},
																	},
																	'sub-menu-ul': {
																		background: {
																			color:
																				'#ffffff',
																		},
																		margin: {
																			left: {
																				value: 5,
																				unit:
																					'px',
																			},
																			right: {
																				value: 5,
																				unit:
																					'px',
																			},
																		},
																		boxShadow: {
																			enabled: true,
																			layers: [
																				{
																					blur:
																						'5',
																					color:
																						'rgba(0, 0, 0, 0.04)',
																				},
																			],
																		},
																	},
																	'sub-menu-a': {
																		typography: {
																			color:
																				'rgba(var(--kubio-color-6-variant-3),1)',
																			size: {
																				value: 14,
																				unit:
																					'px',
																			},
																		},
																		padding: {
																			top: {
																				value:
																					'10',
																				unit:
																					'px',
																			},
																			right: {
																				value:
																					'20',
																				unit:
																					'px',
																			},
																			bottom: {
																				value:
																					'10',
																				unit:
																					'px',
																			},
																			left: {
																				value:
																					'20',
																				unit:
																					'px',
																			},
																		},
																		border: {
																			bottom: {
																				width: {
																					value:
																						'1',
																					unit:
																						'px',
																				},
																				style:
																					'solid',
																				color:
																					'rgba(128,128,128,.2)',
																			},
																		},
																		background: {
																			color:
																				'rgb(255, 255, 255)',
																		},
																		states: {
																			hover: {
																				typography: {
																					color:
																						'rgb(255, 255, 255)',
																				},
																				background: {
																					color:
																						'rgba(var(--kubio-color-1),1)',
																				},
																				color:
																					'rgba(var(--kubio-color-5),1)',
																			},
																			menuButtonActive: {
																				typography: {
																					color:
																						'rgb(255, 255, 255)',
																				},
																				background: {
																					color:
																						'rgba(var(--kubio-color-1),1)',
																				},
																				color:
																					'rgba(var(--kubio-color-5),1)',
																			},
																		},
																		color:
																			'rgba(var(--kubio-color-6),1)',
																	},
																	'first-sub-menu-ul': {
																		margin: {
																			top: {
																				value: 10,
																				unit:
																					'px',
																			},
																		},
																	},
																	'first-sub-menu-ul-before': {
																		height: {
																			value: 10,
																			unit:
																				'px',
																		},
																		width: {
																			value: 100,
																			unit:
																				'%',
																		},
																	},
																},
																ancestor: {
																	sticky: {
																		descendants: {
																			'main-menu-a': {
																				typography: {
																					color:
																						'rgba(var(--kubio-color-6),1)',
																				},
																				states: {
																					hover: {
																						typography: {
																							color:
																								'rgba(var(--kubio-color-6),1)',
																						},
																					},
																					menuButtonActive: {
																						typography: {
																							color:
																								'rgba(var(--kubio-color-6),1)',
																						},
																					},
																				},
																			},
																			'hover-effect-border': {
																				background: {
																					color:
																						'rgba(var(--kubio-color-6),1)',
																				},
																			},
																			'main-menu-ul': {
																				justifyContent:
																					'flex-end',
																				media: {
																					mobile: {
																						justifyContent:
																							'flex-end',
																					},
																				},
																			},
																		},
																	},
																},
															},
															hash: '14c17afc',
														},
														hideSubmenu: false,
														showOffscreenMenuOn:
															'has-offcanvas-mobile',
													},
													[
														[
															'kubio/menu-items',
															{
																location:
																	'header-menu',
																id: 0,
																kubio: {
																	id:
																		'PzgNoWmJhRP',
																	styleRef:
																		'K5qy1wT2BoI',
																	hash:
																		'7773c488',
																},
															},
															[],
														],
														[
															'kubio/menu-offscreen',
															{
																kubio: {
																	id:
																		'_oeH-Ezp6hp',
																	styleRef:
																		'r1Ph182_RWJ',
																	props: {
																		showPanelInCustomizer: false,
																	},
																	style: {
																		descendants: {
																			offscreen: {
																				width: {
																					value: 300,
																					unit:
																						'px',
																					important: true,
																				},
																				background: {
																					color:
																						'rgba(var(--kubio-color-6),1)',
																				},
																			},
																			offscreenOverlay: {
																				background: {
																					color:
																						'rgba(0,0,0,0.5)',
																				},
																			},
																			icon: {
																				border: {
																					top: {
																						radius: {
																							left: {
																								unit:
																									'%',
																								value:
																									'100',
																							},
																							right: {
																								unit:
																									'%',
																								value:
																									'100',
																							},
																						},
																						width: {
																							value:
																								'0',
																							unit:
																								'px',
																						},
																						style:
																							'solid',
																						color:
																							'black',
																					},
																					left: {
																						width: {
																							value:
																								'0',
																							unit:
																								'px',
																						},
																						style:
																							'solid',
																						color:
																							'black',
																					},
																					right: {
																						width: {
																							value:
																								'0',
																							unit:
																								'px',
																						},
																						style:
																							'solid',
																						color:
																							'black',
																					},
																					bottom: {
																						radius: {
																							left: {
																								unit:
																									'%',
																								value:
																									'100',
																							},
																							right: {
																								unit:
																									'%',
																								value:
																									'100',
																							},
																						},
																						width: {
																							value:
																								'0',
																							unit:
																								'px',
																						},
																						style:
																							'solid',
																						color:
																							'black',
																					},
																				},
																				padding: {
																					top: {
																						unit:
																							'px',
																						value:
																							'5',
																					},
																					bottom: {
																						unit:
																							'px',
																						value:
																							'5',
																					},
																					left: {
																						unit:
																							'px',
																						value:
																							'5',
																					},
																					right: {
																						unit:
																							'px',
																						value:
																							'5',
																					},
																				},
																				size: {
																					unit:
																						'px',
																					value:
																						'24',
																				},
																				media: {
																					mobile: {
																						border: {
																							top: {
																								radius: {
																									left: {
																										value: 0,
																										unit:
																											'px',
																									},
																									right: {
																										value: 0,
																										unit:
																											'px',
																									},
																								},
																							},
																							bottom: {
																								radius: {
																									right: {
																										value: 0,
																										unit:
																											'px',
																									},
																									left: {
																										value: 0,
																										unit:
																											'px',
																									},
																								},
																							},
																						},
																					},
																				},
																				states: {
																					hover: {},
																				},
																				fill:
																					'rgba(var(--kubio-color-6),1)',
																				background: {
																					color:
																						'rgba(0, 0, 0, 0)',
																				},
																			},
																			'sub-menu-icon': {
																				margin: {
																					left: {
																						unit:
																							'px',
																						value:
																							'',
																					},
																					right: {
																						unit:
																							'px',
																						value:
																							'',
																					},
																				},
																			},
																		},
																	},
																	hash:
																		'd35a4110',
																},
																openSide:
																	'right',
																icon:
																	'font-awesome/navicon',
															},
															[
																[
																	'kubio/menu-offscreen-content',
																	{
																		kubio: {
																			id:
																				'Ti9RnLUvY45',
																			styleRef:
																				'4fttDua62gk',
																			hash:
																				'28cc6078',
																		},
																	},
																	[
																		[
																			'kubio/row',
																			{
																				kubio: {
																					id:
																						'ETsB6_l3com',
																					styleRef:
																						'oEwMj8zqLa0',
																					props: {
																						fullBackground: false,
																						layout: {
																							equalWidth: false,
																							equalHeight: true,
																							itemsPerRow: 2,
																							verticalAlign:
																								'center',
																							horizontalAlign:
																								'center',
																							horizontalGap: 0,
																							verticalGap: 2,
																							horizontalInnerGap: 2,
																							verticalInnerGap: 2,
																							custom: {
																								horizontalGap: {
																									unit:
																										'px',
																									value:
																										'',
																								},
																								verticalGap: {
																									unit:
																										'px',
																									value:
																										'',
																								},
																								horizontalInnerGap: {
																									unit:
																										'px',
																									value:
																										'',
																								},
																								verticalInnerGap: {
																									unit:
																										'px',
																									value:
																										'',
																								},
																							},
																						},
																						media: {
																							mobile: {
																								layout: {
																									itemsPerRow: 1,
																									horizontalGap: 0,
																									outerGapLinked: false,
																								},
																							},
																						},
																					},
																					hash:
																						'1c77d460',
																				},
																			},
																			[
																				[
																					'kubio/column',
																					{
																						kubio: {
																							id:
																								'BSPpJAezzHD',
																							styleRef:
																								'dySu33XviAE',
																							props: {
																								overlapOptions: false,
																								layout: {
																									horizontalGap: 2,
																									verticalGap: 2,
																									custom: {
																										horizontalGap: {
																											unit:
																												'px',
																											value:
																												'',
																										},
																										verticalGap: {
																											unit:
																												'px',
																											value:
																												'',
																										},
																										horizontalInnerGap: {
																											unit:
																												'px',
																											value:
																												'',
																										},
																										verticalInnerGap: {
																											unit:
																												'px',
																											value:
																												'',
																										},
																									},
																									verticalAlign:
																										'start',
																									verticalInnerGap:
																										'inherit',
																									horizontalInnerGap:
																										'inherit',
																								},
																								internal: {
																									heroSection: {
																										type: null,
																									},
																								},
																							},
																							style: {
																								descendants: {
																									inner: {
																										customHeight: {
																											type:
																												'fit-to-content',
																											'min-height': {
																												value:
																													'',
																												unit:
																													'px',
																											},
																										},
																										textAlign:
																											'center',
																									},
																								},
																								ancestor: {
																									sticky: {
																										descendants: {
																											inner: {
																												textAlign:
																													'left',
																												media: {
																													mobile: {
																														textAlign:
																															'left',
																													},
																												},
																											},
																										},
																									},
																								},
																							},
																							_style: {
																								descendants: {
																									container: {
																										columnWidth: {
																											type:
																												'custom',
																											custom: {
																												unit:
																													'%',
																												value: 100,
																											},
																										},
																										media: {
																											mobile: {
																												columnWidth: {
																													type:
																														'custom',
																													custom: {
																														value: 100,
																														unit:
																															'%',
																													},
																												},
																											},
																											tablet: {
																												columnWidth: {
																													type:
																														'custom',
																													custom: {
																														unit:
																															'%',
																														value: 100,
																													},
																												},
																											},
																										},
																									},
																								},
																							},
																							hash:
																								'1326e3f9',
																						},
																					},
																					[
																						[
																							'kubio/logo',
																							{
																								kubio: {
																									id:
																										'FWwjUiS_V5',
																									styleRef:
																										'afIZ7lcsb',
																									hash:
																										'53b83982',
																									props: {
																										layoutType:
																											'text',
																									},
																									style: {
																										descendants: {
																											text: {
																												typography: {
																													color:
																														'rgba(var(--kubio-color-5),1)',
																													size: {
																														value: 20,
																														unit:
																															'px',
																													},
																												},
																											},
																										},
																									},
																								},
																								linkTo:
																									'homePage',
																								link: {
																									typeOpenLink:
																										'sameWindow',
																								},
																								mode:
																									'autodetect-mode',
																							},
																							[],
																						],
																					],
																				],
																			],
																		],
																		[
																			'kubio/accordion-menu',
																			{
																				kubio: {
																					id:
																						'VOa5W9bLGmX',
																					styleRef:
																						'RfKm7zJUMjR',
																					style: {
																						descendants: {
																							'main-menu-a': {
																								typography: {
																									color:
																										'rgba(var(--kubio-color-5),1)',
																								},
																								states: {
																									hover: {
																										background: {
																											color:
																												'rgba(var(--kubio-color-1),1)',
																										},
																									},
																									menuButtonActive: {
																										background: {
																											color:
																												'rgba(var(--kubio-color-1),1)',
																										},
																									},
																								},
																								border: {
																									bottom: {
																										color:
																											'rgba(var(--kubio-color-5),0.2)',
																									},
																								},
																							},
																							'sub-menu-a': {
																								color:
																									'rgba(var(--kubio-color-5),1)',
																								states: {
																									hover: {
																										background: {
																											color:
																												'rgba(var(--kubio-color-1),0.8)',
																										},
																									},
																									menuButtonActive: {
																										background: {
																											color:
																												'rgba(var(--kubio-color-1),0.8)',
																										},
																									},
																								},
																								border: {
																									bottom: {
																										color:
																											'rgba(var(--kubio-color-5),0.2)',
																									},
																								},
																							},
																						},
																					},
																					hash:
																						'fd7a019e',
																				},
																				hideSubmenu: false,
																			},
																			[
																				[
																					'kubio/menu-items',
																					{
																						location:
																							'header-menu',
																						id: 0,
																						kubio: {
																							id:
																								'LJ23r8EMBuH',
																							styleRef:
																								'7riXk8OqsUS',
																							hash:
																								'37b03aac',
																						},
																					},
																					[],
																				],
																			],
																		],
																		[
																			'kubio/row',
																			{
																				kubio: {
																					id:
																						'dETo5WiIFti',
																					styleRef:
																						'ridFgk2UVqX',
																					props: {
																						fullBackground: false,
																						layout: {
																							equalWidth: false,
																							equalHeight: true,
																							itemsPerRow: 2,
																							verticalAlign:
																								'center',
																							horizontalAlign:
																								'center',
																							horizontalGap: 2,
																							verticalGap: 2,
																							horizontalInnerGap: 2,
																							verticalInnerGap: 2,
																							custom: {
																								horizontalGap: {
																									unit:
																										'px',
																									value:
																										'',
																								},
																								verticalGap: {
																									unit:
																										'px',
																									value:
																										'',
																								},
																								horizontalInnerGap: {
																									unit:
																										'px',
																									value:
																										'',
																								},
																								verticalInnerGap: {
																									unit:
																										'px',
																									value:
																										'',
																								},
																							},
																						},
																						media: {
																							mobile: {
																								layout: {
																									itemsPerRow: 1,
																									horizontalGap: 0,
																									outerGapLinked: false,
																								},
																							},
																						},
																					},
																					hash:
																						'3d92dd71',
																				},
																			},
																			[
																				[
																					'kubio/column',
																					{
																						kubio: {
																							id:
																								'SMKnb5VCZpU',
																							styleRef:
																								'7AuOkWajPWG',
																							props: {
																								overlapOptions: false,
																								layout: {
																									horizontalGap: 2,
																									verticalGap: 2,
																									custom: {
																										horizontalGap: {
																											unit:
																												'px',
																											value:
																												'',
																										},
																										verticalGap: {
																											unit:
																												'px',
																											value:
																												'',
																										},
																										horizontalInnerGap: {
																											unit:
																												'px',
																											value:
																												'',
																										},
																										verticalInnerGap: {
																											unit:
																												'px',
																											value:
																												'',
																										},
																									},
																									verticalAlign:
																										'center',
																									verticalInnerGap:
																										'inherit',
																									horizontalInnerGap:
																										'inherit',
																								},
																								internal: {
																									heroSection: {
																										type: null,
																									},
																								},
																							},
																							style: {
																								descendants: {
																									inner: {
																										textAlign:
																											'center',
																										customHeight: {
																											type:
																												'fit-to-content',
																											'min-height': {
																												value:
																													'',
																												unit:
																													'px',
																											},
																										},
																									},
																								},
																							},
																							_style: {
																								descendants: {
																									container: {
																										columnWidth: {
																											type:
																												'custom',
																											custom: {
																												unit:
																													'%',
																												value: 100,
																											},
																										},
																										media: {
																											mobile: {
																												columnWidth: {
																													type:
																														'custom',
																													custom: {
																														value: 100,
																														unit:
																															'%',
																													},
																												},
																											},
																											tablet: {
																												columnWidth: {
																													type:
																														'custom',
																													custom: {
																														value: 100,
																														unit:
																															'%',
																													},
																												},
																											},
																										},
																									},
																								},
																							},
																							hash:
																								'7d0be2f8',
																						},
																					},
																					[
																						[
																							'kubio/copyright',
																							{
																								kubio: {
																									id:
																										'uGDhnka2rn',
																									styleRef:
																										'nicBEJtZM',
																									hash:
																										'daa2df84',
																									style: {
																										descendants: {
																											container: {
																												typography: {
																													color:
																														'rgba(var(--kubio-color-5),0.4)',
																												},
																											},
																										},
																									},
																								},
																								template:
																									'© {year} {site-name}',
																							},
																							[],
																						],
																					],
																				],
																			],
																		],
																	],
																],
															],
														],
													],
												],
											],
										],
									],
								],
							],
						],
					],
				],
			],
		],
		[
			'kubio/hero',
			{
				kubio: {
					id: 'WnwSdUm5wJL',
					styleRef: 'KFTMhA6WOVh',
					props: {
						width: 'boxed',
						verticalAlign: 'center',
						showHeader: false,
						overlapSection: false,
						attrs: {
							name: 'hero',
							id: 'hero',
						},
						downArrow: {
							enabled: false,
						},
						heroSection: {
							layout: 'textWithMediaOnRight',
							mediaType: 'hop-image',
						},
					},
					style: {
						descendants: {
							outer: {
								customHeight: {
									type: 'fit-to-content',
									'min-height': {
										value: '',
										unit: 'px',
									},
								},
								typography: {
									holders: {
										h1: {},
										h2: {},
										h3: {},
										h4: {},
										h5: {},
										h6: {},
										p: {},
									},
								},
								padding: {
									top: {
										unit: 'px',
										value: 90,
									},
									bottom: {
										unit: 'px',
										value: 90,
									},
								},
								separators: {
									bottom: {
										color: 'white',
									},
									top: {
										color: 'white',
									},
								},
								background: {
									color: '#f4f4f4',
								},
								media: {
									tablet: {
										padding: {
											bottom: {
												value: 60,
												unit: 'px',
											},
											top: {
												value: 60,
												unit: 'px',
											},
										},
									},
									mobile: {
										padding: {
											bottom: {
												value: 30,
												unit: 'px',
											},
											top: {
												value: 30,
												unit: 'px',
											},
										},
									},
								},
							},
						},
					},
					hash: '057281cc',
				},
				attrs: {
					name: 'Hero',
				},
				anchor: 'hero',
			},
			[
				[
					'kubio/row',
					{
						kubio: {
							id: 'Xs6ydDE8r-R',
							props: {
								fullBackground: false,
								layout: {
									equalWidth: false,
									equalHeight: true,
									itemsPerRow: 2,
									verticalAlign: 'center',
									horizontalAlign: 'center',
									horizontalGap: 0,
									verticalGap: 0,
									horizontalInnerGap: 3,
									verticalInnerGap: 3,
									custom: {
										horizontalGap: {
											unit: 'px',
											value: '',
										},
										verticalGap: {
											unit: 'px',
											value: '',
										},
										horizontalInnerGap: {
											unit: 'px',
											value: '',
										},
										verticalInnerGap: {
											unit: 'px',
											value: '',
										},
									},
								},
								media: {
									mobile: {
										layout: {
											itemsPerRow: 1,
											horizontalGap: 0,
											outerGapLinked: false,
										},
									},
								},
							},
							styleRef: 'vv0pRzL5YoZ',
							hash: '612fc898',
						},
					},
					[
						[
							'kubio/column',
							{
								kubio: {
									id: 'ogaY_Aqs4Y5',
									props: {
										overlapOptions: false,
										layout: {
											horizontalGap: 2,
											verticalGap: 2,
											custom: {
												horizontalGap: {
													unit: 'px',
													value: '',
												},
												verticalGap: {
													unit: 'px',
													value: '',
												},
												horizontalInnerGap: {
													unit: 'px',
													value: '',
												},
												verticalInnerGap: {
													unit: 'px',
													value: '',
												},
											},
											verticalAlign: 'center',
											verticalInnerGap: 2,
											horizontalInnerGap: 2,
										},
										internal: {
											heroSection: {
												type: 'text',
											},
										},
									},
									style: {
										descendants: {
											inner: {
												textAlign: 'center',
												customHeight: {
													type: 'fit-to-content',
													'min-height': {
														value: '',
														unit: 'px',
													},
												},
												media: {
													mobile: {
														textAlign: 'center',
													},
													tablet: {
														textAlign: 'center',
													},
												},
												border: {
													top: {
														style: 'solid',
														radius: {
															left: {
																value: '9',
																unit: 'px',
															},
															right: {
																value: '9',
																unit: 'px',
															},
														},
													},
													right: {
														style: 'solid',
													},
													bottom: {
														style: 'solid',
														radius: {
															left: {
																value: '9',
																unit: 'px',
															},
															right: {
																value: '9',
																unit: 'px',
															},
														},
													},
													left: {
														style: 'solid',
													},
												},
												padding: {
													left: {
														unit: 'px',
													},
													right: {
														unit: 'px',
													},
													top: {
														unit: 'px',
													},
													bottom: {
														unit: 'px',
													},
												},
											},
										},
									},
									_style: {
										descendants: {
											container: {
												columnWidth: {
													type: 'custom',
													custom: {
														unit: '%',
														value: 80,
													},
												},
												media: {
													mobile: {
														columnWidth: {
															type: 'custom',
															custom: {
																value: 100,
																unit: '%',
															},
														},
													},
													tablet: {
														columnWidth: {
															custom: {
																value: 80,
																unit: '%',
															},
														},
													},
												},
											},
										},
									},
									styleRef: 'vPVKm6K-swr',
									hash: '1babb0ac',
								},
							},
							[
								[
									'kubio/page-title',
									{
										kubio: {
											id: 'v74FlqW2oy',
											styleRef: 'SzZXH7PdCL',
											props: {
												level: 'h1',
											},
											hash: '382cd5b6',
										},
										templates: {
											normalPage: '{TITLE}',
											normalResultsPage:
												'Search results for: {TITLE}',
											errorPage: 'Sorry! Page Not Found!',
											singlePost: '{TITLE}',
											categoryArchive: 'Posts in {TITLE}',
											authorArchive: 'Posts by {TITLE}',
											tagArchive: 'Posts about {TITLE}',
											yearArchive: 'Posts from {TITLE}',
											monthArchive: 'Posts from {TITLE}',
											dayArchive: 'Posts from {TITLE}',
										},
									},
									[],
								],
							],
						],
					],
				],
			],
		],
	],
];

export default header;
