import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import ForgotPassword from "./components/ForgotPassword";
import ProtectedRoute from "./components/ProtectedRoute";
import ResetPassword from "./components/ResetPassword";
import AdminPage from "./pages/AdminPage";
import DoctorPage from "./pages/DoctorPage";
import Forbidden from "./pages/Forbidden";
import Home from "./pages/Home";
import Login from "./pages/Login";
import PatientPage from "./pages/PatientPage";



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />


        <Route
        path="/admin/:id"
        element={
        <ProtectedRoute allowedRole="admin">
        <AdminPage />
        </ProtectedRoute>
        }
        />


        <Route
        path="/doctor/:id"
        element={
        <ProtectedRoute allowedRole="doctor">
        <DoctorPage />
        </ProtectedRoute>
        }
        />


        <Route
        path="/patient/:id"
        element={
        <ProtectedRoute allowedRole="patient">
        <PatientPage />
        </ProtectedRoute>
        }
        />


        <Route path="/403" element={<Forbidden />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
      </Routes>
    </Router>
  );
}


export default App;