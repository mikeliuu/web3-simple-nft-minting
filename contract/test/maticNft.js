const { expect } = require("chai");
const { ethers } = require("hardhat");
const { utils } = require("ethers");

describe("Test MaticNft contract", function () {
	let owner;
	let addr1;
	let MaticNft;
	let maticNft;
	let contractAddress;

	const MAX_SUPPLY = "20";
	const maxBalance = "5";
	const maxMint = "2";
	const mintPrice = utils.parseEther("0.25");

	beforeEach(async function () {
		[account, address1] = await ethers.getSigners();
		owner = account;
		addr1 = address1;

		MaticNft = await ethers.getContractFactory("MaticNft");
		maticNft = await MaticNft.deploy();

		await maticNft.deployed();

		contractAddress = maticNft.address;

		await maticNft.connect(owner.address);
	});

	// todo: check contract initial states
	it("Check contract initital max supply", async function () {
		expect(await maticNft.getMaxSupply()).to.equal(MAX_SUPPLY);
	});

	it("Check contract initital max balance", async function () {
		expect(await maticNft.getMaxBalance()).to.equal(maxBalance);
	});

	it("Check contract initital max mint", async function () {
		expect(await maticNft.getMaxMint()).to.equal(maxMint);
	});

	it("Check contract initital mint price", async function () {
		expect(await maticNft.getMintPrice()).to.equal(mintPrice);
	});

	// todo: check getter functions
	it("Check contract balance", async function () {
		const contractBalance = await maticNft.provider.getBalance(contractAddress);

		expect(await maticNft.getContractBalance()).to.equal(contractBalance);
	});

	it("Check owner balance", async function () {
		const ownerBalance = await maticNft.balanceOf(owner.address);

		expect(await maticNft.totalSupply()).to.equal(ownerBalance);
	});

	it("Check sale active status", async function () {
		expect(await maticNft.getSaleActive()).to.equal(false);
	});

	it("Check reveal active status", async function () {
		expect(await maticNft.getRevealed()).to.equal(false);
	});

	it("Check is contract owner", async function () {
		expect(await maticNft.isContractOwner()).to.equal(true);
	});

	// todo: check setter functions
	it("Flip sale active status", async function () {
		expect(await maticNft.getSaleActive()).to.equal(false);

		const flipSaleActive = await maticNft.flipSaleActive();

		// wait until the transaction is mined
		await flipSaleActive.wait();

		expect(await maticNft.getSaleActive()).to.equal(true);
	});

	it("Flip reveal active status", async function () {
		expect(await maticNft.getRevealed()).to.equal(false);

		const flipRevealed = await maticNft.flipRevealed();

		// wait until the transaction is mined
		await flipRevealed.wait();

		expect(await maticNft.getRevealed()).to.equal(true);
	});

	it("Set max balance", async function () {
		const newMaxBalance = "5";

		expect(await maticNft.getMaxBalance()).to.equal(maxBalance);

		const setMaxBalance = await maticNft.setMaxBalance(newMaxBalance);

		// wait until the transaction is mined
		await setMaxBalance.wait();

		expect(await maticNft.getMaxBalance()).to.equal(newMaxBalance);
	});

	it("Set max mint", async function () {
		const newMaxMint = "3";

		expect(await maticNft.getMaxMint()).to.equal(maxMint);

		const setMaxMint = await maticNft.setMaxMint(newMaxMint);

		// wait until the transaction is mined
		await setMaxMint.wait();

		expect(await maticNft.getMaxMint()).to.equal(newMaxMint);
	});

	it("Set mint price", async function () {
		const newMintPrice = utils.parseEther(".35");

		expect(await maticNft.getMintPrice()).to.equal(mintPrice);

		const setMintPrice = await maticNft.setMintPrice(newMintPrice);

		// wait until the transaction is mined
		await setMintPrice.wait();

		expect(await maticNft.getMintPrice()).to.equal(newMintPrice);
	});

	// todo: check mint function
	it("Mint", async function () {
		const mintAmount = "2";

		// activate sale active status before minting
		await maticNft.flipSaleActive();

		// check sale active status before minting
		expect(await maticNft.getSaleActive()).to.equal(true);

		const mint = await maticNft.mint(mintAmount, {
			value: (mintPrice * mintAmount).toString(),
		});

		// wait until the transaction is mined
		await mint.wait();

		// should token supply equals mint amount after minting
		expect(await maticNft.totalSupply()).to.equal(mintAmount);
	});

	// todo: check withdraw function
	it("Withdraw", async function () {
		const mintAmount = "2";

		// activate sale active status before minting
		await maticNft.flipSaleActive();

		// check sale active status before minting
		expect(await maticNft.getSaleActive()).to.equal(true);

		const mint = await maticNft.mint(mintAmount, {
			value: (mintPrice * mintAmount).toString(),
		});

		// wait until the transaction is mined
		await mint.wait();

		// should token supply equals mint amount after minting
		expect(await maticNft.totalSupply()).to.equal(mintAmount);

		const contractBalanceBefore = await maticNft.provider.getBalance(
			contractAddress
		);

		expect(await maticNft.getContractBalance()).to.equal(contractBalanceBefore);

		// should token supply equals mint amount after minting
		expect(await maticNft.totalSupply()).to.equal(mintAmount);

		const contractBalanceAfter = await maticNft.provider.getBalance(
			contractAddress
		);

		// should increase balance after minting
		expect(await maticNft.getContractBalance()).to.equal(contractBalanceAfter);
	});
});
