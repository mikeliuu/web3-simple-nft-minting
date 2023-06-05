import { SYMBOL } from "../shared/constants";

const getNetworkDetail = (network) => {
	const getNetworkName = (alterName) =>
		network?.name && network?.name !== "unknown" ? network?.name : alterName;

	const networkDetail = {
		name: "",
		symbol: "",
	};

	switch (network.chainId) {
		case 1:
			networkDetail.name = getNetworkName("ethereum mainnet");
			networkDetail.symbol = SYMBOL.ETH;
			break;

		case 3:
			networkDetail.name = getNetworkName("ropsten");
			networkDetail.symbol = SYMBOL.ETH;
			break;

		case 4:
			networkDetail.name = getNetworkName("rinkeby");
			networkDetail.symbol = SYMBOL.ETH;
			break;

		case 5:
			networkDetail.name = getNetworkName("goerli");
			networkDetail.symbol = SYMBOL.ETH;
			break;

		case 42:
			networkDetail.name = getNetworkName("kovan");
			networkDetail.symbol = SYMBOL.ETH;
			break;

		case 137:
			networkDetail.name = getNetworkName("polygon");
			networkDetail.symbol = SYMBOL.MATIC;
			break;

		case 80001:
			networkDetail.name = getNetworkName("mumbai");
			networkDetail.symbol = SYMBOL.MATIC;
			break;

		case 1337:
		case 31337:
			networkDetail.name = getNetworkName("localhost");
			networkDetail.symbol = SYMBOL.MATIC;
			break;

		default:
			networkDetail.name = "unknown";
			networkDetail.symbol = "";
			break;
	}

	return networkDetail;
};

export default getNetworkDetail;
