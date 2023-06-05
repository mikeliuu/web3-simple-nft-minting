const NETWORK = {
	POLYGON: {
		MAINNET: {
			chainId: 137,
			url: "https://rpc-mainnet.matic.network/",
			blockExplorerUrl: "https://polygonscan.com/",
		},
		TESTNET: {
			chainId: 80001,
			// url: "https://rpc-mumbai.maticvigil.com",
			url: "https://matic-mumbai.chainstacklabs.com",
			blockExplorerUrl: "https://mumbai.polygonscan.com/",
		},
	},
};
module.exports = {
	NETWORK,
};
