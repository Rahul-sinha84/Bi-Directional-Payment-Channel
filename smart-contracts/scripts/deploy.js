const hre = require("hardhat");

const main = async () => {
  const { ethers } = hre;
  const [first, second] = await ethers.getSigners();

  const initialBalance = ethers.utils.parseEther("5");
  const curDate = new Date();
  let endDate = new Date(curDate.getTime());
  endDate.setDate(curDate.getDate() + 5);
  const period = endDate.getTime() - curDate.getTime();
  const Contract = await ethers.getContractFactory("BiDirectional");
  const contract = await Contract.deploy(
    [first.address, second.address],
    [initialBalance, 0],
    endDate.getTime(),
    period,
    { value: initialBalance }
  );
  await contract.deployed();

  console.log(`Contract deployed to: ${contract.address}`);
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
