import { defineChain } from 'viem';

export const arbitrumOneMain = defineChain({
    id: 42161,
    name: "Arbitrum One",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    rpcUrls: {
        default: {
            http: ["https://arb1.arbitrum.io/rpc"],
        },
    },
    blockExplorers: {
        default: {
            name: "Arbiscan",
            url: "https://arbiscan.io",
        },
    },
});
