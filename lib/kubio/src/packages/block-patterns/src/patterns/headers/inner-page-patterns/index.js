import _ from 'lodash';
import innerHeader1 from './inner-header-1';
import innerHeader2 from './inner-header-2';
import innerHeader3 from './inner-header-3';
import innerHeader4 from './inner-header-4';
import innerHeader5 from './inner-header-5';
import { ContentMetas as Metas } from '@kubio/admin-panel';
const commonProperties = {
	isPublic: true,
	component: 'kubio/header',
	isGutentagPattern: true,
	category: 'Inner Headers',
	type: 'template',
	collections: ['aaa'],
	meta: [Metas.IS_FREE],
	filters: {
		onlyInner: true,
	},
	fromColibri: true,
};

let innerHeaders = [
	innerHeader1,
	innerHeader2,
	innerHeader3,
	innerHeader4,
	innerHeader5,
];
innerHeaders = innerHeaders.map((header) => {
	return _.merge({}, commonProperties, header);
});

export { innerHeaders };
