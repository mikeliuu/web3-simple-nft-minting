// optional to import hardhat as it declares in global scope
const hre = require("hardhat");

const main = async () => {
	// import contract
	const CAC = await hre.ethers.getContractFactory("CAC");

	// deploy onto chain
	const cac = await CAC.deploy(
		process.env.BASE_URI,
		process.env.UNREVEALED_URI
	);

	// wait for it done
	await cac.deployed();

	console.log("deployed CAC", { address: cac.address });
};

main()
	.then(() => process.exit(0))
	.catch((err) => {
		console.log({ err });
		process.exit(1);
	});
