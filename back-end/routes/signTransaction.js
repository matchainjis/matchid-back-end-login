// routes/signTransaction.js
import express from 'express';
import { decryptPrivateKey } from '../utils/crypto.js';
import User from '../models/User.js';
import { createWalletClient, http, parseEther } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { allChains } from "../chains/index.js";

const MatchainMainnet = allChains[698]; // fallback to Matchain
const router = express.Router();

router.post('/sign-transaction', async (req, res) => {
    const { email, mobile } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user || !user.matchIdAddress)
            return res.status(404).json({ error: 'User or MatchID wallet not found' });

        const privateKey = decryptPrivateKey(user.extraEvmEncryptedPrivateKey);
        const account = privateKeyToAccount(privateKey);

        const userMatchIdAddress = user.matchIdAddress;

        const walletClient = createWalletClient({
            account: userMatchIdAddress || account,
            chain: MatchainMainnet,
            transport: http(MatchainMainnet.rpcUrls.default.http[0]),
        });

        const hash = await walletClient.sendTransaction({
            to: process.env.GAS_PAYER_WA,
            value: parseEther("0.000001"), // amount in BNB (e.g., "0.01")
        });

        res.json({ hash });
    } catch (err) {
        console.error('Transaction failed:', err);
        res.status(500).json({ error: err.message || 'Transaction failed' });
    }
});

export default router;
