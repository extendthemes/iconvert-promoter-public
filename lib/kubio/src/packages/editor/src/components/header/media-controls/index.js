import { Button } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { desktop, mobile, tablet } from '@wordpress/icons';

import { store as blockEditorStore } from '@wordpress/block-editor';
import { getPreviewElementByModelId } from '@kubio/utils';
import { useBlocksOwnerDocument } from '@kubio/editor-data';
import { useEffect, useState } from '@wordpress/element';

const devices = [
	{
		title: __('Desktop', 'kubio'),
		name: 'Desktop',
		icon: desktop,
	},
	{
		title: __('Tablet', 'kubio'),
		name: 'Tablet',
		icon: tablet,
	},

	{
		title: __('Mobile', 'kubio'),
		name: 'Mobile',
		icon: mobile,
	},
];

const MediaControls = ({ deviceType, setDeviceType }) => {
	const getSelectedBlockClientId = useSelect((select) => {
		return () => {
			const { getSelectedBlockClientIds } = select(blockEditorStore);
			const clientIds = getSelectedBlockClientIds();			
			return '';
			// we dont scroll to the selected element anymore as the are problems with the inline block with some themes
			// return clientIds.length ? clientIds[0] : '';
		};
	});

	const ownerDocument = useBlocksOwnerDocument();

	const handleSetDevice = (name) => () => {
		setDeviceType(name);
	};

	useEffect(() => {
		const selectedBlock = getPreviewElementByModelId(
			getSelectedBlockClientId(),
			ownerDocument
		);

		if (!selectedBlock || !deviceType) {
			return;
		}

		selectedBlock?.scrollIntoView({
			block: 'center',
			behavior: 'smooth',
		});
	}, [deviceType]);

	return (
		<>
			{devices.map(({ name, title, icon }) => (
				<Button
					key={name}
					icon={icon}
					isPressed={name === deviceType}
					label={title}
					onClick={handleSetDevice(name)}
				/>
			))}
		</>
	);
};

export { MediaControls };
