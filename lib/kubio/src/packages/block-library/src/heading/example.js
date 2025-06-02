import metadata from './block.json';

const example = {
	content: metadata.attributes.content.default,
	kubio: {
		props: {
			level: metadata?.kubio?.props?.level || 2,
		},
	},
};

export { example };
