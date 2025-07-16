import { __ } from '@wordpress/i18n';

export default {
	name: 'cspromo/subscribe',
	isDefault: true,
	title: __( 'Subscribe Form', 'iconvert-promoter' ),
	attributes: {
		kubio: {
			style: {
				descendants: {
					container: {
						textAlign: 'left',
						display: 'grid',
						border: {
							top: {
								radius: {
									left: {
										value: 0,
										unit: 'px',
									},
									right: {
										value: 0,
										unit: 'px',
									},
								},
								style: 'none',
								width: {
									value: 0,
									unit: 'px',
								},
							},
							bottom: {
								radius: {
									right: {
										value: 0,
										unit: 'px',
									},
									left: {
										value: 0,
										unit: 'px',
									},
								},
								style: 'none',
								width: {
									value: 0,
									unit: 'px',
								},
							},
							right: {
								style: 'none',
								width: {
									value: 0,
									unit: 'px',
								},
							},
							left: {
								style: 'none',
								width: {
									value: 0,
									unit: 'px',
								},
							},
						},
						gap: {
							value: 10,
							unit: 'px',
						},
					},
					containerFields: {
						alignItems: 'flex-end',
					},
					nameContainer: {
						width: {
							unit: '%',
							value: 100,
						},
						flex: '1 1 auto',
						margin: {
							right: {
								unit: '%',
								value: 0,
							},
						},
						display: 'inline-block',
					},
					submitButton: {
						width: {
							unit: '%',
							value: 100,
						},
						whiteSpace: 'nowrap',
						cursor: 'pointer',
						background: {
							color: 'rgba(var(--kubio-color-1),1)',
						},
						states: {
							hover: {
								background: {
									color: 'rgba(var(--kubio-color-1-variant-4),1)',
								},
							},
						},
						typography: {
							color: '#ffffff',
							size: {
								unit: 'px',
								value: 14,
							},
							transform: 'none',
							lineHeight: 1.1,
							weight: 700,
							letterSpacing: {
								value: 0,
								unit: 'px',
							},
						},
						padding: {
							top: {
								unit: 'px',
								value: 15,
							},
							bottom: {
								unit: 'px',
								value: 15,
							},
							right: {
								value: 30,
								unit: 'px',
							},
							left: {
								value: 30,
								unit: 'px',
							},
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
								style: 'none',
								width: {
									value: 0,
									unit: 'px',
								},
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
								style: 'none',
								width: {
									value: 0,
									unit: 'px',
								},
							},
							right: {
								style: 'none',
								width: {
									value: 0,
									unit: 'px',
								},
							},
							left: {
								style: 'none',
								width: {
									value: 0,
									unit: 'px',
								},
							},
						},
					},
					submitContainer: {
						width: {
							unit: '%',
							value: 100,
						},
						flex: '1 1 auto',
						display: 'inline-block',
					},
					emailContainer: {
						flex: '1 1 auto',
						width: {
							unit: '%',
							value: 100,
						},
						margin: {
							right: {
								unit: '%',
								value: 0,
							},
						},
						display: 'inline-block',
					},
					termsContainer: {
						justifyContent: 'flex-start',
						display: 'flex',
						alignItems: 'flex-start',
						margin: {
							bottom: {
								unit: 'px',
								value: 0,
							},
						},
					},
					gapSpacer: {
						gap: {
							value: 10,
							unit: 'px',
						},
					},
					innerForm: {
						display: 'grid',
					},
					successNotice: {
						typography: {
							color: '#007F0B',
							size: {
								unit: 'px',
								value: 13,
							},
							letterSpacing: {
								value: 0,
								unit: 'px',
							},
						},
						background: {
							color: '#D3F8C0',
						},
						border: {
							top: {
								color: '#d3f8c0',
								style: 'none',
								width: {
									value: 0,
									unit: 'px',
								},
								radius: {
									left: {
										value: 6,
										unit: 'px',
									},
									right: {
										value: 6,
										unit: 'px',
									},
								},
							},
							bottom: {
								color: '#d3f8c0',
								style: 'none',
								width: {
									value: 0,
									unit: 'px',
								},
								radius: {
									left: {
										value: 6,
										unit: 'px',
									},
									right: {
										value: 6,
										unit: 'px',
									},
								},
							},
							left: {
								color: '#d3f8c0',
								style: 'none',
								width: {
									value: 0,
									unit: 'px',
								},
							},
							right: {
								color: '#d3f8c0',
								style: 'none',
								width: {
									value: 0,
									unit: 'px',
								},
							},
						},
						padding: {
							top: {
								unit: 'px',
								value: 5,
							},
							bottom: {
								unit: 'px',
								value: 5,
							},
							left: {
								unit: 'px',
								value: 5,
							},
							right: {
								unit: 'px',
								value: 5,
							},
						},
						textAlign: 'center',
					},
					infoNotice: {
						typography: {
							color: '#2595D9',
							size: {
								unit: 'px',
								value: 13,
							},
							letterSpacing: {
								value: 0,
								unit: 'px',
							},
						},
						background: {
							color: '#D9F6FF',
						},
						border: {
							top: {
								color: '#D9F6FF',
								style: 'none',
								width: {
									value: 0,
									unit: 'px',
								},
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
							},
							bottom: {
								color: '#D9F6FF',
								style: 'none',
								width: {
									value: 0,
									unit: 'px',
								},
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
							},
							left: {
								color: '#D9F6FF',
								style: 'none',
								width: {
									value: 0,
									unit: 'px',
								},
							},
							right: {
								color: '#D9F6FF',
								style: 'none',
								width: {
									value: 0,
									unit: 'px',
								},
							},
						},
						padding: {
							top: {
								unit: 'px',
								value: 5,
							},
							bottom: {
								unit: 'px',
								value: 5,
							},
							left: {
								unit: 'px',
								value: 5,
							},
							right: {
								unit: 'px',
								value: 5,
							},
						},
						textAlign: 'center',
					},
					errorNotice: {
						typography: {
							color: '#CC0000',
							size: {
								unit: 'px',
								value: 13,
							},
							letterSpacing: {
								value: 0,
								unit: 'px',
							},
						},
						background: {
							color: '#FFD2D2',
						},
						border: {
							top: {
								color: '#FFD2D2',
								style: 'none',
								width: {
									value: 0,
									unit: 'px',
								},
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
							},
							bottom: {
								color: '#FFD2D2',
								style: 'none',
								width: {
									value: 0,
									unit: 'px',
								},
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
							},
							left: {
								color: '#FFD2D2',
								style: 'none',
								width: {
									value: 0,
									unit: 'px',
								},
							},
							right: {
								color: '#FFD2D2',
								style: 'none',
								width: {
									value: 0,
									unit: 'px',
								},
							},
						},
						padding: {
							top: {
								unit: 'px',
								value: 5,
							},
							bottom: {
								unit: 'px',
								value: 5,
							},
							left: {
								unit: 'px',
								value: 5,
							},
							right: {
								unit: 'px',
								value: 5,
							},
						},
						textAlign: 'center',
					},
					groupLabels: {
						typography: {
							color: 'rgba(var(--kubio-color-6-variant-4),1)',
							size: {
								value: 14,
								unit: 'px',
							},
							weight: 400,
							letterSpacing: {
								value: 0,
								unit: 'px',
							},
						},
					},
					groupFields: {
						width: {
							unit: '%',
							value: 100,
						},
						padding: {
							top: {
								value: 9,
								unit: 'px',
							},
							bottom: {
								value: 9,
								unit: 'px',
							},
							left: {
								value: 10,
								unit: 'px',
							},
							right: {
								value: 10,
								unit: 'px',
							},
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
								width: {
									value: 1,
									unit: 'px',
								},
								color: 'rgba(var(--kubio-color-5-variant-2),1)',
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
								width: {
									value: 1,
									unit: 'px',
								},
								color: 'rgba(var(--kubio-color-5-variant-2),1)',
							},
							right: {
								style: 'solid',
								width: {
									value: 1,
									unit: 'px',
								},
								color: 'rgba(var(--kubio-color-5-variant-2),1)',
							},
							left: {
								style: 'solid',
								width: {
									value: 1,
									unit: 'px',
								},
								color: 'rgba(var(--kubio-color-5-variant-2),1)',
							},
						},
						background: {
							color: 'rgba(var(--kubio-color-5),1)',
						},
						typography: {
							size: {
								value: 16,
								unit: 'px',
							},
							color: 'rgba(var(--kubio-color-6),1)',
							lineHeight: 1,
							minHeight: 'auto',
							letterSpacing: {
								value: 0,
								unit: 'px',
							},
						},
					},
					termsContainerAlign: {
						display: 'inline-block',
					},
					termsCheckbox: {
						display: 'inline-block',
						lineHeight: 1,
					},
					termsField: {
						appearance: 'none',
						outer: 'none',
						background: {
							color: 'rgba(var(--kubio-color-5),1)',
						},
						margin: {
							top: {
								unit: 'px',
								value: 0,
							},
							right: {
								unit: 'px',
								value: 8,
							},
							left: {
								unit: 'px',
								value: 0,
							},
							bottom: {
								unit: 'px',
								value: 0,
							},
						},
						height: {
							unit: 'px',
							value: 16,
						},
						width: {
							unit: 'px',
							value: 16,
						},
						border: {
							top: {
								radius: {
									left: {
										value: 3,
										unit: 'px',
									},
									right: {
										value: 3,
										unit: 'px',
									},
								},
								style: 'solid',
								color: 'rgba(var(--kubio-color-6),1)',
								width: {
									value: 1,
									unit: 'px',
								},
							},
							bottom: {
								radius: {
									right: {
										value: 3,
										unit: 'px',
									},
									left: {
										value: 3,
										unit: 'px',
									},
								},
								style: 'solid',
								color: 'rgba(var(--kubio-color-6),1)',
								width: {
									value: 1,
									unit: 'px',
								},
							},
							right: {
								style: 'solid',
								color: 'rgba(var(--kubio-color-6),1)',
								width: {
									value: 1,
									unit: 'px',
								},
							},
							left: {
								style: 'solid',
								color: 'rgba(var(--kubio-color-6),1)',
								width: {
									value: 1,
									unit: 'px',
								},
							},
						},
					},
					termsIcon: {
						display: 'none',
						typography: {
							color: 'rgba(var(--kubio-color-3),1)',
						},
						height: {
							unit: 'px',
							value: 13,
						},
						width: {
							unit: 'px',
							value: 13,
						},
						top: {
							unit: 'px',
							value: 2,
						},
						left: {
							unit: 'px',
							value: 2,
						},
						margin: {
							top: {
								unit: 'px',
								value: 0,
							},
							right: {
								unit: 'px',
								value: 0,
							},
							left: {
								unit: 'px',
								value: 0,
							},
							bottom: {
								unit: 'px',
								value: 0,
							},
						},
					},
					termsLabel: {
						typography: {
							color: 'rgba(var(--kubio-color-6-variant-4),1)',
							size: {
								unit: 'px',
								value: 15,
							},
							lineHeight: 1,
							weight: 400,
							letterSpacing: {
								value: 0,
								unit: 'px',
							},
						},
						padding: {
							bottom: {
								value: 0,
								unit: 'px',
							},
							top: {
								value: 0,
								unit: 'px',
							},
						},
						margin: {
							top: {
								value: 0,
								unit: 'px',
							},
							bottom: {
								value: 15,
								unit: 'px',
							},
						},
						cursor: 'pointer',
					},
					termsDescription: {
						typography: {
							color: 'rgba(var(--kubio-color-6-variant-3),1)',
							size: {
								unit: 'px',
								value: 13,
							},
							weight: '400',
							letterSpacing: {
								value: 0,
								unit: 'px',
							},
							lineHeight: {
								value: 1.4,
								unit: '',
							},
						},
					},
					submitIcon: {
						margin: {
							left: {
								unit: 'px',
								value: 0,
							},
							right: {
								unit: 'px',
								value: 10,
							},
						},
						height: {
							unit: 'px',
							value: 16,
						},
						width: {
							unit: 'px',
							value: 16,
						},
					},
					termsDescriptionLinks: {
						typography: {
							color: 'rgba(var(--kubio-color-1),1)',
							letterSpacing: {
								value: 0,
								unit: 'px',
							},
							size: {
								value: 13,
								unit: 'px',
							},
							decoration: 'underline',
						},
					},
				},
			},
			props: {
				internal: {
					type: 'object',
				},
				overlapOptions: true,
				submitButtonCustomWidth: {
					lastHorizontalPadding: {
						left: {
							unit: 'px',
							value: 20,
						},
						right: {
							unit: 'px',
							value: 20,
						},
					},
				},
				submitButtonWidth: 'custom',
			},
		},
		showNotices: true,
		successNotice: {
			label: 'Submitted successfully',
		},
		infoNotice: {
			label: 'This email is already registered!',
		},
		errorNotice: {
			label: 'Error! Form was not processed.',
		},
		formFields: 'name-email',
		formLayout: 'vertical',
		stackOnMobile: true,
		formConsent: false,
		nameLabelDisplay: true,
		nameLabel: 'Name',
		nameFieldPlaceholder: '',
		emailLabelDisplay: true,
		emailLabel: 'Email',
		emailFieldPlaceholder: '',
		termsIcon: 'font-awesome/check',
		termsLabelDisplay: true,
		termsLabel: 'I agree to terms & conditions',
		termsFieldChecked: false,
		termsDescription:
			'By checking this box, you acknowledge that you have read &amp; agree to our <a href="#">Privacy Policy</a> and <a href="#">Terms &amp; Conditions.</a>',
		submitText: 'Subscribe to Newsletter',
		submitIconEnabled: true,
		submitIcon: 'font-awesome/envelope',
		submitIconPosition: 'before',
		submitIconSpace: {
			unit: 'px',
			value: 10,
		},
		onSuccessAction: 'showNotice',
		onSuccessPopup: '0',
		link: {
			typeOpenLink: 'sameWindow',
		},
	},
	innerBlocks: [
		{
			name: 'cspromo/row',

			attributes: {
				kubio: {
					props: {
						layout: {
							equalHeight: true,
							equalWidth: false,
							horizontalGap: 0,
							verticalGap: 0,
						},
					},
				},
			},
			innerBlocks: [
				{
					name: 'cspromo/column',

					attributes: {
						kubio: {
							style: {
								descendants: {
									inner: {
										background: {
											color: 'rgba(var(--kubio-color-5),1)',
										},
										typography: {
											holders: {
												p: {
													color: 'rgba(var(--kubio-color-5),1)',
												},
											},
										},
										border: {
											top: {
												radius: {
													left: {
														value: 10,
														unit: 'px',
													},
													right: {
														value: 10,
														unit: 'px',
													},
												},
											},
											bottom: {
												radius: {
													right: {
														value: 10,
														unit: 'px',
													},
													left: {
														value: 10,
														unit: 'px',
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
											type: 'flexgrow',
											custom: { value: 50, unit: '%' },
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
										},
									},
								},
							},
							props: {
								layout: {
									horizontalInnerGap: 3,
									verticalInnerGap: 3,
									vSpace: { value: 10, unit: 'px' },
									verticalAlign: 'center',
								},
							},
						},
					},
					innerBlocks: [
						{
							name: 'cspromo/row',

							attributes: {
								kubio: {
									props: {
										layout: {
											equalHeight: true,
											equalWidth: false,
											horizontalGap: 0,
											verticalGap: 0,
											horizontalAlign: 'center',
										},
									},
								},
							},
							innerBlocks: [
								{
									name: 'cspromo/column',

									attributes: {
										kubio: {
											props: {
												layout: {
													verticalAlign: 'center',
													horizontalInnerGap: 1,
													verticalInnerGap: 1,
												},
											},
											_style: {
												descendants: {
													container: {
														columnWidth: {
															type: 'fitToContent',
															custom: {
																value: 50,
																unit: '%',
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
														},
													},
												},
											},
										},
									},
									innerBlocks: [
										{
											name: 'cspromo/icon',

											attributes: {
												kubio: {
													props: {
														horizontalAlign:
															'center',
													},
													style: {
														descendants: {
															inner: {
																fill: 'rgba(var(--kubio-color-3),1)',
																width: {
																	value: 40,
																	unit: 'px',
																},
																height: {
																	value: 40,
																	unit: 'px',
																},
															},
														},
													},
												},
												link: {
													value: '',
													typeOpenLink: 'sameWindow',
													noFollow: false,
													lightboxMedia: '',
												},
												name: 'icons8-line-awesome/check-circle',
											},
										},
									],
								},
								{
									name: 'cspromo/column',

									attributes: {
										kubio: {
											style: {
												descendants: {
													inner: {
														textAlign: 'left',
														media: {
															mobile: {
																textAlign:
																	'center',
																padding: {
																	bottom: {
																		value: 10,
																		unit: 'px',
																	},
																},
															},
														},
													},
												},
											},
											props: {
												layout: {
													verticalAlign: 'center',
													horizontalInnerGap: 1,
													verticalInnerGap: 1,
												},
												media: {
													mobile: {
														layout: {
															verticalInnerGap: 0,
														},
													},
												},
											},
											_style: {
												descendants: {
													container: {
														columnWidth: {
															type: 'fitToContent',
															custom: {
																value: 50,
																unit: '%',
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
														},
													},
												},
											},
										},
									},
									innerBlocks: [
										{
											name: 'cspromo/text',

											originalContent:
												'Thank You for Signing Up!',

											attributes: {
												kubio: {
													style: {
														descendants: {
															text: {
																typography: {
																	color: 'rgba(var(--kubio-color-6),1)',
																	size: {
																		value: 18,
																		unit: 'px',
																	},
																	weight: 500,
																},
															},
														},
													},
												},
												content:
													'Thank You for Signing Up!',
												dropCap: false,
											},
										},
									],
								},
							],
						},
					],
				},
			],
		},
	],
};
