import { defineChain } from 'viem';

export const fantomMain = defineChain({
    id: 250,
    name: "Fantom",
    nativeCurrency: { name: "Fantom", symbol: "FTM", decimals: 18 },
    rpcUrls: {
        default: {
            http: ["https://fantom.drpc.org"],
        },
    },
    blockExplorers: {
        default: {
            name: "FTMScan",
            url: "https://ftmscan.com",
        },
    },
});
