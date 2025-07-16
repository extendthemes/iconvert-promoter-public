/**
 * WordPress dependencies
 */
import { useSlotHasFills } from '@kubio/core';
import { createSlotFill } from '@wordpress/components';

const slotName = '__experimentalMainDashboardButton';

const { Fill, Slot: MainDashboardButtonSlot } = createSlotFill(slotName);

const MainDashboardButton = Fill;

const Slot = ({ children }) => {
	const hasFills = useSlotHasFills(slotName);

	if (!hasFills) {
		return children;
	}

	return <MainDashboardButtonSlot bubblesVirtually />;
};

MainDashboardButton.Slot = Slot;

export default MainDashboardButton;
