import React, { useEffect, useState } from "react";

import { db } from "../../../firebaseconfig";
import { ref, onValue } from "firebase/database";
import Loader from "../../../components/Loader";
import { useAuth } from "../../../contexts/authContext";
import { useData } from "../../../contexts/DataContext";

const ApplePay = () => {
  const [applePayDetails, setApplePayDetails] = useState({});

  const { loading } = useAuth();
  const { applePayDetails: applePay } = useData();

  useEffect(() => {
    setApplePayDetails(applePay);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div className="md:w-3/4 mx-auto">
      <div className="text-center my-5">
        <h1 className="text-3xl font-bold text-silver">Apple Pay Transfer</h1>
      </div>

      <div className="bg-lightBG my-[30px] rounded-lg p-6 max-w-md mx-auto">
        <div className="text-center mb-6">
          <p className="text-white text-lg mb-2">
            Transfer money using Apple Pay to the apple pay number below:
          </p>
          <p className="text-secondary text-xl font-bold">
            {applePayDetails?.number}
          </p>
        </div>

        <div className="mt-6">
          <p className="text-white text-sm opacity-70 text-center">
            Ensure the transfer is complete and proceed to send proof of payment
            by tapping "Chat With Us" below.
          </p>
        </div>

        <button
          onClick={() => alert("Open Chat")}
          className="flex items-center justify-center w-full mt-6 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
        >
          {/* <FaCommentDots size={24} /> */}
          <span className="ml-2 text-lg">Chat With Us</span>
        </button>
      </div>
    </div>
  );
};

export default ApplePay;
