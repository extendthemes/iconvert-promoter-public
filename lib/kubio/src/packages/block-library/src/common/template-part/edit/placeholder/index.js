/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useCallback, useState } from '@wordpress/element';
import { useDispatch } from '@wordpress/data';
import { Placeholder, Dropdown, Button } from '@wordpress/components';
import { blockDefault } from '@wordpress/icons';
import { serialize } from '@wordpress/blocks';
import { store as coreStore } from '@wordpress/core-data';

/**
 * Internal dependencies
 */
import TemplatePartSelection from '../selection';
import PatternsSetup from './patterns-setup';

const PLACEHOLDER_STEPS = {
	initial: 1,
	patterns: 2,
};

export default function TemplatePartPlaceholder({
	area,
	clientId,
	setAttributes,
	blockArea = undefined,
}) {
	const { saveEntityRecord } = useDispatch(coreStore);
	const [step, setStep] = useState(PLACEHOLDER_STEPS.initial);

	const onCreate = useCallback(
		async (startingBlocks = []) => {
			const title = __('Untitled Template Part', 'kubio');
			// If we have `area` set from block attributes, means an exposed
			// block variation was inserted. So add this prop to the template
			// part entity on creation. Afterwards remove `area` value from
			// block attributes.
			const record = {
				title,
				slug: 'template-part',
				content: serialize(startingBlocks),
				// `area` is filterable on the server and defaults to `UNCATEGORIZED`
				// if provided value is not allowed.
				area: blockArea,
			};
			const templatePart = await saveEntityRecord(
				'postType',
				'wp_template_part',
				record
			);
			setAttributes({
				slug: templatePart.slug,
				theme: templatePart.theme,
				area: blockArea,
			});
		},
		[setAttributes, blockArea]
	);

	return (
		<>
			{step === PLACEHOLDER_STEPS.initial && (
				<Placeholder
					icon={blockDefault}
					label={__('Template Part', 'kubio')}
					instructions={__(
						'Create a new template part or pick an existing one from the list.',
						'kubio'
					)}
				>
					<Dropdown
						contentClassName="wp-block-template-part__placeholder-preview-dropdown-content"
						position="bottom right left"
						renderToggle={({ isOpen, onToggle }) => (
							<>
								<Button
									isPrimary
									onClick={onToggle}
									aria-expanded={isOpen}
								>
									{__('Choose existing', 'kubio')}
								</Button>
								<Button
									isTertiary
									onClick={() =>
										setStep(PLACEHOLDER_STEPS.patterns)
									}
								>
									{__('New template part', 'kubio')}
								</Button>
							</>
						)}
						renderContent={({ onClose }) => (
							<TemplatePartSelection
								setAttributes={setAttributes}
								onClose={onClose}
								blockArea={blockArea}
							/>
						)}
					/>
				</Placeholder>
			)}
			{step === PLACEHOLDER_STEPS.patterns && (
				<PatternsSetup
					area={blockArea}
					onCreate={onCreate}
					clientId={clientId}
				/>
			)}
		</>
	);
}
