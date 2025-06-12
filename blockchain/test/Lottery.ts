import { expect } from "chai";
import { ethers } from "hardhat";

describe('Lottery Contract Advanced Features', () => {
  async function deployLotteryFixture() {
    const [owner, player1, player2] = await ethers.getSigners();
    const Lottery = await ethers.getContractFactory("Lottery");
    const lottery = await Lottery.deploy();
    await lottery.deployed();

    return { lottery, owner, player1, player2 };
  }

  it('should store round details after lottery completion', async () => {
    const { lottery, owner, player1, player2 } = await deployLotteryFixture();

    // Enter players
    await lottery.connect(player1).enter({ value: ethers.utils.parseEther('0.1') });
    await lottery.connect(player2).enter({ value: ethers.utils.parseEther('0.1') });

    // Simulate winner picking
    await lottery.connect(owner).startPickingWinner();

    // Wait for blockchain to process
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Check round details
    const roundDetails = await lottery.getLotteryRoundDetails(1);
    expect(roundDetails.roundId.toNumber()).to.equal(1);
    expect(roundDetails.numberOfParticipants.toNumber()).to.equal(2);
    expect(roundDetails.potSize).to.be.gt(0);
    expect(roundDetails.timestamp).to.be.gt(0);
    expect(roundDetails.isCompleted).to.be.true;
  });

  it('should track multiple round details', async () => {
    const { lottery, owner, player1, player2 } = await deployLotteryFixture();

    // First round
    await lottery.connect(player1).enter({ value: ethers.utils.parseEther('0.1') });
    await lottery.connect(owner).startPickingWinner();

    // Wait for blockchain to process
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Second round
    await lottery.connect(player2).enter({ value: ethers.utils.parseEther('0.2') });
    await lottery.connect(owner).startPickingWinner();

    // Wait for blockchain to process
    await new Promise(resolve => setTimeout(resolve, 2000));

    const firstRoundDetails = await lottery.getLotteryRoundDetails(1);
    const secondRoundDetails = await lottery.getLotteryRoundDetails(2);

    expect(firstRoundDetails.roundId.toNumber()).to.equal(1);
    expect(secondRoundDetails.roundId.toNumber()).to.equal(2);
  });
});