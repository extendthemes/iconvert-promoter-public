import { TemplateWizard } from '@kubio/controls';
import { ProItem } from '@kubio/pro';
import { Button } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

function PostTemplateActions({ onNewTemplate }) {
	const [showWizard, setShowWizard] = useState(false);

	return (
		<>
			<div className="edit-post-template__actions">
				<ProItem
					tag={Button}
					isPrimary
					onClick={() => setShowWizard(true)}
					urlArgs={{ source: 'template', content: 'create-new' }}
				>
					{__('Create new template', 'kubio')}
				</ProItem>
				{showWizard && (
					<TemplateWizard
						onNewTemplate={onNewTemplate}
						onClose={() => {
							setShowWizard(false);
						}}
					/>
				)}
			</div>
		</>
	);
}

export default PostTemplateActions;
