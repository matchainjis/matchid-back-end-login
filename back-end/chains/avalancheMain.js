import { defineChain } from 'viem';

export const avalancheMain = defineChain({
    id: 43114,
    name: "Avalanche C-Chain",
    nativeCurrency: { name: "Avalanche", symbol: "AVAX", decimals: 18 },
    rpcUrls: {
        default: {
            http: ["https://api.avax.network/ext/bc/C/rpc"],
        },
    },
    blockExplorers: {
        default: {
            name: "SnowTrace",
            url: "https://snowtrace.io",
        },
    },
});
