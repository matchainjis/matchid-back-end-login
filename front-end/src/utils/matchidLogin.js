import { Wallet } from 'ethers';
import axios from 'axios';

const MATCHID_API = 'https://api.matchid.ai/api/v1';
const MATCHID_WEB_API = 'https://api.matchid.ai/web/api/v1';
const APP_ID = import.meta.env.VITE_REACT_APP_MATCHID_APP_ID;

/**
 * Step 1: Get login nonce for EVM wallet
 */
async function getLoginNonce(address) {
    const res = await axios.post(`${MATCHID_API}/login/wallet/init`, {
        address,
        type: 'EVM',
    });
    return res.data.data.nonce;
}

/**
 * Step 2: Generate sign-in message for MatchID
 */
function generateLoginMessage(address, nonce) {
    const now = new Date().toISOString();
    return `www.matchid.ai wants you to sign in with your Ethereum account:
${address}

By signing, you are proving you own this wallet and logging in. This does not initiate a transaction or cost any fees.

URI: https://www.matchid.ai
Version: 1
Chain ID: 698
Nonce: ${nonce}
Issued At: ${now}`;
}

/**
 * Step 3: Sign message using private key
 */
function signLoginMessage(message, privateKey) {
    const wallet = new Wallet(privateKey);
    return wallet.signMessage(message);
}

/**
 * Step 4: Submit signature to MatchID for login
 */
async function submitLogin(address, signature, message) {
    const res = await axios.post(`${MATCHID_API}/login/wallet`, {
        type: 'EVM',
        address,
        signature,
        message,
        connector_type: 'injected',
        wallet_client_type: 'MetaMask',
        appid: `${APP_ID}`
    });

    return res.data; // contains access_token, did, etc.
}

/**
 * Step 5: Fetch MatchID wallet address and details using access_token
 */
async function fetchUserAuth(access_token) {
  const res = await axios.get(`${MATCHID_API}/user/auth`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
      appid: APP_ID,
    },
  });

  return res.data.data; // contains address, did, etc.
}

/**
 * Step 6: Final login session activation (web login)
 */
async function finalizeWebLogin(data, access_token, extraEvmAddress) {
  const res = await axios.post(`${MATCHID_WEB_API}/user/login`, { did: data.did,
      appid: APP_ID,
      address: data.address || extraEvmAddress,
      auth_date: data.auth_date,
      hash: data.hash }, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });

  return res.data.data; // contains token_type, match_id, access_token
}

/**
 * 🔐 Full flow
 */
export async function matchidEvmLogin(extraEvmAddress, extraEvmPrivateKey) {

    const nonce = await getLoginNonce(extraEvmAddress);
    const message = generateLoginMessage(extraEvmAddress, nonce);
    const signature = await signLoginMessage(message, extraEvmPrivateKey);
    const loginResult = await submitLogin(extraEvmAddress, signature, message);

    const access_token = loginResult.data.access_token;
    const userAuth = await fetchUserAuth(loginResult.data.access_token);
    const webLogin = await finalizeWebLogin(userAuth, access_token, extraEvmAddress);

    return {
        matchidAddress: userAuth.address,
        matchidToken: loginResult.access_token,
        matchidDid: userAuth.did,
    };
}
