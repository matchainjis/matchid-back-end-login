// chains/index.js
import { arbitrumOneMain } from './arbitrumOneMain.js';
import { avalancheMain } from './avalancheMain.js';
import { bscMain } from './bscMain.js';
import { ethereumMain } from './ethereumMain.js';
import { fantomMain } from './fantomMain.js';
import { matchMain } from './matchMain.js';
import { optimismMain } from './optimismMain.js';
import { polygonMain } from './polygonMain.js';

export const allChains = {
    698: matchMain,
    56: bscMain,
    1: ethereumMain,
    137: polygonMain,
    42161: arbitrumOneMain,
    10: optimismMain,
    43114: avalancheMain,
    250: fantomMain,
};

export {
    matchMain,
    bscMain,
    ethereumMain,
    polygonMain,
    arbitrumOneMain,
    optimismMain,
    avalancheMain,
    fantomMain,
};
