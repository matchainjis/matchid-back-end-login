import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { saveToken } from "../utils/storage";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../store/authSlice";
import { toast } from "react-toastify";
import { matchidEvmLogin } from '../utils/matchidLogin';
import { Hooks } from "@matchain/matchid-sdk-react";

const LoginPage = () => {
  const dispatch = useDispatch();
  const [emailOrMobile, setEmailOrMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const token = useSelector((state) => state.auth.matchidToken);
  const navigate = useNavigate();
  const { useUserInfo } = Hooks;
  const { getAuthInfo } = useUserInfo();

  useEffect(() => {
    if (isAuthenticated && token) {
      setTimeout(() => navigate("/"), 0);
    }
  }, [isAuthenticated, token, navigate]);

  const sendOtp = async () => {
    if (!emailOrMobile) {
      return toast.warn("Please enter your Email or Mobile");
    }

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:4000/api/request-otp", {
        email: emailOrMobile.includes("@") ? emailOrMobile : undefined,
        mobile: !emailOrMobile.includes("@") ? emailOrMobile : undefined,
      });

      if (res.data?.success) {
        toast.success("OTP sent successfully ✉️");
        setOtpSent(true);
      } else {
        toast.error("Failed to send OTP");
      }
    } catch (err) {
      console.error(err);
      toast.error(`Error sending OTP, ${err}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!otp) {
      return toast.warn("Please enter the OTP");
    }

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:4000/api/verify-otp", {
        email: emailOrMobile.includes("@") ? emailOrMobile : undefined,
        mobile: !emailOrMobile.includes("@") ? emailOrMobile : undefined,
        otp,
      });

      const {
        token,
        user,
        needsMatchIdSetup,
        extraEvmAddress,
        extraEvmPrivateKey,
        userId,
      } = res.data;

      // Save JWT
      saveToken(token);
      let matchIDToken, matchIDAddress, matchIDDid;

      // 🔐 If this is a new user without MatchID, do the EVM login from frontend
      if (
        needsMatchIdSetup &&
        extraEvmAddress &&
        extraEvmPrivateKey &&
        userId
      ) {
        try {
          const { matchidAddress, matchidToken, matchidDid } = await matchidEvmLogin(extraEvmAddress, extraEvmPrivateKey);
          matchIDToken = matchidToken;
          matchIDAddress = matchidAddress;
          matchIDDid = matchidDid;
          // const authInfo = await getAuthInfo('evm');
          // console.log('✅ Auth Info:', authInfo);
          // console.log('📦 did:', authInfo?.did);
          // console.log('🔑 auth_key:', authInfo?.auth_key);

          // Send matchid info back to backend
          await axios.post("http://localhost:4000/api/update-matchid", {
            userId,
            // matchIdAddress: matchIdAddress,
            matchidToken: matchidToken,
            matchidDid: matchidDid,
            // matchidAuthKey: authInfo.auth_key,
          });

          toast.success("MatchID setup complete 🎉");
        } catch (e) {
          console.error("MatchID login failed", e);
          toast.error(`Failed to complete MatchID login, ${e}`);
          return;
        }
      }

      dispatch(
        setUser({
          email: user.email,
          mobile: user.mobile,
          matchidAddress: matchIDAddress || user.matchidAddress || "",
          matchidDid: matchIDDid || user.matchidDid || "",
          matchidToken: matchIDToken || "",
          matchidAuthKey: "", // optional: fill from getAuthInfo if needed
          extraEvmAddress: extraEvmAddress || "",
          isAuthenticated: true
        })
      );      
      toast.success("Login successful 🎉");
      navigate("/");
    } catch (err) {
      console.error(err);
      toast.error(`Invalid OTP or Login Failed, ${err}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-indigo-100 p-6">
      <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-sm sm:max-w-md md:max-w-lg transition-all duration-300 hover:shadow-2xl">
        <h2 className="text-2xl font-bold text-center mb-6 text-indigo-700">
          🔐 MatchID Login Behind The Scenes
        </h2>

        <input
          className="w-full mb-4 p-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          type="text"
          placeholder="Email or Mobile"
          value={emailOrMobile}
          onChange={(e) => setEmailOrMobile(e.target.value)}
          disabled={otpSent}
        />

        {otpSent && (
          <input
            className="w-full mb-4 p-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
        )}

        <button
          className={`w-full p-3 font-medium rounded-lg transition text-gray-500 ${
            loading
              ? "bg-indigo-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
          onClick={otpSent ? handleLogin : sendOtp}
          disabled={loading || (!otpSent && !emailOrMobile)}
        >
          {loading
            ? otpSent
              ? "Logging in..."
              : "Sending OTP..."
            : otpSent
            ? "Login"
            : "Send OTP"}
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
