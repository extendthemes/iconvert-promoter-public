import { Popover } from '@wordpress/components';
import { useEffect, useRef, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import classnames from 'classnames';
import _ from 'lodash';
import { TemplateLockControls } from '../template-lock-controls';
import { TemplateLockModal } from '../template-lock-modal';

const TemplateLockPopup = (props) => {
	const {
		instanceId,
		position,
		isHovered,
		onMouseOut = _.noop,
		onMouseOver = _.noop,
		onDragEnter = _.noop,
		onDragLeave = _.noop,
		onClose = _.noop,
		setIsWizardShown,
		isWizardShown,
		...rest
	} = props;

	const ref = useRef();
	const outerRef = useRef();
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	useEffect(() => {
		if (outerRef.current) {
			const node = outerRef.current;
			node.addEventListener('mouseover', onMouseOver, true);
			node.addEventListener('mouseout', onMouseOut, true);

			node.addEventListener('dragenter', onDragEnter, true);
			node.addEventListener('dragleave', onDragLeave, true);
		}
		return () => {
			if (!outerRef.current) {
				return;
			}
			const node = outerRef.current;
			node.removeEventListener('mouseover', onMouseOver, true);
			node.removeEventListener('mouseout', onMouseOut, true);

			node.removeEventListener('dragenter', onMouseOver, true);
			node.removeEventListener('dragleave', onMouseOut, true);
		};
	}, [outerRef.current, onDragLeave, onDragEnter, onMouseOver, onMouseOut]);

	return (
		<div className="kubio-template-lock-popup__container">
			<div ref={ref} className="kubio-template-lock-popup" />
			<Popover
				position={position}
				className={classnames(
					'kubio-options-popover kubio-template-controls-popover kubio-template-controls-canvas-popover',
					{
						'kubio-template-controls-canvas-popover--hovered': isHovered,
					},
					`${instanceId}-popover`
				)}
				anchorRef={ref.current}
			>
				<div ref={outerRef} className="template-lock-modal__outer">
					{isMounted && (
						<TemplateLockModal
							title={__('Choose editing mode', 'kubio')}
						>
							<TemplateLockControls
								isWizardShown={isWizardShown}
								setIsWizardShown={setIsWizardShown}
								onClose={onClose}
								{...rest}
							/>
						</TemplateLockModal>
					)}
				</div>
			</Popover>
		</div>
	);
};

export { TemplateLockPopup };
