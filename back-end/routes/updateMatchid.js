// routes/updateMatchid.js
import express from 'express';
import User from '../models/User.js';
import { sendInitialGas } from '../utils/matchid.js';

const router = express.Router();

router.post('/update-matchid', async (req, res) => {
    const { userId, matchidToken, matchidDid } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        // user.matchIdAddress = matchIdAddress;
        user.matchidToken = matchidToken;
        user.matchidDid = matchidDid;
        // user.matchidAuthKey = matchidAuthKey;

        await user.save();

        const tx = await sendInitialGas(user.extraEvmAddress, '0.000001');
        console.log(`https://matchscan.io/tx/${tx}`);
        // await sendInitialGas(matchIdAddress, '0.000001');

        res.json({ success: true });
    } catch (err) {
        console.error('Error updating MatchID:', err);
        res.status(500).json({ error: err.message });
    }
});

export default router;
