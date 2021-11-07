/** @type {import('next').NextConfig} */
module.exports = {
	reactStrictMode: true,
	images: {
		domains: ['interactive-examples.mdn.mozilla.net'],
	},
	async redirects() {
		return [
			{ source: '/backdropClick', destination: '/', permanent: true },
		];
	},
};
