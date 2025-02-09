import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// import { useAuth } from "../../contexts/authContext";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useAuth } from "../../contexts/authContext";

const UserLogin = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { userLogin } = useAuth();
  const navigate = useNavigate();

  // Formik setup with initial values, validation schema, and submit handler
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Required"),
      password: Yup.string().required("Required"),
    }),
    onSubmit: async (values) => {
      setError("");
      setLoading(true);
      try {
        await userLogin(values.email, values.password);
        navigate("/user/dashboard");
        toast.success("Login Successful");
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="flex flex-1 h-screen  justify-center items-center">
      <div className="bg-lightBG  mx-auto px-[20px] p-6 rounded-lg shadow-md mt-[40px] w-[3/4] md:w-1/2">
        <h2 className="text-2xl text-center font-bold mb-6 text-silver">
          Login to your account
        </h2>

        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <form
          onSubmit={formik.handleSubmit}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-silver">
              Email
            </label>
            <input
              type="email"
              name="email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              className={`mt-1 p-2 h-[40px] block w-full rounded-md border shadow-sm ${
                formik.touched.email && formik.errors.email
                  ? "border-red-500"
                  : ""
              }`}
              required
            />
            {formik.touched.email && formik.errors.email ? (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.email}
              </div>
            ) : null}
          </div>

          <div>
            <label className="block text-sm font-medium text-silver">
              Password
            </label>
            <input
              type="password"
              name="password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
              className={`mt-1 p-2 h-[40px] block w-full rounded-md border shadow-sm ${
                formik.touched.password && formik.errors.password
                  ? "border-red-500"
                  : ""
              }`}
              required
            />
            {formik.touched.password && formik.errors.password ? (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.password}
              </div>
            ) : null}
          </div>

          <button
            type="submit"
            disabled={loading || !formik.isValid}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="text-center my-4 text-silver">
          Don't have an account?{" "}
          <span
            className="text-secondary cursor-pointer"
            onClick={() => navigate("/user/register")}
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
};

export default UserLogin;
