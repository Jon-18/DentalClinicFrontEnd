import { useEffect, useState } from "react";
import Table from "../Table";

const ConsultationHistory = () => {
  const columns = [
    { key: "appointmentDate", header: "Date" },
    { key: "fullName", header: "Patient Name" },
    { key: "services", header: "Services" },
    { key: "doctorName", header: "Dentist" },
    { key: "notes", header: "Notes" },
  ];

  const [appointments, setAppointments] = useState([]);
  const [search] = useState("");

  // Fetch appointments
  const fetchAppointments = () => {
    fetch("http://localhost:5000/api/appointments")
      .then((res) => res.json())
      .then((data) => setAppointments(data))
      .catch((err) => console.error("Appointment fetch error:", err));
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // Filter by patient name
  const filteredAppointments = appointments.filter((appt) =>
    appt.fullName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ width: "90%", margin: "0 auto" }}>

      <Table
        title="Patient History"
        columns={columns}
        data={filteredAppointments}
      />
    </div>
  );
};

export default ConsultationHistory;
