import { StatesEnum } from './index';

const StatesPresetsEnum = {
	NONE: [ StatesEnum.NORMAL ],
	BASIC: [ StatesEnum.NORMAL, StatesEnum.HOVER ],
	LINK: [ StatesEnum.NORMAL, StatesEnum.HOVER ],
	BUTTON: [ StatesEnum.NORMAL, StatesEnum.HOVER, StatesEnum.FOCUS ],
};

export { StatesPresetsEnum };
