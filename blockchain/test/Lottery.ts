import { expect } from 'chai';
import { ethers } from 'hardhat';
import { Lottery } from '../typechain-types/contracts/Lottery';

describe('Lottery Contract Advanced Features', () => {
  let lottery: Lottery;
  let owner: any;
  let player1: any;
  let player2: any;

  beforeEach(async () => {
    const [_owner, _player1, _player2] = await ethers.getSigners();
    owner = _owner;
    player1 = _player1;
    player2 = _player2;

    const LotteryFactory = await ethers.getContractFactory('Lottery');
    lottery = await LotteryFactory.deploy();
    await lottery.deployed();
  });

  it('should store round details after lottery completion', async () => {
    // Enter players
    await lottery.connect(player1).enter({ value: ethers.utils.parseEther('0.1') });
    await lottery.connect(player2).enter({ value: ethers.utils.parseEther('0.1') });

    // Simulate winner picking
    await lottery.connect(owner).startPickingWinner();

    // Check round details
    const roundDetails = await lottery.getLotteryRoundDetails(1);
    expect(roundDetails.roundId).to.equal(1);
    expect(roundDetails.numberOfParticipants).to.equal(2);
    expect(roundDetails.potSize).to.be.gt(0);
    expect(roundDetails.timestamp).to.be.gt(0);
    expect(roundDetails.isCompleted).to.be.true;
  });

  it('should track multiple round details', async () => {
    // First round
    await lottery.connect(player1).enter({ value: ethers.utils.parseEther('0.1') });
    await lottery.connect(owner).startPickingWinner();

    // Second round
    await lottery.connect(player2).enter({ value: ethers.utils.parseEther('0.2') });
    await lottery.connect(owner).startPickingWinner();

    const firstRoundDetails = await lottery.getLotteryRoundDetails(1);
    const secondRoundDetails = await lottery.getLotteryRoundDetails(2);

    expect(firstRoundDetails.roundId).to.equal(1);
    expect(secondRoundDetails.roundId).to.equal(2);
  });
});