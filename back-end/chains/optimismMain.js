import { defineChain } from 'viem';

export const optimismMain = defineChain({
    id: 10,
    name: "Optimism",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    rpcUrls: {
        default: {
            http: ["https://mainnet.optimism.io"],
        },
    },
    blockExplorers: {
        default: {
            name: "Optimistic Etherscan",
            url: "https://optimistic.etherscan.io",
        },
    },
});
