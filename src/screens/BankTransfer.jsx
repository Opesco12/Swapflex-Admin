import { Navigate, redirect, useNavigate, useParams } from "react-router-dom";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Formik } from "formik";

import AppButton from "../components/ui/AppButton";
import { useData } from "../contexts/DataContext";
import { useEffect, useState } from "react";
import { amountFormatter } from "../helpers/amountFormatter";
import CenterModal from "../components/ui/CenterModal";
import { toast } from "react-toastify";

const BankTransfer = () => {
  const [accountDetails, setAccountDetails] = useState({});
  const [amount, setAmount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  const { currency } = useParams();
  const { USDAccountDetails, rates } = useData();

  console.log(USDAccountDetails);

  if (currency !== "USD" && currency !== "EUR") {
    navigate("/404");
  }

  useEffect(() => {
    if (currency === "USD") {
      setAccountDetails(USDAccountDetails);
    }
  }, []);

  const rate = rates?.find((item) => item.currency === currency)?.rate;

  const handleChange = (e) => {
    setAmount(e.target.value);
  };

  const generateAccount = () => {
    if (amount >= 10) {
      setIsLoading(true);
      setIsModalOpen(true);

      setTimeout(() => setIsLoading(false), 5000);
    } else {
      toast.error("Minimum amount is 10");
    }
  };

  console.log(currency);
  return (
    <div className="md:w-3/4 mx-auto">
      <h2 className="my-5 text-silver text-2xl text-center">Bank Transfer</h2>
      <div
        className="p-4 rounded-lg"
        style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
      >
        <h3 className="text-silver font-medium text-lg text-center">
          USD to NGN
        </h3>
        <div className="mx-auto flex flex-col gap-7 my-5  w-3/4 md:w-1/2">
          <div className="">
            <input
              placeholder="Enter Amount"
              type="email"
              name="email"
              onChange={handleChange}
              //   onBlur={formik.handleBlur}
              value={amount}
              className={`mt-1 p-2 h-[40px] block w-full rounded-md  shadow-sm bg-lightBG text-silver fcous:border-green-500`}
              required
            />
            <div className="text-silver my-3">
              <div className="flex justify-between items-center ">
                <p>Exchange Rate:</p>
                <p>{rate && amountFormatter.format(rate)}</p>
              </div>

              {amount > 0 && (
                <div className="flex justify-between items-center">
                  <p>Amount to be paid:</p>
                  <p>{amountFormatter.format(rate * amount)}</p>
                </div>
              )}
            </div>
          </div>
          <AppButton onClick={generateAccount}>
            Generate Payment Details
          </AppButton>
        </div>
      </div>
      <CenterModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={"Account Details"}
      >
        {isLoading ? (
          <DotLottieReact
            src="https://lottie.host/0580d289-fb1a-4cc9-a4b7-e34bd3b9dd2a/70So9CEm58.lottie"
            loop
            autoplay
          />
        ) : (
          <div className="bg-white bg-opacity-20 rounded-lg p-4 mb-4">
            {currency === "USD" ? (
              <>
                <DetailRow
                  label="Account Holder"
                  value={accountDetails?.accountName}
                />
                <DetailRow
                  label="Account Number"
                  value={accountDetails?.accountNo}
                />
                <DetailRow
                  label="Routing Number"
                  value={accountDetails?.accountType}
                />
                <DetailRow
                  label="Bank Name"
                  value={accountDetails?.bankName}
                />
                <DetailRow
                  label="Account Type"
                  value={accountDetails?.address}
                />
              </>
            ) : (
              <>
                <DetailRow
                  label="Account Holder"
                  value={accountDetails?.account_holder}
                />
                <DetailRow
                  label="IBAN"
                  value={accountDetails?.iban}
                />
                <DetailRow
                  label="BIC Code"
                  value={accountDetails?.swift_code}
                />
                <DetailRow
                  label="Sort Code"
                  value={accountDetails?.sort_code}
                />
              </>
            )}
          </div>
        )}
      </CenterModal>
    </div>
  );
};

export default BankTransfer;

const DetailRow = ({ label, value }) => (
  <div className="flex justify-between items-center mb-3">
    <span className="text-primary opacity-70">{label}:</span>
    <span className="text-primary font-bold text-right ml-4 truncate">
      {value}
    </span>
  </div>
);
