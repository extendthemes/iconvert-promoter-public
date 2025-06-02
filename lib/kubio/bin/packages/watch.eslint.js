const { escapeRegExp } = require( 'lodash' );

const lint = {
	root: true,
	plugins: [ 'import' ],
	globals: {
		wp: 'off',
		jQuery: true,
		KUBIO_ENV: true,
	},
	settings: {
		jsdoc: {
			mode: 'typescript',
		},
	},
	rules: {
		'no-unused-vars': 'off',
		'no-console': 'off',
		'prettier/prettier': 'off',
		'jsx-a11y/no-static-element-interactions': 'off',
		'jsx-a11y/click-events-have-key-events': 'off',
		'no-restricted-syntax': [
			'error',
			// NOTE: We can't include the forward slash in our regex or
			// we'll get a `SyntaxError` (Invalid regular expression: \ at end of pattern)
			// here. That's why we use \\u002F in the regexes below.
			{
				selector:
					'ImportDeclaration[source.value=/^@wordpress\\u002F.+\\u002F/]',
				message:
					'Path access on WordPress dependencies is not allowed.',
			},
			{
				selector:
					'ImportDeclaration[source.value=/^@kubio\\u002F.+\\u002F/]',
				message: 'Path access on Gutentag dependencies is not allowed.',
			},
			{
				selector:
					'ImportDeclaration[source.value=/^react-spring(?!\\u002Fweb.cjs)/]',
				message:
					'The react-spring dependency must specify CommonJS bundle: react-spring/web.cjs',
			},

			{
				selector:
					'ImportDeclaration[source.value="redux"] Identifier.imported[name="combineReducers"]',
				message: 'Use `combineReducers` from `@wordpress/data`',
			},
			{
				selector:
					'ImportDeclaration[source.value="lodash"] Identifier.imported[name="memoize"]',
				message: 'Use memize instead of Lodash’s memoize',
			},
			{
				selector:
					'CallExpression[callee.object.name="page"][callee.property.name="waitFor"]',
				message: 'Prefer page.waitForSelector instead.',
			},
			{
				selector: 'JSXAttribute[name.name="id"][value.type="Literal"]',
				message:
					'Do not use string literals for IDs; use withInstanceId instead.',
			},
			{
				// Discourage the usage of `Math.random()` as it's a code smell
				// for UUID generation, for which we already have a higher-order
				// component: `withInstanceId`.
				selector:
					'CallExpression[callee.object.name="Math"][callee.property.name="random"]',
				message:
					'Do not use Math.random() to generate unique IDs; use withInstanceId instead. (If you’re not generating unique IDs: ignore this message.)',
			},
			{
				selector:
					'CallExpression[callee.name="withDispatch"] > :function > BlockStatement > :not(VariableDeclaration,ReturnStatement)',
				message:
					'withDispatch must return an object with consistent keys. Avoid performing logic in `mapDispatchToProps`.',
			},
			{
				selector:
					'LogicalExpression[operator="&&"][left.property.name="length"][right.type="JSXElement"]',
				message:
					'Avoid truthy checks on length property rendering, as zero length is rendered verbatim.',
			},
		],
	},
	overrides: [],
};

module.exports = lint;
