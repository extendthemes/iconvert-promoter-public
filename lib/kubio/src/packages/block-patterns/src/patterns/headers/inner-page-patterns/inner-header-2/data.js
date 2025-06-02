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
									},
								},
								padding: {
									top: {
										value: 30,
										unit: 'px',
									},
									bottom: {
										value: 30,
										unit: 'px',
									},
								},
								background: {
									color: 'rgba(var(--kubio-color-6),0)',
								},
								border: {
									bottom: {
										style: 'solid',
										width: {
											value: 1,
											unit: 'px',
										},
										color: 'rgba(var(--kubio-color-5),0.4)',
									},
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
					hash: '20960a4a',
				},
				anchor: 'navigation',
				attrs: {
					id: 'navigation',
					name: 'Navigation',
				},
			},
			[
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
															horizontalGap: 2,
														},
													},
												},
												containerWidth: 'boxed',
											},
											hash: '3c5a90fa',
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
																	tablet: {},
																},
															},
														},
														ancestor: {
															sticky: {
																descendants: {
																	container: {
																		media: {
																			mobile: {},
																		},
																	},
																},
															},
														},
													},
													hash: '8afce908',
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
															hash: 'c156324c',
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
																		alignItems:
																			'flex-start',
																		justifyContent:
																			'flex-start',
																	},
																},
																ancestor: {
																	sticky: {
																		descendants: {
																			container: {
																				alignItems:
																					'flex-start',
																				justifyContent:
																					'flex-start',
																				media: {
																					mobile: {
																						alignItems:
																							'flex-start',
																						justifyContent:
																							'flex-start',
																					},
																				},
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
																		'flexgrow',
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
																	tablet: {},
																},
															},
														},
														ancestor: {
															sticky: {
																descendants: {
																	container: {
																		media: {
																			mobile: {},
																		},
																	},
																},
															},
														},
													},
													hash: '6355509e',
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
																		background: {
																			color:
																				'rgba(var(--kubio-color-5),1)',
																		},
																		height: {
																			value:
																				'3',
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
																				'rgba(var(--kubio-color-5),1)',
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
															hash: '41dba727',
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
																				background: {
																					color:
																						'rgba(0, 0, 0, 0.1)',
																				},
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
																				fill:
																					'white',
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
																		'7e64ffcb',
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
																											'left',
																										media: {
																											mobile: {
																												textAlign:
																													'left',
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
																								'4a03dd36',
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
																										'0dec6e40',
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
																											container: {
																												alignItems:
																													'flex-start',
																												justifyContent:
																													'flex-start',
																												media: {
																													mobile: {
																														alignItems:
																															'flex-start',
																														justifyContent:
																															'flex-start',
																													},
																												},
																											},
																										},
																										ancestor: {
																											sticky: {
																												descendants: {
																													container: {
																														alignItems:
																															'flex-start',
																														justifyContent:
																															'flex-start',
																														media: {
																															mobile: {
																																alignItems:
																																	'flex-start',
																																justifyContent:
																																	'flex-start',
																															},
																														},
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
																						'6f7298b8',
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
										[
											'kubio/column',
											{
												kubio: {
													id: 'itOd31Lj7Gh',
													styleRef: 'g5m06BFyqzn',
													style: {
														descendants: {
															inner: {
																textAlign:
																	'left',
																media: {
																	mobile: {
																		textAlign:
																			'center',
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
																					'center',
																			},
																		},
																	},
																},
															},
														},
													},
													props: {
														layout: {
															verticalAlign:
																'center',
														},
														internal: {
															navContent: {
																type: 'custom',
															},
														},
													},
													_props: {},
													_style: {
														descendants: {
															container: {
																columnWidth: {
																	type:
																		'fitToContent',
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
																	tablet: {},
																},
															},
														},
														ancestor: {
															sticky: {
																descendants: {
																	container: {
																		media: {
																			mobile: {},
																		},
																	},
																},
															},
														},
													},
													hash: '5af6d8ce',
												},
											},
											[
												[
													'kubio/buttongroup',
													{
														kubio: {
															id: 'Q3Vydhy8Psb',
															styleRef:
																'UspUln-TmkS',
															style: {
																descendants: {
																	outer: {
																		textAlign:
																			'left',
																		media: {
																			mobile: {
																				textAlign:
																					'center',
																			},
																		},
																	},
																},
																ancestor: {
																	sticky: {
																		descendants: {
																			outer: {
																				textAlign:
																					'left',
																				media: {
																					mobile: {
																						textAlign:
																							'center',
																					},
																				},
																			},
																		},
																	},
																},
															},
															_props: {},
															_style: {},
															hash: '37d4a219',
														},
													},
													[
														[
															'kubio/button',
															{
																kubio: {
																	id:
																		'zPBMlDa4Xfiw',
																	styleRef:
																		'Z8OcPEpFFkNC',
																	props: {
																		buttonWidth:
																			'fitToContent',
																		iconPosition:
																			'after',
																		showIcon: false,
																		buttonSize:
																			'medium',
																		horizontalAlign:
																			'center',
																	},
																	style: {
																		descendants: {
																			link: {
																				textAlign:
																					'center',
																				background: {
																					color:
																						'rgba(var(--kubio-color-1),1)',
																				},
																				typography: {
																					color:
																						'#fff',
																					family:
																						'Open Sans',
																					margin: {
																						top:
																							'',
																						bottom:
																							'2rem',
																					},
																					size: {
																						unit:
																							'px',
																						value:
																							'12',
																					},
																					weight:
																						'600',
																					lineHeight: {
																						value:
																							'1',
																						unit:
																							'',
																					},
																					transform:
																						'uppercase',
																					letterSpacing: {
																						value:
																							'1',
																						unit:
																							'px',
																					},
																				},
																				border: {
																					top: {
																						color:
																							'rgba(var(--kubio-color-1),1)',
																						style:
																							'solid',
																						width: {
																							value:
																								'2',
																							unit:
																								'px',
																						},
																						radius: {
																							right: {
																								value: 5,
																								unit:
																									'px',
																							},
																							left: {
																								value: 5,
																								unit:
																									'px',
																							},
																						},
																					},
																					bottom: {
																						color:
																							'rgba(var(--kubio-color-1),1)',
																						style:
																							'solid',
																						width: {
																							value:
																								'2',
																							unit:
																								'px',
																						},
																						radius: {
																							right: {
																								value: 5,
																								unit:
																									'px',
																							},
																							left: {
																								value: 5,
																								unit:
																									'px',
																							},
																						},
																					},
																					right: {
																						color:
																							'rgba(var(--kubio-color-1),1)',
																						style:
																							'solid',
																						width: {
																							value:
																								'2',
																							unit:
																								'px',
																						},
																					},
																					left: {
																						color:
																							'rgba(var(--kubio-color-1),1)',
																						style:
																							'solid',
																						width: {
																							value:
																								'2',
																							unit:
																								'px',
																						},
																					},
																				},
																				padding: {
																					top: {
																						unit:
																							'px',
																						value:
																							'12',
																					},
																					bottom: {
																						unit:
																							'px',
																						value:
																							'12',
																					},
																					left: {
																						unit:
																							'px',
																						value:
																							'24',
																					},
																					right: {
																						unit:
																							'px',
																						value:
																							'24',
																					},
																				},
																				states: {
																					hover: {
																						background: {
																							color:
																								'rgba(var(--kubio-color-1-variant-4),1)',
																						},
																						border: {
																							top: {
																								color:
																									'rgba(var(--kubio-color-1-variant-4),1)',
																							},
																							right: {
																								color:
																									'rgba(var(--kubio-color-1-variant-4),1)',
																							},
																							bottom: {
																								color:
																									'rgba(var(--kubio-color-1-variant-4),1)',
																							},
																							left: {
																								color:
																									'rgba(var(--kubio-color-1-variant-4),1)',
																							},
																						},
																					},
																				},
																			},
																			icon: {
																				size: {
																					unit:
																						'px',
																					value:
																						'12',
																				},
																				margin: {
																					left: {
																						value: 10,
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
																		},
																	},
																	hash:
																		'725f2166',
																},
																text:
																	'Start Now!',
																link: {
																	value: '',
																	typeOpenLink:
																		'sameWindow',
																	noFollow: false,
																	lightboxMedia:
																		'',
																},
																preserveSpace: {
																	text: false,
																},
																icon: {
																	name:
																		'font-awesome/arrow-right',
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
										h1: {
											color:
												'rgba(var(--kubio-color-5),1)',
										},
										h2: {
											color:
												'rgba(var(--kubio-color-5),1)',
										},
										h3: {
											color:
												'rgba(var(--kubio-color-5),1)',
										},
										h4: {
											color:
												'rgba(var(--kubio-color-5),1)',
										},
										h5: {
											color:
												'rgba(var(--kubio-color-5),1)',
										},
										h6: {
											color:
												'rgba(var(--kubio-color-5),1)',
										},
										p: {
											color:
												'rgba(var(--kubio-color-5),1)',
										},
									},
								},
								background: {
									type: 'image',
									overlay: {
										enabled: true,
										type: 'color',
										gradient:
											'linear-gradient(-20deg, rgba(183, 33, 255, 0.8) 0%,rgba(33, 212, 253, 0.8) 100%)',
										shape: {
											value: 'none',
											isTile: false,
										},
										color: {
											opacity: '0.50',
										},
									},
									image: [
										{
											source: {
												url:
													'https://s3.us-west-2.amazonaws.com/static-assets.kubiobuilder.com/inner-headers/2-inner-header.jpeg',
											},
											position: {
												x: 50,
												y: 67,
											},
										},
									],
								},
								padding: {
									top: {
										unit: 'px',
										value: 120,
									},
									bottom: {
										unit: 'px',
										value: 120,
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
								media: {
									mobile: {
										padding: {
											top: {
												value: 60,
												unit: 'px',
											},
											bottom: {
												value: 60,
												unit: 'px',
											},
										},
									},
									tablet: {
										padding: {
											top: {
												value: 90,
												unit: 'px',
											},
											bottom: {
												value: 90,
												unit: 'px',
											},
										},
									},
								},
							},
						},
					},
					hash: '43f19b3e',
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
									'kubio/heading',
									{
										kubio: {
											id: '3_g-eOke0p',
											styleRef: 'VVPN0yRMwx',
											style: {},
											props: {
												level: 6,
												fancy: {
													fancyRotatingWords:
														"awesome\namazing\nimpressive",
												},
											},
											_props: {},
											_style: {},
											hash: '60ac7fe0',
										},
										link: {
											typeOpenLink: 'sameWindow',
										},
										content:
											'<meta charset="utf-8">Here is your motto',
										anchor: 'heading',
									},
									[],
								],
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
