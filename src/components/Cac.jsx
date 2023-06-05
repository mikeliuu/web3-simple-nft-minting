import React, { useState, useEffect } from "react";

import { utils } from "ethers";

import Big from "big.js";

import { isBrowser, isMobile } from "react-device-detect";

import { Board, ProgressBar, Chip, Label, Bold } from "./display";

import { TextInput, Switch } from "./input";

import { Button, EditActions } from "./feedback";

import { getNetworkDetail, getDisplayAddress } from "../utils";

import { useToggle, useContract, useProvider } from "../hooks";

import { PROVIDER_TYPE } from "../shared/constants";

import cac from "../abis/CAC.json";

const contractABI = cac.abi;

// const contractAddress = "0xbf7aBE0B53b3331e19D669dF73d8AE8870C126F6";
const contractAddress = "0x2967a1534C8d117dBb2F7E6dbBEf7763F2C3FEb5";

const initialNetwork = {
	name: "",
	symbol: "",
};

const initialToken = {
	totalSupply: 0,
	maxSupply: 0,
	mintPrice: 0,
	maxMint: 0,
	maxBalance: 0,
	ownerBalance: 0,
	isSaleActive: false,
	isRevealed: false,
	isContractOwner: false,
};

const initialContractOwner = {
	mintPrice: 0,
	maxMint: 0,
	maxBalance: 0,
	contractBalance: 0,
	isSaleActive: false,
	isRevealed: false,
};

const initialMintQty = 1;

