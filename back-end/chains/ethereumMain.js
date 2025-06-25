import { defineChain } from 'viem';

export const ethereumMain = defineChain({
    id: 1,
    name: "Ethereum",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    rpcUrls: {
        default: {
            http: ["https://ethereum.publicnode.com"],
        },
    },
    blockExplorers: {
        default: {
            name: "Etherscan",
            url: "https://etherscan.io",
        },
    },
});
