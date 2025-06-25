import { defineChain } from 'viem';

export const matchMain = /*#__PURE__*/ defineChain({
    id: 698,
    name: "Matchain",
    nativeCurrency: { name: "MAT", symbol: "BNB", decimals: 18 },
    rpcUrls: {
        default: {
            http: ["https://rpc.matchain.io"],
        },
    },
    blockExplorers: {
        default: {
            name: "Matchscan",
            url: "https://matchscan.io/",
            apiUrl: "https://matchscan.io/api",
        },
    },
    iconUrl: "https://matchscan.io/static/identicon_logos/blockies.png",
    contracts: {
        multicall3: {
            address: "0xca11bde05977b3631167028862be2a173976ca11",
        },
    },
});
