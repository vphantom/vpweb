module.exports = {
	map: {
		inline: false,
		sourcesContent: true,
	},
	plugins: [
		require('postcss-import')({
			path: ['./css/'],
		}),
		require('cssnano')({
			preset: 'default',
		}),
		require('postcss-combine-media-query')({}),
		require('postcss-assets')({
			loadPaths: ['./css/'],
		}),
	],
};
