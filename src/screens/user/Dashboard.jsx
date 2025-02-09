import { User } from "iconsax-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };
  return (
    <div>
      <h2 className="text-silver font-medium text-2xl my-3 bg-lightBG py-4 px-2">
        SwapFlex
      </h2>
      <div className="flex justify-between items-center my-5">
        <h2 className="text-silver font-medium text-2xl">Hello,</h2>

        <User
          size={32}
          className="text-silver cursor-pointer"
          onClick={() => handleNavigation("/user/profile")}
        />
      </div>

      <div>
        <h3 className="text-silver font-medium text-lg">Services</h3>
        <div className="flex justify-between flex-wrap">
          <div className="bg-lightBG w-[150px] h-[150px] rounded-lg flex flex-col items-center justify-center cursor-pointer">
            <p className="text-silver">Crypto Exchange</p>
          </div>
          <div className="bg-lightBG w-[150px] h-[150px] rounded-lg flex flex-col items-center justify-center cursor-pointer">
            <p className="text-silver">Gift Card</p>
          </div>
          <div
            className="bg-lightBG w-[150px] h-[150px] rounded-lg flex flex-col items-center justify-center cursor-pointer"
            onClick={() => handleNavigation("/user/usd-payment-methods")}
          >
            <p className="text-silver">USD to NGN</p>
          </div>
          <div className="bg-lightBG w-[150px] h-[150px] rounded-lg flex flex-col items-center justify-center cursor-pointer">
            <p className="text-silver">Eur to NGN</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
