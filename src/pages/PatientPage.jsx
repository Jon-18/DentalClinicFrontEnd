import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BookAppointment from "../components/PatientComponents/BookAppointment";
import PatientHistory from "../components/PatientComponents/PatientHistory";
import PatientProfile from "../components/PatientComponents/PatientProfile";
import Sidebar from "../components/Sidebar";

const PatientPage = () => {
  const [activePage, setActivePage] = useState("book-appointment");
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

  const patientLinks = [
    { label: "Book Schedule", key: "book-appointment" },
    { label: "Patient History", key: "patient-history" },
    { label: "Profile", key: "profile" },
    { label: "Logout", key: "logout" },
  ];

  const renderContent = () => {
    switch (activePage) {
      case "book-appointment":
        return <BookAppointment />;
      case "patient-history":
        return <PatientHistory />;
      case "profile":
        return <PatientProfile />;
      default:
        return <BookAppointment />;
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar
        title="Customer Panel"
        links={patientLinks}
        onLinkClick={(key) => {
          if (key === "logout") {
            logout();
          } else {
            setActivePage(key);
          }
        }}
      />
      <main className="dashboard-content">{renderContent()}</main>
    </div>
  );
};

export default PatientPage;
