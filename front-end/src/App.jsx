// src/App.jsx
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "./store/authSlice";
import AppRoutes from "./AppRoutes"; // 👈 new child
import { MatchProvider } from "@matchain/matchid-sdk-react";

const getState = () => {
  if (window.localStorage.getItem("match-local")) {
    const localState = JSON.parse(window.localStorage.getItem("match-local"));
    return localState.state;
  }
  return null;
};
const App = () => {
  const dispatch = useDispatch();
  const stateLocal = getState();
  // eslint-disable-next-line no-unused-vars
  const [appid, setAppid] = useState(
    stateLocal?.appid || import.meta.env.VITE_REACT_APP_MATCHID_APP_ID,
  );
  // eslint-disable-next-line no-unused-vars
  const [locale, setLocale] = useState(
    window.localStorage.getItem("locale") || "en",
  );

  // const [endpoints, setEndpoints] = useState(
  //  state?.endpoints || {
  //    auth: "https://auth.matchid.io",
  //    back: "https://backend.matchid.io",
  //  }
  // );
  useEffect(() => {
    window.localStorage.setItem("locale", locale);
  }, [locale]);

  return (
    <MatchProvider
      appid={stateLocal?.appid || import.meta.env.VITE_REACT_APP_MATCHID_APP_ID}
      wallet={{ type: "UserPasscode" }}
      // endpoints={endpoints}
      locale={locale}
      events={{
        onLogin: (data) => {
          console.log("MatchProvider: User Logged In", data);
          localStorage.setItem(
            "matchid-wallet-back-end-demo",
            JSON.stringify(data),
          );
          dispatch(
            setUser({
              mid: data?.mid,
              did: data?.did,
              token: data?.token,
            }),
          );
        },
        onLogout: () => {
          console.log("MatchProvider: User Logged Out");
        },
        onBind: (data) => {
          console.log("MatchProvider: User Bound Info", data);
        },
      }}
    >
      <AppRoutes />
    </MatchProvider>
  );
};

export default App;
