import { MenuItemOptions } from '@kubio/controls';
import { generateItemInitialData } from '@kubio/menu-data';
import { Button, Popover } from '@wordpress/components';
import { useRef, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

const AddItem = ({ addItem }) => {
	const [isPopoverVisible, setPopoverVisibity] = useState(false);

	const [itemInitialData, setItemInitialData] = useState(
		generateItemInitialData()
	);
	const containerRef = useRef(null);

	const onPopoverClose = () => {
		setPopoverVisibity(false);
	};

	const itemOptionsChanged = (nextValue) => {
		addItem(nextValue);
		setPopoverVisibity(false);
		setItemInitialData(generateItemInitialData());
	};

	return (
		<div ref={containerRef}>
			<Button
				onClick={() => setPopoverVisibity(true)}
				className={'kubio-button-100'}
				isPrimary
			>
				{__('Add menu item', 'kubio')}
			</Button>
			{isPopoverVisible && (
				<Popover
					position={'middle left'}
					className={`kubio-options-popover`}
					onClose={onPopoverClose}
					anchorRef={containerRef.current}
					offset={6}
				>
					<MenuItemOptions
						item={itemInitialData}
						isAdd={true}
						onChange={itemOptionsChanged}
						afterUpdateClick={() => setPopoverVisibity(false)}
						updateLabel={__('Add item', 'kubio')}
					/>
				</Popover>
			)}
		</div>
	);
};

export { AddItem };
