import _ from 'lodash';

const arrayPropertyFilter = (list, name) => {
	const collections = [];
	_.each(list, (item) => {
		_.each(_.get(item, name, []), (collection) => {
			collections.push({
				text: collection,
				value: collection,
			});
		});
	});

	return _.uniqBy(collections, 'value');
};

const propertyFilter = (list, name) => {
	return _.uniqBy(
		_.map(list, (item) => {
			return { text: item[name], value: item[name] };
		}),
		'value'
	);
};
const ContentFieldsFilters = {
	computed: {
		categoryFilters() {
			return propertyFilter(this.sections, 'category');
		},

		typeFilters() {
			return propertyFilter(this.sections, 'type');
		},

		componentFilters() {
			return propertyFilter(this.sections, 'component');
		},

		siteTemplateFilters() {
			return propertyFilter(this.sections, 'template');
		},

		collectionFilters() {
			return arrayPropertyFilter(this.sections, 'collections');
		},

		templateFilters() {
			return arrayPropertyFilter(this.sections, 'templates');
		},

		pageFilters() {
			return arrayPropertyFilter(this.sections, 'pages');
		},
	},
};

export { ContentFieldsFilters };
