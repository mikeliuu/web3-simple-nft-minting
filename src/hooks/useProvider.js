import { useEffect } from "react";
import { ethers } from "ethers";
import WalletConnectProvider from "@walletconnect/web3-provider";

import {
	PROVIDER_TYPE,
	CHAIN_NETWORK,
	POLYGON_CHAIN_ID,
} from "../shared/constants";

const isDevelopment = process.env.NODE_ENV === "development";

const polygonMainnetRpc = {
	[POLYGON_CHAIN_ID.MAINNET]: CHAIN_NETWORK.POLYGON.MAINNET.rpcUrls[0],
};

const polygonTestnetRpc = {
	[POLYGON_CHAIN_ID.TESTNET]: CHAIN_NETWORK.POLYGON.TESTNET.rpcUrls[0],
};

export const useProvider = (type = PROVIDER_TYPE.METAMASK) => {
	const walletconnectStorage = JSON.parse(
		window.localStorage.getItem("walletconnect")
	);

	const isInjectedWeb3 = typeof window.ethereum !== "undefined";

	const isMetaMask = window?.ethereum?.isMetaMask || false;

	const walletConnectProvider = new WalletConnectProvider({
		rpc: isDevelopment ? polygonTestnetRpc : polygonMainnetRpc,
		chainId: [
			isDevelopment ? POLYGON_CHAIN_ID.TESTNET : POLYGON_CHAIN_ID.MAINNET,
		],
		infuraId: process.env.REACT_APP_INFURA_ID,
	});

	const isWalletConnect =
		walletconnectStorage?.connected || PROVIDER_TYPE.WALLET_CONNECT === type;

	const providerType = isWalletConnect
		? walletConnectProvider
		: window.ethereum;

	useEffect(() => {
		initPorvider();
	}, []);

	useEffect(() => {
		initPorvider();
	}, [type]);

	const initPorvider = async () => {
		try {
			const provider = new ethers.providers.Web3Provider(providerType);

			window.provider = provider;
		} catch (err) {
			console.log("initPorvider", { err });
		}
	};

	const connect = async () => {
		let address;

		if (isWalletConnect) {
			const wcAccounts = await walletConnectProvider.enable();

			const res = await walletConnectProvider.request("eth_requestAccounts");

			console.log({ res });

			await walletConnectProvider.request({
				method: "wallet_addEthereumChain",
				params: [
					isDevelopment
						? CHAIN_NETWORK.POLYGON.TESTNET
						: CHAIN_NETWORK.POLYGON.MAINNET,
				],
			});

			address = wcAccounts;
		} else {
			// metamask
			await window.provider.send("eth_requestAccounts", []);

			await window.provider.send("wallet_addEthereumChain", [
				isDevelopment
					? CHAIN_NETWORK.POLYGON.TESTNET
					: CHAIN_NETWORK.POLYGON.MAINNET,
			]);

			const addresses = await getAccounts();

			address = addresses;
		}

		return address;
	};

	const disconnectWalletConnect = async () => {
		await walletConnectProvider.disconnect();

		window.location.reload();
	};

	const getAccounts = async () => {
		return (
			walletconnectStorage?.accounts ||
			(await window.provider.send("eth_accounts", []))
		);
	};

	const getNetwork = async () => {
		return await window.provider.getNetwork();
	};

	return {
		isInjectedWeb3,
		isMetaMask,
		isWalletConnect,
		connect,
		disconnectWalletConnect,
		getAccounts,
		getNetwork,
	};
};
