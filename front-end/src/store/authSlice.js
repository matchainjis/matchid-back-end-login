// src/store/authSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { saveToken, clearToken } from '../utils/storage';

const initialState = {
    email: '',
    mobile: '',
    matchidAddress: '',
    matchidDid: '',
    matchidToken: '',
    matchidAuthKey: '',
    extraEvmAddress: '',
    isAuthenticated: false,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser(state, action) {
            const {
                email,
                mobile,
                matchidAddress,
                matchidDid,
                matchidToken,
                matchidAuthKey,
                extraEvmAddress,
                isAuthenticated
            } = action.payload;
            state.email = email;
            state.mobile = mobile;
            state.matchidAddress = matchidAddress;
            state.matchidDid = matchidDid;
            state.matchidToken = matchidToken;
            state.matchidAuthKey = matchidAuthKey;
            state.extraEvmAddress = extraEvmAddress;
            state.isAuthenticated = isAuthenticated;
            saveToken(matchidToken);
        },
        logout(state) {
            Object.assign(state, initialState);
            clearToken();
        },
    },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
