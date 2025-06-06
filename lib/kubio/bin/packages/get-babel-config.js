module.exports = (environment = '', file) => {
	/*
	 * Specific options to be passed using the caller config option:
	 * https://babeljs.io/docs/en/options#caller
	 *
	 * The caller options can only be 'boolean', 'string', or 'number' by design:
	 * https://github.com/babel/babel/blob/bd0c62dc0c30cf16a4d4ef0ddf21d386f673815c/packages/babel-core/src/config/validation/option-assertions.js#L122
	 */
	const callerOpts = {
		caller: {
			name: `WP_BUILD_${environment.toUpperCase()}`,
		},
	};
	switch (environment) {
		case 'main':
			// to be merged as a presetEnv option
			callerOpts.caller.modules = 'commonjs';
			break;
		case 'module':
			// to be merged as a presetEnv option
			callerOpts.caller.modules = false;
			// to be merged as a pluginTransformRuntime option
			callerOpts.caller.useESModules = true;
			break;
		default:
			// preventing measure, this shouldn't happen ever
			delete callerOpts.caller;
	}

	// Sourcemaps options
	const sourceMapsOpts = {
		sourceMaps: true,
		sourceFileName: file,
	};

	return {
		...callerOpts,
		...sourceMapsOpts,
	};
};