export default function MaticNft() {
	const [loading, toggleLoading] = useToggle();

	const [ownerLoading, toggleOwnerLoading] = useToggle();

	const [withdrawLoading, toggleWithdrawLoading] = useToggle();

	const [providerType, setProviderType] = useState(PROVIDER_TYPE.METAMASK);

	const [isConnect, setIsConnect] = useState(false);

	const [network, setNetwork] = useState(initialNetwork);

	const [account, setAccount] = useState();

	const [token, setToken] = useState(initialToken);

	const [mintQty, setMintQty] = useState(initialMintQty);

	// contract owner state
	const [contractOwner, setContractOwner] = useState(initialContractOwner);

	const mintLeft = token.maxBalance - token.ownerBalance;

	const isAllSupplied = token?.totalSupply === token?.maxSupply;

	const {
		isInjectedWeb3,
		isMetaMask,
		isWalletConnect,
		connect,
		disconnectWalletConnect,
		getAccounts,
		getNetwork,
	} = useProvider(providerType);

	const {
		mint,
		withdraw,
		flipSaleActive,
		flipRevealed,
		getTotalSupply,
		getMaxSupply,
		getMintPrice,
		getMaxMint,
		getMaxBalance,
		getSaleActive,
		getRevealed,
		isContractOwner,
		getOwnerBalance,
		getContractBalance,
		setMintPrice,
		setMaxBalance,
		setMaxMint,
	} = useContract(contractAddress, contractABI, window?.provider?.getSigner());

	const checkConnection = async () => {
		try {
			const [currentAddress] = await getAccounts();

			// MetaMask currently supports single account
			setAccount(currentAddress);

			// return true if account exists
			return !!currentAddress;
		} catch (err) {
			console.log("checkConnection", { err });

			return false;
		}
	};

	const handleInitDetect = async () => {
		await checkConnection().then((connected) => {
			if (connected && account) getTokenInfo();
		});

		await handleGetNetwork();
	};

	const getTokenInfo = async () => {
		try {
			// wait for actions on chain
			const totalSupply = await getTotalSupply();
			const maxSupply = await getMaxSupply();
			const mintPrice = await getMintPrice();
			const maxMint = await getMaxMint();
			const maxBalance = await getMaxBalance();
			const isSaleActive = await getSaleActive();
			const isRevealed = await getRevealed();
			const _isContractOwner = await isContractOwner();
			const ownerBalance = (await getOwnerBalance()) || 0;

			const stringOwnerBalance = new Big(ownerBalance).toPrecision(3);

			setToken((state) => ({
				...state,
				totalSupply: totalSupply.toNumber(),
				maxSupply: maxSupply.toNumber(),
				mintPrice: utils.formatEther(mintPrice),
				maxMint: maxMint.toNumber(),
				maxBalance: maxBalance.toNumber(),
				ownerBalance: parseInt(stringOwnerBalance).toFixed(0),
				isSaleActive,
				isRevealed,
				isContractOwner: _isContractOwner,
			}));

			if (_isContractOwner) {
				const contractBalance = await getContractBalance();

				setContractOwner((state) => ({
					...state,
					contractBalance: utils.formatUnits(contractBalance),
				}));
			}
		} catch (err) {
			console.log("getTokenInfo", { err });
		}
	};

	const toggleSaleActive = () => {
		setContractOwner((state) => ({
			...state,
			isSaleActive: !state.isSaleActive,
		}));
	};

	const toggleRevealed = () => {
		setContractOwner((state) => ({
			...state,
			isRevealed: !state.isRevealed,
		}));
	};

	const handleMint = async () => {
		try {
			toggleLoading();

			// action for a transaction on chain
			await mint(mintQty, token?.mintPrice, getTokenInfo);

			setMintQty(initialMintQty);

			toggleLoading();
		} catch (err) {
			console.log({ err });
			toggleLoading();
		}
	};

	const handleSaleActive = async () => {
		try {
			toggleOwnerLoading();

			toggleSaleActive();

			// action for a transaction on chain
			await flipSaleActive(getTokenInfo);

			toggleOwnerLoading();
		} catch (err) {
			console.log({ err });
			toggleOwnerLoading();

			toggleSaleActive();
		}
	};

	const handleRevealActive = async () => {
		try {
			toggleOwnerLoading();

			toggleRevealed();

			// action for a transaction on chain
			await flipRevealed(getTokenInfo);

			toggleOwnerLoading();
		} catch (err) {
			console.log({ err });

			toggleOwnerLoading();

			toggleRevealed();
		}
	};

	const handleWithdraw = async () => {
		try {
			toggleWithdrawLoading();

			// action for a transaction on chain
			await withdraw(account, getTokenInfo);

			toggleWithdrawLoading();
		} catch (err) {
			console.log({ err });
			toggleWithdrawLoading();
		}
	};

	const handleAccountsChanged = (accounts) => {
		if (!accounts.length) {
			return handleDisconnect();
		}

		setAccount(accounts[0]);
	};

	const handleMintQtyChange = (event) => {
		const { value } = event.target;

		if (value < initialMintQty) return;

		if (value > mintLeft) return;

		setMintQty(value);
	};

	const handleOwnerChange = (event) => {
		const { name, value } = event.target;

		setContractOwner((state) => ({
			...state,
			[name]: value,
		}));
	};

	const handleResetOwnerInput = (name, value) => {
		setContractOwner((state) => ({
			...state,
			[name]: value,
		}));
	};

	const handleOwnerInputSubmit = async (name) => {
		try {
			toggleOwnerLoading();

			switch (name) {
				case "mintPrice":
					await setMintPrice(contractOwner[name], getTokenInfo);
					break;
				case "maxBalance":
					await setMaxBalance(contractOwner[name], getTokenInfo);

					break;
				case "maxMint":
					await setMaxMint(contractOwner[name], getTokenInfo);

					break;
				default:
					break;
			}

			toggleOwnerLoading();
		} catch (err) {
			console.log({ err });
			toggleOwnerLoading();
		}
	};

	const handleGetNetwork = async () => {
		const currentNetwork = await getNetwork();

		if (currentNetwork) {
			setNetwork((state) => ({
				...state,
				name: getNetworkDetail(currentNetwork).name,
				symbol: getNetworkDetail(currentNetwork).symbol,
			}));
		}
	};

	const connectWallet = async () => {
		try {
			toggleLoading();

			setIsConnect(false);

			await connect()
				.then((currentAccounts) => {
					setAccount(currentAccounts[0]);
				})
				.finally(() => toggleLoading());
		} catch (err) {
			console.log("connectWallet", { err });
		}
	};

	const handleClickConnect = (type) => {
		setIsConnect(true);
		setProviderType(type);
	};

	const handleDisconnect = () => {
		setAccount("");
		setMintQty(initialMintQty);
		setToken(initialToken);
		setContractOwner(initialContractOwner);
		setProviderType(null);

		window.localStorage.clear();
	};

	useEffect(() => {
		handleInitDetect();

		if (isInjectedWeb3 && window.provider) {
			window.ethereum.on("accountsChanged", handleAccountsChanged);

			window.ethereum.on("chainChanged", (_chainId) =>
				window.location.reload()
			);
		}
	}, [isInjectedWeb3, window.provider]);

	useEffect(() => {
		if (account) handleInitDetect();
	}, [account]);

	useEffect(() => {
		setContractOwner((state) => ({
			...state,
			mintPrice: token.mintPrice,
			maxBalance: token.maxBalance,
			maxMint: token.maxMint,
			isSaleActive: token.isSaleActive,
			isRevealed: token.isRevealed,
		}));
	}, [token]);

	useEffect(() => {
		if (isWalletConnect) {
			setProviderType(PROVIDER_TYPE.WALLET_CONNECT);
		}
	}, [isWalletConnect]);

	useEffect(() => {
		if (providerType && isConnect) connectWallet();
	}, [providerType, isConnect]);

	const mintedRatio = (token?.totalSupply / token?.maxSupply) * 100 || 0;

	const isEditingMaxBalance = token?.maxBalance !== contractOwner.maxBalance;
	const isEditingMaxMint = token?.maxMint !== contractOwner.maxMint;
	const isEditingMintPrice = token?.mintPrice !== contractOwner.mintPrice;

	// console.log({ token, contractOwner });

	return (
		<div className="w-full min-h-screen bg-gray-700 flex flex-col justify-center items-center py-8 px-4">
			<h1 className="text-gray-200 font-bold text-2xl text-shadow text-center mb-4">
				Mint Unique NFTs
			</h1>

			{account && (
				<>
					<Board className="flex flex-col py-6 mb-4">
						<div className="grid gap-2">
							<div className="flex flex-wrap w-full">
								<div>
									<Label>Network</Label>

									<div className="flex mb-2">
										<Chip primary>{network.name}</Chip>
									</div>
								</div>

								{isWalletConnect && (
									<div className="ml-auto">
										<Button size="small" onClick={disconnectWalletConnect}>
											Disconnect
										</Button>
									</div>
								)}
							</div>

							<div>
								<Label>Wallet Address</Label>

								<p className="text-white text-md">
									{getDisplayAddress(account)}
								</p>
							</div>

							<div>
								<Label>Amount Minted</Label>

								<p className="text-white text-md">{token.ownerBalance}</p>
							</div>
						</div>
					</Board>
				</>
			)}

			<Board className="flex justify-center items-center flex-col mb-4">
				{token?.isSaleActive && !isAllSupplied && (
					<Chip success className="mb-4">
						live
					</Chip>
				)}

				{token?.isSaleActive && isAllSupplied && (
					<Chip className="mb-4">ended</Chip>
				)}

				<div className="w-full mb-4">
					<ProgressBar className="mb-2" ratio={mintedRatio} />

					<p className="text-sm text-zinc-200 text-center">
						Globally minted:{" "}
						<Bold>
							{token?.totalSupply ?? "?"}/{token?.maxSupply ?? "?"}
						</Bold>
					</p>
				</div>

				{account ? (
					<>
						<div className="mb-4">
							<TextInput
								className="mb-2"
								labelClass="text-center"
								type="number"
								label="Quantity"
								name="mintQty"
								value={mintQty}
								max={token.maxMint}
								onChange={handleMintQtyChange}
								disabled={!token?.isSaleActive || !mintLeft || isAllSupplied}
							/>

							<p className="text-sm text-zinc-200 text-center mb-2">
								How many NFTs to mint?
							</p>

							<p className="text-sm text-zinc-200 text-center mb-2">
								max mint: <Bold>{token.maxMint}</Bold>
							</p>

							<p className="text-sm text-zinc-200 text-center mb-2">
								mint left:{" "}
								<Bold>
									{mintLeft ?? "?"} / {token.maxBalance ?? "?"}
								</Bold>
							</p>

							<p className="text-sm text-zinc-200 text-center">
								Cost:{" "}
								<Bold>
									{token?.mintPrice * mintQty} {network.symbol}
								</Bold>
							</p>
						</div>

						<Button
							loading={loading}
							disabled={!token?.isSaleActive || !mintLeft || isAllSupplied}
							onClick={handleMint}
						>
							Mint
						</Button>
					</>
				) : (
					<>
						<div className="text-white font-medium text-md my-4">
							Connect to the Polygon network
						</div>
						<div className="flex justify-around items-center flex-wrap flex-row">
							{isBrowser && isMetaMask && (
								<Button
									className="mx-2 mb-4 xs:mb-0"
									loading={loading}
									onClick={() => handleClickConnect(PROVIDER_TYPE.METAMASK)}
								>
									Connect
								</Button>
							)}

							<Button
								className="mx-2"
								loading={loading}
								onClick={() => handleClickConnect(PROVIDER_TYPE.WALLET_CONNECT)}
							>
								WalletConnect
							</Button>
						</div>
					</>
				)}

				{account && !!token.ownerBalance && !mintLeft && (
					<p className="mt-6 font-bold text-yellow-500 text-xl text-center">
						You have minted max balance.
					</p>
				)}
			</Board>

			{token?.isContractOwner && (
				<Board className="mb-4">
					<div className="grid gap-3">
						<h2 className="text-2xl font-bold text-zinc-200 text-center mb-2">
							Contract Settings
						</h2>

						<div className="grid grid-flow-col auto-cols-fr">
							<div className="grid-cols-6 flex flex-col items-start justify-start">
								<div className="text-zinc-200">
									<Label>Contract Balance</Label>

									<Bold>
										{contractOwner?.contractBalance} {network.symbol}
									</Bold>
								</div>
							</div>

							<div className="grid-cols-6 flex flex-col items-start justify-start">
								<Label>Withdraw Contract Balance</Label>

								<Button
									className="p-1 w-24 h-10"
									loading={withdrawLoading}
									onClick={handleWithdraw}
									disabled={!!contractOwner.contractBalance || ownerLoading}
								>
									Withdraw
								</Button>
							</div>
						</div>

						<div className="grid grid-flow-col auto-cols-fr">
							<Switch
								className="grid-cols-6"
								id="sale-active"
								label="Sale Active Status"
								checked={contractOwner?.isSaleActive}
								onChange={handleSaleActive}
								disabled={isAllSupplied}
							/>

							<Switch
								className="grid-cols-6"
								id="reveal-active"
								label="Reveal Status"
								checked={contractOwner?.isRevealed}
								onChange={handleRevealActive}
								disabled={!token?.isSaleActive}
							/>
						</div>

						<div className="grid grid-flow-col">
							<div className="grid-cols-6 flex flex-col items-start justify-start">
								<TextInput
									type="number"
									label="Max Balance"
									name="maxBalance"
									value={contractOwner.maxBalance}
									min={token.maxBalance}
									onChange={handleOwnerChange}
									disabled={
										ownerLoading ||
										isEditingMaxMint ||
										isEditingMintPrice ||
										isAllSupplied
									}
								/>

								<EditActions
									className="mt-4"
									isEdit={
										isEditingMaxBalance &&
										(!isEditingMaxMint || !isEditingMintPrice)
									}
									loading={ownerLoading}
									onClose={() =>
										handleResetOwnerInput("maxBalance", token.maxBalance)
									}
									onSubmit={() => handleOwnerInputSubmit("maxBalance")}
								/>
							</div>

							<div className="grid-cols-6 flex flex-col items-start justify-start">
								<TextInput
									type="number"
									label="Max Mint"
									name="maxMint"
									value={contractOwner.maxMint}
									min={token.maxMint}
									onChange={handleOwnerChange}
									disabled={
										ownerLoading ||
										isEditingMaxBalance ||
										isEditingMintPrice ||
										isAllSupplied
									}
								/>

								<EditActions
									className="mt-4"
									isEdit={
										isEditingMaxMint &&
										(!isEditingMaxBalance || !isEditingMintPrice)
									}
									loading={ownerLoading}
									onClose={() =>
										handleResetOwnerInput("maxMint", token.maxMint)
									}
									onSubmit={() => handleOwnerInputSubmit("maxMint")}
								/>
							</div>
						</div>

						<div className="flex flex-col items-start justify-start">
							<TextInput
								type="number"
								label="Mint Price"
								name="mintPrice"
								value={contractOwner.mintPrice}
								min={0}
								onChange={handleOwnerChange}
								disabled={
									ownerLoading ||
									isEditingMaxBalance ||
									isEditingMaxMint ||
									isAllSupplied
								}
							/>

							<EditActions
								className="mt-4"
								isEdit={
									isEditingMintPrice &&
									(!isEditingMaxBalance || !isEditingMaxMint)
								}
								loading={ownerLoading}
								onClose={() =>
									handleResetOwnerInput("mintPrice", token.mintPrice)
								}
								onSubmit={() => handleOwnerInputSubmit("mintPrice")}
							/>
						</div>
					</div>
				</Board>
			)}
		</div>
	);
}
