
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("NameRegistry", function () {
  // We define a fixture to reuse the same setup in every test.
  async function deployRegistryFixture() {
    const [owner, otherAccount, thirdAccount] = await ethers.getSigners();
    const NameRegistry = await ethers.getContractFactory("NameRegistry");
    const registry = await NameRegistry.deploy();
    return { registry, owner, otherAccount, thirdAccount };
  }

  describe("Claiming Names", function () {
    it("Should allow a user to claim a name", async function () {
      const { registry, owner } = await loadFixture(deployRegistryFixture);
      await registry.claimName("alice");
      expect(await registry.getOwner("alice")).to.equal(owner.address);
    });

    it("Should NOT allow two users to claim the same name", async function () {
      const { registry, owner, otherAccount } = await loadFixture(deployRegistryFixture);
      await registry.claimName("bitcoin");
      // Requirement 2: No other user can claim it
      await expect(
        registry.connect(otherAccount).claimName("bitcoin")
      ).to.be.revertedWith("Name already claimed by someone else");
    });

    it("Should allow a user to claim multiple names", async function () {
      const { registry, owner } = await loadFixture(deployRegistryFixture);
      // Requirement 4: User can claim any number of names
      await registry.claimName("name1");
      await registry.claimName("name2");
      const names = await registry.getMyNames(owner.address);
      expect(names).to.deep.equal(["name1", "name2"]);
    });
  });

  describe("Releasing Names", function () {
    it("Should allow the owner to release a name", async function () {
      const { registry, owner } = await loadFixture(deployRegistryFixture);
      await registry.claimName("temporary");
      await registry.releaseName("temporary");
      
      // Verify name is available again
      expect(await registry.getOwner("temporary")).to.equal(ethers.ZeroAddress);
    });

    it("Should NOT allow a non-owner to release a name", async function () {
      const { registry, owner, otherAccount } = await loadFixture(deployRegistryFixture);
      await registry.claimName("protected");
      // Requirement 3: A name OWNER can release a name
      await expect(
        registry.connect(otherAccount).releaseName("protected")
      ).to.be.revertedWith("You don't own this name");
    });

    it("Should allow a name to be re-claimed after being released", async function () {
      const { registry, owner, otherAccount } = await loadFixture(deployRegistryFixture);
      await registry.claimName("recyclable");
      await registry.releaseName("recyclable");
      
      // Other account should now be able to claim it
      await registry.connect(otherAccount).claimName("recyclable");
      expect(await registry.getOwner("recyclable")).to.equal(otherAccount.address);
    });
  });
});
