module.exports = (api) => {
	api.cache(true);

	return {
		presets: ['@wordpress/babel-preset-default'],
		plugins: [
			'@babel/plugin-proposal-optional-chaining',
			'@babel/plugin-proposal-class-properties',
			'@emotion/babel-plugin',
			'babel-plugin-inline-json-import',
		],
		compact: true,
	};
};
