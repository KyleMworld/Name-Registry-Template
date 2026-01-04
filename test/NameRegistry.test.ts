
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ContractRunner, ContractTransactionResponse } from "ethers";
import { ethers } from "hardhat";
import { NameRegistry } from "../types";

describe("NameRegistry", function () {
  let nameRegistry: NameRegistry & { deploymentTransaction(): ContractTransactionResponse; };
  let owner: { address: any; };
  let addr1: ContractRunner | null | undefined;

  // Deploy a fresh contract before each test
  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();
    const NameRegistry = await ethers.getContractFactory("NameRegistry");
    nameRegistry = await NameRegistry.deploy();
  });

  describe("Claiming Names", function () {
    it("Should allow a user to claim a unique name", async function () {
      await expect(nameRegistry.claimName("alice.eth"))
        .to.emit(nameRegistry, "NameRegistered")
        .withArgs(owner.address, "alice.eth");

      // Verify ownership via the public mapping
      expect(await nameRegistry.nameToOwner("alice.eth")).to.equal(owner.address);
    });

    it("Should fail if the name is already claimed", async function () {
      await nameRegistry.claimName("bob.eth");
      await expect(nameRegistry.connect(addr1).claimName("bob.eth"))
        .to.be.revertedWith("Name already claimed");
    });
  });

  describe("Releasing Names", function () {
    it("Should allow the owner to release their name", async function () {
      await nameRegistry.claimName("charlie.eth");
     
      await expect(nameRegistry.releaseName("charlie.eth"))
        .to.emit(nameRegistry, "NameReleased")
        .withArgs(owner.address, "charlie.eth");

      // Mapping should now return address(0)
      expect(await nameRegistry.nameToOwner("charlie.eth")).to.equal(ethers.ZeroAddress);
    });

    it("Should fail if a non-owner tries to release a name", async function () {
      await nameRegistry.claimName("dan.eth");
      await expect(nameRegistry.connect(addr1).releaseName("dan.eth"))
        .to.be.revertedWith("Not the owner of the name");
    });
  });
});