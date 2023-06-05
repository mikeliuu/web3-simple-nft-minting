const getDisplayAddress = (address) => {
	return address
		? `${address.substring(0, 5)}...${address.substring(address.length - 4)}`
		: "00x0";
};

export default getDisplayAddress;
