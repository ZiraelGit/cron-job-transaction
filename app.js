import nodeCron from "node-cron";
import puppeteer from "puppeteer";
import ora from "ora"
import chalk from "chalk";
// const nodeCron = require("node-cron");
// const ora = require("ora");
// const chalk = require("chalk");
import { ethers } from 'ethers';
import Web3 from "web3";
import dotenv from 'dotenv'
import {abi} from "./abi.js"
dotenv.config();


const BN = Web3.utils.BN;
const contractAddress = "0x8d449E4848Ce919179D5f573FD7Da2A40c27C997"
const winnerAddress = "0x70e030f244c1b794Fab726A39d256A0bB3BA0647"
const amount = new BN("150000000000000000000")

const web3 = new Web3("https://data-seed-prebsc-1-s1.binance.org:8545");

const account = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY);
const contract = new web3.eth.Contract(abi, contractAddress);

// transfer transaction interface
const txObject = {
    from: account.address,
    to: contractAddress,
    gas: web3.utils.toHex(500000),
    gasPrice: web3.utils.toHex(10e9),
    data: contract.methods
        .transfer(
            winnerAddress,
            amount)
        .encodeABI(),
};


async function scrapeWorldPopulation() {
    // Log a message on the terminal as the scheduled job starts
    // We are using chalk to make the message on the terminal look colorful
    console.log(chalk.green("Running scheduled job"));
    // Launch a loading spinner with an appropriate message on the terminal
    // It provides a good user experience as the scraping process takes a bit of time
    const spinner = ora({
        text: "executin tranjaction...",
        color: "blue",
        hideCursor: false,
    }).start();

    try {
        // This will help us compute the duration of the job later
        const date = Date.now();
        // Change the message on the terminal as we start scraping the page
        spinner.text = "executing a transfer transaction";

        // transfer amount of token to winnerAddress
        const signedTx = await account.signTransaction(txObject);
        const txReceipt = await web3.eth.sendSignedTransaction(
            signedTx.rawTransaction,
        );

        // Print success message with duration it took to scrape the data in ms
        spinner.succeed(`Transfer Successful after ${Date.now() - date}ms`);
        // Remove the spinner from the terminal
        spinner.clear();

    } catch (error) {
        // Print failed on the terminal if scraping is unsuccessful
        spinner.fail({ text: "Scraping failed" });
        // Remove the spinner from the terminal
        spinner.clear();
        // Print the error message on the terminal
        console.log(error);
    }
}
// Schedule a job to run every two minutes
const job = nodeCron.schedule("0 0 0 * * *", scrapeWorldPopulation);