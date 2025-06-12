import { ethers } from "hardhat";
import { expect } from "chai";
import { Lottery } from "../typechain-types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("Lottery Round Details", function () {
    let lottery: Lottery;
    let owner: SignerWithAddress;
    let player1: SignerWithAddress;
    let player2: SignerWithAddress;

    beforeEach(async function () {
        const LotteryFactory = await ethers.getContractFactory("Lottery");
        [owner, player1, player2] = await ethers.getSigners();
        lottery = await LotteryFactory.deploy();
        await lottery.deployed();
    });

    it("should store round details when a winner is picked", async function () {
        // Enter players
        await lottery.connect(player1).enter({ value: ethers.utils.parseEther("0.1") });
        await lottery.connect(player2).enter({ value: ethers.utils.parseEther("0.1") });

        // Mock VRF and pick winner
        await lottery.connect(owner).startPickingWinner();

        // Get latest lottery round details
        const lotteryId = await lottery.getLotteryId();
        const roundDetails = await lottery.getLotteryRoundDetails(lotteryId.sub(1));

        expect(roundDetails.roundId).to.be.gt(0);
        expect(roundDetails.timestamp).to.be.gt(0);
        expect(roundDetails.potSize).to.be.gt(0);
        expect(roundDetails.participantCount).to.equal(2);
        expect(roundDetails.winner).to.not.be.null;
    });

    it("should have correct pot size for a round", async function () {
        const enterAmount = ethers.utils.parseEther("0.1");
        await lottery.connect(player1).enter({ value: enterAmount });
        await lottery.connect(player2).enter({ value: enterAmount });

        await lottery.connect(owner).startPickingWinner();

        const lotteryId = await lottery.getLotteryId();
        const roundDetails = await lottery.getLotteryRoundDetails(lotteryId.sub(1));

        expect(roundDetails.potSize).to.equal(enterAmount.mul(2));
    });
});