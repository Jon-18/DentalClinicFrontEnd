import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ConsultationHistory from "../components/doctorComponents/ConsultationHistory.jsx";
import DoctorApproval from "../components/doctorComponents/DoctorApproval.jsx";
import DoctorCalendar from "../components/doctorComponents/DoctorCalendar.jsx";
import Sidebar from "../components/Sidebar";

const DoctorPage  = () =>{
  const [activePage, setActivePage] = useState("create-doctor");
  const navigate = useNavigate();
  const logout = async () => {
    try {
      await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("role");

      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

    const doctorLinks = [
    { label: "Clinic Schedule", key: "clinic-schedule" },
    { label: "Consultation History", key: "consultation-history" },
    { label: "Doctor Approval", key: "doctor-approval" },
    { label: "Logout", key: "logout" },
  ];

    const renderContent = () => {
    switch (activePage) {
      case "logout":
        return logout();
      case "doctor-approval":
        return <DoctorApproval />
      case "consultation-history":
        return <ConsultationHistory />
      case "clinic-schedule":
        return <DoctorCalendar />
      default:
        return <DoctorCalendar />
    }
  };
  return (
    <>
      <div>
        <div className="dashboard-layout">
          <Sidebar 
            title="Doctor Panel" 
            links={doctorLinks}
            onLinkClick={(key) => setActivePage(key)} 
          />
          <main className="dashboard-content">
            {renderContent()}
          </main>
        </div>
      </div>
    </>
  )
}
  
export default DoctorPage ;
