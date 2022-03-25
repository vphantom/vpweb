import { terser } from 'rollup-plugin-terser';

export default [
	{
		input: 'js/test-size.js',
		output: {
			file: 'dist/test-size.min.js',
			format: 'iife',
			sourcemap: true,
		},
		plugins: [terser()],
	},
	{
		input: 'js/daterange-standalone.js',
		output: {
			file: 'dist/daterange.min.js',
			format: 'iife',
			sourcemap: true,
		},
		plugins: [terser()],
	},
	{
		input: 'js/promeneur-standalone.js',
		output: {
			file: 'dist/promeneur.min.js',
			format: 'iife',
			sourcemap: true,
		},
		plugins: [terser()],
	},
];
