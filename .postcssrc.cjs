module.exports = {
	syntax: 'postcss-scss',
	map: {
		inline: false,
		sourcesContent: true,
	},
	plugins: [
		require('postcss-import')({
			path: ['./scss/'],
		}),
		require('postcss-advanced-variables')({}),
		require('cssnano')({
			preset: 'default',
		}),
		require('postcss-combine-media-query')({}),
		require('postcss-assets')({
			loadPaths: ['./scss/'],
		}),
	],
};
