// chains/bsc.js
import { defineChain } from 'viem';

export const bscMain = defineChain({
    id: 56,
    name: "Binance Smart Chain",
    nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 },
    rpcUrls: {
        default: {
            http: ["https://bsc-dataseed.binance.org"],
        },
    },
    blockExplorers: {
        default: {
            name: "BscScan",
            url: "https://bscscan.com",
        },
    },
});
