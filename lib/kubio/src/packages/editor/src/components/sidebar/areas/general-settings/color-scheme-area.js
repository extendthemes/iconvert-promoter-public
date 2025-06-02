import { STORE_KEY } from '@kubio/constants';
import {
	ColorIndicator,
	ColorIndicatorPopover,
	ControlNotice,
	SeparatorHorizontalLine,
} from '@kubio/controls';
import { useGlobalDataColors } from '@kubio/global-data';
import {
	BaseControl,
	Button,
	Flex,
	FlexBlock,
	FlexItem,
	PanelBody,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useCallback, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import classnames from 'classnames';
import isEqual from 'react-fast-compare';
import tinycolor from 'tinycolor2';
import colorPalettes from '../../../../consts/color-palettes';
import SubSidebarArea from '../../subsidebar-area';

const ColorSchemePanel = () => {
	const { getPalette, setPalette } = useGlobalDataColors();

	const colors = getPalette();

	const [localColors, setLocalColors] = useState(colors);

	const isKubioTheme = useSelect((select) => {
		return select('kubio/edit-site')?.getSettings()?.isKubioTheme || null;
	});

	const updateColor = useCallback(
		(index, color) => {
			const parsedColor = tinycolor(color);
			const rgbColor = [parsedColor._r, parsedColor._g, parsedColor._b];

			const newColors = [...localColors];
			newColors[index] = {
				...newColors[index],
				color: rgbColor,
			};

			if (!isEqual(localColors[index].color, newColors[index].color)) {
				setLocalColors(newColors);
				setPalette(newColors);
			}
		},
		[setLocalColors, setPalette, localColors]
	);

	const updateColorPalette = useCallback(
		(newPalette) => {
			setLocalColors([...newPalette]);
			setPalette([...newPalette]);
		},
		[setLocalColors, setPalette]
	);

	const handleClick = (palette) => {
		return () => {
			updateColorPalette(palette.colors);
		};
	};

	const handleColorChange = (index) => {
		return (value) => {
			updateColor(index, value);
		};
	};

	const addColor = useCallback(() => {
		const nextColor = parseInt(localColors.length) + 1;
		const newColor = {
			slug: 'kubio-color-' + nextColor,
			color: [255, 255, 255],
		};
		localColors.push(newColor);
		setPalette(localColors);
	}, [setLocalColors, setPalette, localColors]);

	const deleteColor = useCallback(
		(index) => {
			localColors.splice(index, 1);
			setPalette(localColors);
		},
		[setLocalColors, setPalette, localColors]
	);

	const disabled = false;

	return (
		<PanelBody
			title={__('Color Palette', 'kubio')}
			className={'kubio-color-palette-panel'}
		>
			<BaseControl>
				<Flex justify="center" className="">
					<FlexBlock>
						<BaseControl>
							{__('Current color scheme', 'kubio')}
						</BaseControl>
					</FlexBlock>
					<FlexItem>
						<span className={'c-components-units-list'}>
							{/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
							<span
								role="button"
								tabIndex={0}
								key={'palette-add-color'}
								className={
									'c-components-units-list__item is-selected add-colors-button'
								}
								onClick={addColor}
							>
								{__('Add colors', 'kubio')}
							</span>
						</span>
					</FlexItem>
				</Flex>
				<Flex gap={0} className="kubio-current-colors-palette">
					{localColors.map(({ color, slug }, index) => {
						const rgbColor = `rgb(${color.join(',')})`;
						return (
							<ColorIndicatorPopover
								key={`${slug}-${index}`}
								color={rgbColor}
								onChange={handleColorChange(index)}
								alpha={false}
								showPalette={false}
								returnRawValue={true}
								disabled={disabled}
								hasButton={index > 5 ? true : false}
								buttonIcon={false}
								buttonText={__('Remove color', 'kubio')}
								onReset={() => deleteColor(index)}
							/>
						);
					})}
				</Flex>
			</BaseControl>

			{!isKubioTheme && (
				<ControlNotice
					className={'notice-general-settings no-padding'}
					content={__(
						'These settings are applied to Kubio blocks and the blocks within.',
						'kubio'
					)}
				/>
			)}

			<SeparatorHorizontalLine />

			{/* eslint-disable-next-line @wordpress/no-base-control-with-label-without-id */}
			<BaseControl
				label={__('More Palettes', 'kubio')}
				className={'more_palettes_base'}
			>
				{colorPalettes.map((palette, index) => (
					// eslint-disable-next-line @wordpress/no-base-control-with-label-without-id
					<BaseControl
						label={palette.label}
						key={index}
						className={classnames(
							'kubio-color-scheme-base-control'
						)}
					>
						<Button
							className={'kubio-color-scheme-selector'}
							onClick={handleClick(palette)}
							key={palette.label}
						>
							<Flex gap={0}>
								{palette.colors.map(({ slug, color }) => (
									<ColorIndicator
										key={slug}
										value={`rgb(${color.join(',')})`}
									/>
								))}
							</Flex>
						</Button>
					</BaseControl>
				))}
			</BaseControl>
		</PanelBody>
	);
};

const ColorSchemePanelWrapper = ({ areaIdentifier }) => {
	const isOpen = useSelect(
		(select) => select(STORE_KEY).isEditorSidebarOpened(areaIdentifier),
		[]
	);

	return isOpen && <ColorSchemePanel />;
};

export default function ColorSchemeArea({ parentAreaIdentifier }) {
	return (
		<SubSidebarArea
			title={'Color Scheme'}
			parentAreaIdentifier={parentAreaIdentifier}
			areaIdentifier={`${parentAreaIdentifier}/color-scheme`}
		>
			<ColorSchemePanelWrapper
				areaIdentifier={`${parentAreaIdentifier}/color-scheme`}
			/>
		</SubSidebarArea>
	);
}
