import {
  Apple,
  ArrowCircleRight,
  Bank,
  Paypal,
  Thorchain,
} from "iconsax-react";
import { useNavigate } from "react-router-dom";

const USDPaymentMethods = () => {
  return (
    <div className="">
      <h3 className="text-silver font-medium text-lg my-5">Payment Methods</h3>

      <div className="bg-lightBG p-5 rounded-lg">
        <Listing
          leftIcon={
            <Bank
              size={32}
              className="text-silver"
            />
          }
          name={"Bank Transfer"}
          navigateTo={"/user/USD/bank-transfer"}
        />

        <Listing
          leftIcon={
            <Apple
              size={32}
              className="text-silver"
            />
          }
          name={"Apple Pay"}
          navigateTo={"/user/usd/apple-pay"}
        />

        <Listing
          leftIcon={
            <Paypal
              size={32}
              className="text-silver"
            />
          }
          name={"Paypal"}
        />
        <Listing
          leftIcon={
            <Thorchain
              size={32}
              className="text-silver"
            />
          }
          name={"Zelle"}
        />
      </div>
    </div>
  );
};

export default USDPaymentMethods;

const Listing = ({ leftIcon, name, navigateTo }) => {
  const navigate = useNavigate();
  return (
    <div
      className="flex justify-between items-center p-4 rounded cursor-pointer hover:bg-primary"
      onClick={() => navigate(navigateTo)}
    >
      <div className="flex justify-between items-center gap-4">
        {leftIcon}
        <p className="text-silver text-lg">{name}</p>
      </div>
      <ArrowCircleRight
        size={32}
        className="text-silver"
      />
    </div>
  );
};
