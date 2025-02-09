import { createContext, useState, useEffect, useContext } from "react";
import { onValue, ref } from "firebase/database";

import { useAuth } from "./authContext";
import { db } from "../firebaseconfig";
export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const { setLoading } = useAuth();
  const [rates, setRates] = useState([]);
  //   const [accountDetails, setAccountDetails] = useState({});
  const [EurAccountDetails, setEurAccountDetails] = useState({});
  const [USDAccountDetails, setUSDAccountDetails] = useState({});
  const [applePayDetails, setApplePayDetails] = useState({});

  useEffect(() => {
    const ratesRef = ref(db, "exchangeRates");
    const USDAccountRef = ref(db, `currencyExchangeAccount/USD`);
    const applePayRef = ref(db, "payments/apple-pay");

    const getRates = onValue(ratesRef, (snapshot) => {
      const data = snapshot.val();
      const formattedRates = Object.entries(data).map(([key, value]) => ({
        currency: key,
        rate: value,
      }));

      setRates(formattedRates);
    });

    const getUSDAccount = () =>
      onValue(USDAccountRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setUSDAccountDetails(data);
        } else {
          // throw new Error("No Data found");
        }
      });

    const getApplePay = onValue(applePayRef, (snapshot) => {
      const data = snapshot.val();
      setApplePayDetails(data);
    });

    return () => {
      setLoading(true);
      getRates();
      getUSDAccount();
      getApplePay();
      setLoading(false);
    };
  }, []);

  const value = { rates, USDAccountDetails, applePayDetails };
  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within an AuthProvider");
  }
  return context;
};
