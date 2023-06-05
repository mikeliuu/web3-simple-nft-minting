import { useMemo, useEffect } from "react";
import { ethers, utils } from "ethers";

export const useContract = (contractAddress, contractABI, signer) => {
	const Contract = useMemo(
		() => new ethers.Contract(contractAddress, contractABI, signer),
		[signer]
	);

	const mint = async (qty, mintPrice, cb) => {
		const tx = await Contract.mint(qty, {
			value: utils.parseEther((mintPrice * qty).toString()),
		});

		await tx.wait().then(() => cb());
	};

	const withdraw = async (to, cb) => {
		const tx = await Contract.withdraw(to);

		await tx.wait().then(() => cb());
	};

	const flipSaleActive = async (cb) => {
		const tx = await Contract.flipSaleActive();

		await tx.wait().then(() => cb());
	};

	const flipRevealed = async (cb) => {
		const tx = await Contract.flipRevealed();

		await tx.wait().then(() => cb());
	};

	const setMaxMint = async (maxMint, cb) => {
		const tx = await Contract.setMaxMint(maxMint);

		await tx.wait().then(() => cb());
	};

	const setMaxBalance = async (maxBalance, cb) => {
		const tx = await Contract.setMaxBalance(maxBalance);

		await tx.wait().then(() => cb());
	};

	const setMintPrice = async (mintPrice, cb) => {
		const tx = await Contract.setMintPrice(
			utils.parseEther(mintPrice).toString()
		);

		await tx.wait().then(() => cb());
	};

	const getTotalSupply = async () => {
		return Contract.getTotalSupply();
	};

	const getMaxSupply = async () => {
		return Contract.getMaxSupply();
	};

	const getMintPrice = async () => {
		return Contract.getMintPrice();
	};

	const getMaxMint = async () => {
		return Contract.getMaxMint();
	};

	const getMaxBalance = async () => {
		return Contract.getMaxBalance();
	};

	const getSaleActive = async () => {
		return Contract.getSaleActive();
	};

	const getRevealed = async () => {
		return Contract.getRevealed();
	};

	const isContractOwner = async () => {
		return Contract.isContractOwner();
	};

	const getOwnerBalance = async () => {
		return Contract.getOwnerBalance();
	};

	const getContractBalance = async () => {
		return Contract.getContractBalance();
	};

	return {
		mint,
		withdraw,
		flipSaleActive,
		flipRevealed,
		setMaxMint,
		setMaxBalance,
		setMintPrice,
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
	};
};
