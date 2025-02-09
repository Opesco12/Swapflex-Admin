const AppButton = ({ children, onClick }) => {
  return (
    <button
      onClick={onClick}
      type="submit"
      //   disabled={loading || !formik.isValid}
      className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:opacity-50"
    >
      {children}
    </button>
  );
};

export default AppButton;
