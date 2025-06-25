import { defineChain } from 'viem';

export const polygonMain = defineChain({
    id: 137,
    name: "Polygon",
    nativeCurrency: { name: "MATIC", symbol: "MATIC", decimals: 18 },
    rpcUrls: {
        default: {
            http: ["https://polygon-rpc.com"],
        },
    },
    blockExplorers: {
        default: {
            name: "Polygonscan",
            url: "https://polygonscan.com",
        },
    },
});
