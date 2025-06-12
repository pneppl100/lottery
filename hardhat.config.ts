import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.15",
  paths: {
    sources: "./blockchain/contracts",
    tests: "./blockchain/test",
    cache: "./blockchain/cache",
    artifacts: "./blockchain/artifacts"
  },
  networks: {
    hardhat: {
      chainId: 1337 // Development network
    }
  }
};

export default config;