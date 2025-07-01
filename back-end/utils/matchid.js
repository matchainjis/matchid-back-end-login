// utils/matchid.js
import { createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { decryptPrivateKey } from '../utils/crypto.js';
import { allChains } from "../chains/index.js";
import { config as dotenvConfig } from 'dotenv';
dotenvConfig();

const MatchainMainnet = allChains[698]; // fallback to Matchain
const GAS_PAYER_PK = process.env.GAS_PAYER_PK;
const GAS_PAYER_WA = process.env.GAS_PAYER_WA;

export const gasPayerAccount = privateKeyToAccount(`0x${GAS_PAYER_PK}`);
console.log('Gas Payer Account:', gasPayerAccount.address);

export const walletClient = createWalletClient({
    chain: MatchainMainnet,
    transport: http(MatchainMainnet.rpcUrls.default.http[0]),
    account: gasPayerAccount,
});

export async function sendInitialGas(toAddress, amountInEth = '0.000001') {
    const hash = await walletClient.sendTransaction({
        to: toAddress,
        value: BigInt(Math.floor(Number(amountInEth) * 1e18)),
    });

    return hash;
}

export async function repayInitialGas(extraEvmEncryptedPrivateKey, amountInEth = '0.000001') {

    const privateKey = decryptPrivateKey(extraEvmEncryptedPrivateKey);
    const account = privateKeyToAccount(privateKey);

    const userWalletClient = createWalletClient({
        chain: MatchainMainnet,
        transport: http(MatchainMainnet.rpcUrls.default.http[0]),
        account: account,
    });

    const hash = await walletClient.sendTransaction({
        to: GAS_PAYER_WA,
        value: BigInt(Math.floor(Number(amountInEth) * 1e18)),
    });

    return hash;
}
