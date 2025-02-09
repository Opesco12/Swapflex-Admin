import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";

import { AuthProvider } from "./contexts/authContext";
import { DataProvider } from "./contexts/DataContext";

import AdminLogin from "./screens/admin/adminLogin";
import Admin from "./screens/admin/admin";
import { AdminProtectedRoute } from "./components/AdminProtectedRoute";
import { ProtectedRoute } from "./components/UserProtectedRoute";
import NotFound from "./screens/NotFound";
import UserLogin from "./screens/user/userLogin";
import Register from "./screens/user/Register";
import Dashboard from "./screens/user/Dashboard";
import USDPaymentMethods from "./screens/USDPaymentMethods";
import Profile from "./screens/user/Profile";
import BankTransfer from "./screens/BankTransfer";
import ApplePay from "./screens/user/USD payment methods/Apple_pay";

function App() {
  return (
    <div className="min-h-screen px-[20px] max-w-[920px] mx-auto py-4">
      <AuthProvider>
        <DataProvider>
          <Router>
            <Routes>
              <Route
                path="/"
                element={
                  <Navigate
                    replace
                    to={"/user/dashboard"}
                  />
                }
              />

              <Route
                path="/admin/login"
                element={<AdminLogin />}
              />

              <Route
                path="/admin/dashboard"
                element={
                  <AdminProtectedRoute>
                    <Admin />
                  </AdminProtectedRoute>
                }
              />

              <Route path="/user">
                <Route
                  path=""
                  element={
                    <Navigate
                      replace
                      to={"/user/dashboard"}
                    />
                  }
                />
                <Route
                  path="login"
                  element={<UserLogin />}
                />
                <Route
                  path="register"
                  element={<Register />}
                />

                <Route
                  path="dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="profile"
                  element={<Profile />}
                />

                <Route
                  path="usd-payment-methods"
                  element={
                    <ProtectedRoute>
                      <USDPaymentMethods />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path=":currency/bank-transfer"
                  element={
                    <ProtectedRoute>
                      <BankTransfer />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="usd/apple-pay"
                  Component={ApplePay}
                />
              </Route>

              <Route
                path="/404"
                element={<NotFound />}
              />

              <Route
                path="*"
                element={<Navigate to={"/404"} />}
              />
            </Routes>
          </Router>
        </DataProvider>
      </AuthProvider>
      <ToastContainer />
    </div>
  );
}

export default App;
