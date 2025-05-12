module.exports = {
	map: {
		inline: false,
		sourcesContent: true,
	},
	plugins: [
		require('postcss-import')({
			path: ['./css/'],
		}),
		require('postcss-lightningcss')({
			minify: true,
			drafts: {
				nesting: true,
				custommedia: true,
			},
			minifyOptions: {
				restructure: true,
			},
		}),
	],
};
