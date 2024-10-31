import logo from "./logo.svg";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { AuthProvider } from "./contexts/authContext";

import Admin from "./screens/admin";
import AdminLogin from "./screens/Login";
import { ProtectedRoute } from "./components/ProtextedRoute";
import NotFound from "./screens/NotFound";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route
            path="/admin/login"
            element={<AdminLogin />}
          />

          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            }
          />

          <Route
            path="/404"
            element={<NotFound />}
          />

          <Route
            path="*"
            element={<Navigate to={"/404"} />}
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
