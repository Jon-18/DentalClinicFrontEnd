import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import AddClinicServices from "../components/adminComponents/AddClinicServices.jsx";
import AdminApproval from "../components/adminComponents/AdminApproval.jsx";
import AdminCalendar from "../components/adminComponents/AdminCalendar.jsx";
import DentistRegistration from "../components/adminComponents/DentistRegistration.jsx";
import PatientHistory from "../components/adminComponents/PatientHistory.jsx";
import PaymentDashboard from "../components/adminComponents/PaymentDashboard.jsx";
import RegisterPatient from "../components/adminComponents/RegisterPatient.jsx";
import Users from "../components/adminComponents/Users.jsx";
import ClinicDashboard from "../components/ClinicDashboard.jsx";

import { useState } from "react";

const AdminPage = () => {
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await fetch(
        "https://dentalclinicbackend-1qfr.onrender.com/api/auth/logout",
        {
          method: "POST",
          credentials: "include",
        },
      );

      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("role");

      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };
  const [activePage, setActivePage] = useState("create-doctor");

  const adminLinks = [
    { label: "Clinic Dashboard", key: "clinic-dashboard" },
    { label: "Register New Patient", key: "register-patient" },
    { label: "Register New Dentist", key: "create-doctor" },
    { label: "Add Clinic & Services", key: "add-clinic" },
    { label: "Add Schedule", key: "add-schedule" },
    { label: "Patient History", key: "patient-history" },
    { label: "Users", key: "users" },
    { label: "Admin Approval", key: "admin-approval" },
    // { label: "Payment Dashboard", key: "payments" },
    { label: "Logout", key: "logout" },
  ];

  const renderContent = () => {
    switch (activePage) {
      case "clinic-dashboard":
        return <ClinicDashboard />;
      case "create-doctor":
        return <DentistRegistration />;
      case "register-patient":
        return <RegisterPatient />;
      case "add-clinic":
        return <AddClinicServices />;
      case "add-schedule":
        return <AdminCalendar />;
      case "patient-history":
        return <PatientHistory />;
      case "users":
        return <Users />;
      case "payments":
        return <PaymentDashboard />;
      case "admin-approval":
        return <AdminApproval />;
      case "logout":
        return logout();
      default:
        <AdminApproval />;
    }
  };

  return (
    <>
      <div>
        <div className="dashboard-layout">
          <Sidebar
            title="Admin Panel"
            links={adminLinks}
            onLinkClick={(key) => setActivePage(key)}
          />
          <main className="dashboard-content">{renderContent()}</main>
        </div>
      </div>
    </>
  );
};

export default AdminPage;
