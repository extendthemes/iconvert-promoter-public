const path = require('path');
const glob = require('fast-glob');
const _ = require('lodash');

const PACKAGES_DIR = path
	.resolve(__dirname, '../../src/packages')
	.replace(/\\/gim, '/');

const stream = glob.stream([`${PACKAGES_DIR}/*/package.json`], {
	onlyFiles: true,
});

let packageDependencies = {};
const circularPaths = [];

const arraysEqual = (a, b) => {
	if (a === b) return true;
	if (a === null || b === null) return false;
	if (a.length !== b.length) return false;

	const sortedA = [...a].sort();
	const sortedB = [...b].sort();

	for (let i = 0; i < sortedA.length; ++i) {
		if (sortedA[i] !== sortedB[i]) return false;
	}
	return true;
};

const addCircularPath = (parts) => {
	const found = circularPaths.filter((circularPath) =>
		arraysEqual(circularPath, parts)
	);

	if (found.length === 0) {
		circularPaths.push(parts);
	}
};

const checkDependenciesTree = (pack, currentDependency, visited = []) => {
	const depsOfDep = packageDependencies[currentDependency] || [];

	if (visited.indexOf(currentDependency) !== -1) {
		return;
	}

	if (depsOfDep.indexOf(pack) !== -1) {
		addCircularPath([pack, currentDependency].concat(visited));
	} else {
		depsOfDep.forEach((dep) => {
			checkDependenciesTree(pack, dep, visited.concat(currentDependency));
		});
	}
};

const findCircular = (pack) => {
	const packDeps = packageDependencies[pack];
	packDeps.forEach((dep) => checkDependenciesTree(pack, dep));
};

const analizeCircularDeps = () => {
	const packages = Object.keys(packageDependencies);
	packages.forEach((pack) => findCircular(pack));

	console.log(circularPaths);
};

stream
	.on('data', (file) => {
		const { name, dependencies, devDependencies } = require(file);
		const deps = _.uniq(
			Object.keys(dependencies).concat(Object.keys(devDependencies))
		);
		const gutentagDeps = deps.filter((dep) => dep.indexOf('@kubio/') === 0);

		packageDependencies = {
			...packageDependencies,
			[name]: gutentagDeps,
		};
	})
	.on('end', analizeCircularDeps);
