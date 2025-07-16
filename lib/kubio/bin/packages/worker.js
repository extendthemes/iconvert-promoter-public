const workerFarm = require('worker-farm');
const kubioEnv = require('./env');

const worker = workerFarm(
	{
		maxCallsPerWorker: process.env.build_maxCallsPerWorker || Infinity,
		maxConcurrentWorkers:
			process.env.build_maxConcurrentWorkers ||
			require('os').cpus().length,
		maxConcurrentCallsPerWorker:
			process.env.build_maxConcurrentCallsPerWorker || 10,
		workerOptions: {
			env: {
				...process.env,
				kubioEnv: JSON.stringify(kubioEnv),
			},
		},
	},
	require.resolve('./build-worker')
);

module.exports = {
	worker,
	workerFarm,
};
