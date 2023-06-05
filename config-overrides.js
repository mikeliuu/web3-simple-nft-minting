const webpack = require("webpack");

module.exports = function override(config, env) {
	// fix react-scripts issue with @walletconnect/web3-provider
	config.resolve.fallback = {
		util: require.resolve("util/"),
		url: require.resolve("url"),
		fs: require.resolve("fs"),
		buffer: require.resolve("buffer"),
		assert: require.resolve("assert"),
		crypto: require.resolve("crypto-browserify"),
		http: require.resolve("stream-http"),
		https: require.resolve("https-browserify"),
		os: require.resolve("os-browserify/browser"),
		stream: require.resolve("stream-browserify"),
	};

	config.plugins.push(
		new webpack.ProvidePlugin({
			process: "process/browser",
			Buffer: ["buffer", "Buffer"],
		})
	);

	return config;
};
