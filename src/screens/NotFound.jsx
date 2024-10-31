import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="h-screen  max-w-[920px] mx-auto flex flex-col items-center justify-center">
      <h3 className="text-2xl font-semibold mb-[30px]">Page not found</h3>
      <button
        // type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={() => navigate("/")}
      >
        Go to HomePage
      </button>
    </div>
  );
};

export default NotFound;
