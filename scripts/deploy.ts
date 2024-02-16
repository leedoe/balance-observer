import { ethers } from "hardhat";
import contractSet from "./stable.json";

const getBalance = async (): Promise<string[][]> => {
  const table: any = [];
  for await (const [key, value] of Object.entries(contractSet)) {
    if (typeof value.executor === "object") {
      for await (const executorAddress of value.executor) {
        const balance = await ethers.provider.getBalance(executorAddress);
        table.push([key, executorAddress, balance]);
      }
    } else {
      const executorAddress = value.executor;
      const balance = await ethers.provider.getBalance(executorAddress);
      table.push([key, executorAddress, balance]);
    }
  }

  return table;
};

async function main() {
  setInterval(async () => {
    console.clear();
    console.log(Date.now());
    const balances = await getBalance();
    console.table(balances);
  }, 5000);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
