import { memo, useCallback, useMemo, useState } from '@wordpress/element';
import { GutentagSelectControl, ToggleGroup } from '../../../components';
import { __ } from '@wordpress/i18n';
import TypographyControl from '../../typography-control';
import { useDataHelperDefaultOptionsContext } from '@kubio/core';
import _ from 'lodash';
import { useInheritedTypographyValue } from '@kubio/global-data';
import {
	typographyTypesValues,
	typographyTypesOptions,
	headingTypesValues,
	headingTypesOptions,
} from './config';

const AdvancedTypographyPopup = memo(({ style, dataHelper }) => {
	const [activeTab, setActiveTab] = useState(typographyTypesValues.heading);

	const [headingType, setHeadingType] = useState(headingTypesValues.H1);

	const onChangeActiveTab = useCallback(
		(newValue) => {
			if (newValue === typographyTypesValues.heading) {
				setHeadingType(headingTypesValues.H1);
			}
			setActiveTab(newValue);
		},
		[setActiveTab, setHeadingType]
	);

	const isHeadingTab = activeTab === typographyTypesValues.heading;

	const dataHelperDefaultOptions = useDataHelperDefaultOptionsContext();
	const { defaultOptions: inheritedOptions } = dataHelperDefaultOptions;

	const holder = useMemo(() => {
		if (activeTab === typographyTypesValues.heading) {
			return headingType;
		}

		return activeTab;
	}, [activeTab, headingType]);

	const mergedOptions = _.merge({}, inheritedOptions, {
		styledComponent: style,
	});
	const inheritedStyle = useInheritedTypographyValue(holder, '', {});

	const stylePath = `typography.holders.${holder}`;

	const currentStyle = dataHelper.getStyle(
		`typography.holders.${holder}`,
		{},
		mergedOptions
	);

	const mergedStyle = _.merge({}, inheritedStyle, currentStyle);

	const onChange = (newValue) => {
		dataHelper.setStyle(stylePath, newValue, mergedOptions);
	};

	const onReset = (path) => {
		const mergedPath = `${stylePath}.${path}`;
		dataHelper.setStyle(mergedPath, null, {
			...mergedOptions,
			unset: true,
		});
	};

	return (
		<>
			<GutentagSelectControl
				label={__('Editing', 'kubio')}
				options={typographyTypesOptions}
				value={activeTab}
				onChange={onChangeActiveTab}
			/>
			{isHeadingTab && (
				<ToggleGroup
					label={__('Heading type', 'kubio')}
					options={headingTypesOptions}
					value={headingType}
					onChange={setHeadingType}
				/>
			)}
			<TypographyControl
				withColor={false}
				value={mergedStyle}
				onChange={onChange}
				onReset={onReset}
			/>
		</>
	);
});

export { AdvancedTypographyPopup };
