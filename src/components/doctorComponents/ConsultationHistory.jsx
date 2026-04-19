import { useEffect, useState } from "react";
import Table from "../Table";

const ConsultationHistory = () => {
  const columns = [
    { key: "appointmentDate", header: "Date" },
    { key: "fullName", header: "Patient Name" },
    { key: "serviceName", header: "Services" },
    { key: "doctorName", header: "Dentist" },
    { key: "notes", header: "Notes" },
  ];

  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);
  const [search] = useState("");

  // Fetch appointments
  const fetchAppointments = () => {
    fetch("https://dentalclinicbackend-1qfr.onrender.com/api/appointments")
      .then((res) => res.json())
      .then((data) => setAppointments(data))
      .catch((err) => console.error("Appointment fetch error:", err));
  };

  // Fetch Services
  const fetchServices = () => {
    fetch("https://dentalclinicbackend-1qfr.onrender.com/api/services")
      .then((res) => res.json())
      .then((data) => setServices(data))
      .catch((err) => console.error("Appointment fetch error:", err));
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    fetchServices();
  }, []);

  // Filter by patient name
  const filteredAppointments = appointments.filter((appt) =>
    appt.fullName?.toLowerCase().includes(search.toLowerCase()),
  );

  const mappedAppointments = filteredAppointments.map((appt) => {
    const service = services.find((s) => s.id === appt.service_id);

    return {
      ...appt,
      serviceName: service ? service.name : "Unknown Service",
    };
  });

  return (
    <div style={{ width: "90%", margin: "0 auto" }}>
      <Table
        title="Patient History"
        columns={columns}
        data={mappedAppointments}
      />
    </div>
  );
};

export default ConsultationHistory;
