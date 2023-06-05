import { utils } from "ethers";

export const PROVIDER_TYPE = {
	METAMASK: "METAMASK",
	WALLET_CONNECT: "WALLET_CONNECT",
};

export const SYMBOL = {
	ETH: "ETH",
	MATIC: "MATIC",
};

export const POLYGON_CHAIN_ID = {
	MAINNET: 137,
	TESTNET: 80001,
};

export const CHAIN_NETWORK = {
	POLYGON: {
		MAINNET: {
			chainId: utils.hexValue(POLYGON_CHAIN_ID.MAINNET),
			rpcUrls: ["https://rpc-mainnet.matic.network/"],
			chainName: "Polygon Mainnet",
			nativeCurrency: {
				name: "MATIC",
				symbol: "MATIC", // 2-6 characters long
				decimals: 18,
			},
			blockExplorerUrls: ["https://polygonscan.com/"],
		},
		TESTNET: {
			chainId: utils.hexValue(POLYGON_CHAIN_ID.TESTNET),
			rpcUrls: [
				"https://matic-mumbai.chainstacklabs.com",
				"https://rpc-mumbai.maticvigil.com",
			],
			chainName: "Polygon Testnet Mumbai",
			nativeCurrency: {
				name: "MATIC",
				symbol: "MATIC", // 2-6 characters long
				decimals: 18,
			},
			blockExplorerUrls: ["https://mumbai.polygonscan.com/"],
		},
	},
};
