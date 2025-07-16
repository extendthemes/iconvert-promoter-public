import { Step1Content, Step2Content } from './modal-content';

const STEPS_VALUES = {
	STEP_1: 'step1',
	STEP_2: 'step2',
};

const COMPONENTS_BY_STEP = {
	[ STEPS_VALUES.STEP_1 ]: Step1Content,
	[ STEPS_VALUES.STEP_2 ]: Step2Content,
};

const APPLY_TEMPLATE_ON_VALUES = {
	ALL_PAGES: 'allPages',
	THIS_PAGE: 'thisPage',
};

export { STEPS_VALUES, COMPONENTS_BY_STEP, APPLY_TEMPLATE_ON_VALUES };
