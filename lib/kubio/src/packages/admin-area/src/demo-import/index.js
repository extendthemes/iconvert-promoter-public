import { addUIEvents } from './ui';
import { setDemosData } from './global';

const initDemoImport = (data) => {
	setDemosData(data);
	addUIEvents();
};

export { initDemoImport };
