const { expect } = require("./setupChai");
const { ethers } = require("hardhat");
const { BigNumber } = require("ethers");

describe("Bi-Directional Payment Channel", () => {
  let contract,
    firstAcc,
    secAcc,
    thirdAcc,
    firstAccBal = BigNumber.from(ethers.utils.parseEther("50")),
    secAccBal = BigNumber.from("0");
  const endDate = new Date().setDate(new Date().getDate()),
    period = 86400 * 5,
    provider = ethers.provider;

  before(async () => {
    [firstAcc, secAcc, thirdAcc] = await ethers.getSigners();
    const Contract = await ethers.getContractFactory("BiDirectional");
    contract = await Contract.deploy(
      [firstAcc.address, secAcc.address],
      [firstAccBal, secAccBal],
      endDate,
      period,
      { value: firstAccBal.add(secAccBal) }
    );
    await contract.deployed();
  });

  it("Contract Deployed Successfully !!", async () => {
    const address = contract.address;
    expect(address).to.be.not.equal(0x0);
    expect(address).to.be.not.equal(undefined);
    expect(address).to.be.not.equal(null);
    expect(address).to.be.not.equal("");
  });

  it("Initial values should be equal !!", async () => {
    const _firstAcc = await contract.users(0);
    const _secAcc = await contract.users(1);

    const _endsAt = await contract.endsAt();
    const _period = await contract.period();

    expect(_firstAcc).to.be.equal(firstAcc.address);
    expect(_secAcc).to.be.equal(secAcc.address);
    expect(_endsAt).to.be.equal(endDate);
    expect(_period).to.be.equal(period);

    await expect(contract.isUser(_firstAcc)).to.eventually.be.equal(true);
    await expect(contract.isUser(_secAcc)).to.eventually.be.equal(true);
  });

  it("Money should be equal to deposited money", async () => {
    const _contractBalance = await contract.getContractBalance();
    const _user1Balance = await contract.balances(firstAcc.address);
    const _user2Balance = await contract.balances(secAcc.address);

    expect(_user1Balance).to.be.equal(firstAccBal);
    expect(_user2Balance).to.be.equal(secAccBal);
    expect(_contractBalance).to.be.equal(firstAccBal.add(secAccBal));
  });

  it("Changing Balance !!", async () => {
    const amountTranfer = BigNumber.from(ethers.utils.parseEther("10"));
    const firstAccBalAfter = BigNumber.from(
      firstAccBal.sub(amountTranfer).toString()
    );
    const secAccBalAfter = BigNumber.from(
      secAccBal.add(amountTranfer).toString()
    );

    const _nonce = await contract.nonce();

    const messageHash = await contract.getMessageHash(
      [firstAccBalAfter, secAccBalAfter],
      contract.address,
      _nonce + 1
    );

    const thirdAccSign = await thirdAcc.signMessage(
      ethers.utils.arrayify(messageHash)
    );
    const firstAccSign = await firstAcc.signMessage(
      ethers.utils.arrayify(messageHash)
    );
    const secAccSign = await secAcc.signMessage(
      ethers.utils.arrayify(messageHash)
    );

    await expect(
      contract.changeBalance([thirdAccSign, firstAccSign], _nonce, [
        firstAccBalAfter,
        secAccBalAfter,
      ]),
      "Only valid users are required !!"
    ).to.eventually.be.rejected;

    await expect(
      contract.changeBalance([firstAccSign, secAccSign], _nonce + 1, [
        firstAccBalAfter.add(1),
        secAccBal,
      ]),
      "Balances should be matched !!"
    ).to.eventually.be.rejected;

    await expect(
      contract.changeBalance([firstAccSign, secAccSign], _nonce + 2, [
        firstAccBalAfter,
        secAccBalAfter,
      ]),
      "Nonce should be correct !!"
    ).to.eventually.be.rejected;

    await expect(
      contract.changeBalance([firstAccSign, secAccSign], _nonce + 1, [
        firstAccBalAfter,
        secAccBalAfter,
      ])
    ).to.eventually.be.fulfilled;

    const _firstAccBalance = await contract.balances(firstAcc.address);
    const _secAccBalance = await contract.balances(secAcc.address);

    expect(_firstAccBalance).to.be.equal(firstAccBalAfter);
    expect(_secAccBalance).to.be.equal(secAccBalAfter);
  });

  it("Withdrawing the amount !!", async () => {
    await expect(
      contract.withdraw(),
      "Cannot be fullfilled before the expiration period !!"
    ).to.eventually.be.rejected;
    await provider.send("evm_increaseTime", [5 * 24 * 60 * 60]);

    await expect(
      contract.connect(thirdAcc).withdraw(),
      "Cannot be executed by a third account !!"
    ).to.eventually.be.rejected;

    await expect(contract.withdraw()).to.eventually.be.fulfilled;
    await expect(contract.connect(secAcc).withdraw()).to.eventually.be
      .fulfilled;
  });
});
