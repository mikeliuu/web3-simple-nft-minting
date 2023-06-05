import { utils } from "ethers";

export const polygon = {
	testnet: {
		chainId: utils.hexValue(80001), // Moonbase Alpha's chainId is 1287, which is 0x507 in hex
		chainName: "Mumbai",
		nativeCurrency: {
			name: "Matic",
			symbol: "MATIC",
			decimals: 18,
		},
		rpcUrls: ["https://matic-mumbai.chainstacklabs.com"],
		blockExplorerUrls: ["https://mumbai.polygonscan.com"],
	},
	mainnet: {
		chainId: utils.hexValue(137), // Moonbase Alpha's chainId is 1287, which is 0x507 in hex
		chainName: "Polygon Mainnet",
		nativeCurrency: {
			name: "Matic",
			symbol: "MATIC",
			decimals: 18,
		},
		rpcUrls: ["https://polygon-rpc.com"],
		blockExplorerUrls: ["https://polygonscan.com"],
	},
};
