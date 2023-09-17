
import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract, ContractFactory, Signer } from "ethers";

describe("RealEstateToken", function () {
  let RealEstateToken: ContractFactory;
  let realEstateToken: Contract;
  let owner: Signer;
  let addr1: Signer;
  let addr2: Signer;

  beforeEach(async function () {
    RealEstateToken = await ethers.getContractFactory("RealEstateToken");
    [owner, addr1, addr2] = await ethers.getSigners();
    realEstateToken = await RealEstateToken.deploy();
    await realEstateToken.deployed();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await realEstateToken.owner()).to.equal(owner.address);
    });
  });

  describe("Transactions", function () {
    it("Should mint tokens correctly", async function () {
      const accounts = [addr1, addr2];
      const id = 1;
      const amounts = [50, 50];
      const houseNumber = "123";
      const city = "Test City";

      await realEstateToken
        .connect(owner)
        .mint(accounts, id, amounts, houseNumber, city);

      expect(await realEstateToken.balanceOf(addr1.address, id)).to.equal(50);
      expect(await realEstateToken.balanceOf(addr2.address, id)).to.equal(50);
    });

    it("Should update real estate details correctly", async function () {
      const id = 1;
      const houseNumber = "456";
      const city = "New City";

      await realEstateToken
        .connect(owner)
        .setRealEstateDetails(id, houseNumber, city);

      expect(await realEstateToken.realEstateDetails(id)).to.equal(
        houseNumber + ", " + city
      );
    });
  });
});
