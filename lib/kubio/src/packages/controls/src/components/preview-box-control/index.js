import { Button } from '@wordpress/components';
import { moreHorizontal } from '@wordpress/icons';
import {
	useState,
	useRef,
	forwardRef,
	useImperativeHandle,
} from '@wordpress/element';
import classnames from 'classnames';
import { KubioPopup } from '../kubio-popup';
import { useUIVersion } from '@kubio/core-hooks';

function PreviewBoxControl_(
	{
		popoverContent,
		previewContent,
		label,
		popoverPosition: initialPosition = null,
	},
	ref
) {
	const { uiVersion } = useUIVersion();

	let popoverPosition = initialPosition;

	if (initialPosition === null) {
		if (uiVersion === 2) {
			popoverPosition = 'bottom right';
		} else {
			popoverPosition = 'bottom left';
		}
	}

	const [isOpened, setIsOpened] = useState(false);
	const openButton = useRef();
	const contentRef = useRef();
	const popupRef = useRef();
	useImperativeHandle(ref, () => ({
		close: () => {
			popupRef?.current?.close();
		},
	}));

	const onPreviewClicked = (e) => {
		e.stopPropagation();
		popupRef?.current?.toggle(!isOpened);
	};

	return (
		<>
			<div className={'kubio-preview-box-control__container'}>
				<Button
					ref={openButton}
					icon={moreHorizontal}
					className={classnames(
						['kubio-preview-box-control__button'],
						{
							opened: isOpened,
						}
					)}
				/>

				<KubioPopup
					ref={popupRef}
					className={'kubio-preview-box-control__popover'}
					position={popoverPosition}
					buttonRef={openButton}
					anchorRef={openButton}
					onOpen={() => setIsOpened(true)}
					onClose={() => setIsOpened(false)}
				>
					{popoverContent}
				</KubioPopup>

				<div
					ref={contentRef}
					className="kubio-preview-box-control__content"
					onMouseDown={onPreviewClicked}
					tabIndex={0}
					onKeyUp={onPreviewClicked}
					role={'button'}
				>
					{previewContent}
					{label && (
						<div className={'kubio-preview-box-control__label'}>
							{label}
						</div>
					)}
				</div>
			</div>
		</>
	);
}
const PreviewBoxControl = forwardRef(PreviewBoxControl_);
export { PreviewBoxControl };
