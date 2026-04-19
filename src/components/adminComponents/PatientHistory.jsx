import { useEffect, useState } from "react";
import Table from "../Table";

const PatientHistory = () => {
  const columns = [
    { key: "appointmentDate", header: "Date" },
    { key: "fullName", header: "Patient Name" },
    { key: "service_id", header: "Services" },
    { key: "doctorName", header: "Dentist" },
    { key: "notes", header: "Notes" },
  ];

  const [appointments, setAppointments] = useState([]);
  const [search] = useState("");
  // const [services, setServices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  const fetchAppointments = () => {
    fetch("https://dentalclinicbackend-1qfr.onrender.com/api/appointments")
      .then((res) => res.json())
      .then((data) => setAppointments(data))
      .catch((err) => console.error("Appointment fetch error:", err));
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // Fetch Services
  // const fetchServices = () => {
  //   fetch("https://dentalclinicbackend-1qfr.onrender.com/api/services")
  //     .then((res) => res.json())
  //     .then((data) => setServices(data))
  //     .catch((err) => console.error("Appointment fetch error:", err));
  // };

  // const serviceMap = services.reduce((map, service) => {
  //   map[service._id] = service.name;
  //   return map;
  // }, {});

  // useEffect(() => {
  //   fetchServices();
  // }, []);

  // 🔍 Filter
  const filteredAppointments = appointments.filter((appt) =>
    appt.fullName?.toLowerCase().includes(search.toLowerCase()),
  );

  // 📄 Pagination logic
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;

  const currentAppointments = filteredAppointments.slice(
    indexOfFirst,
    indexOfLast,
  );

  // 💰 Total (ONLY current page)
  const total = currentAppointments.reduce((sum, appt) => {
    return sum + parseInt(appt.Price || 0, 10);
  }, 0);

  // 📊 Total number of pages
  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);
  return (
    <div style={{ width: "90%", margin: "0 auto" }}>
      <Table
        title="Patient History"
        columns={columns}
        data={currentAppointments}
      />

      {/* 💰 Total */}
      <div
        style={{
          width: "90%",
          margin: "20px auto",
          fontWeight: "bold",
          fontSize: "25px",
        }}
      >
        Total: ₱{total}
      </div>

      {/* 🔢 Pagination Buttons */}
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        {/* Prev */}
        <button
          onClick={() => setCurrentPage((prev) => prev - 1)}
          disabled={currentPage === 1}
          style={{
            margin: "5px",
            padding: "8px 12px",
            cursor: currentPage === 1 ? "not-allowed" : "pointer",
          }}
        >
          Prev
        </button>

        {/* Page Numbers */}
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            style={{
              margin: "5px",
              padding: "8px 12px",
              background: currentPage === i + 1 ? "#333" : "#ccc",
              color: "#fff",
              border: "none",
              cursor: "pointer",
            }}
          >
            {i + 1}
          </button>
        ))}

        {/* Next */}
        <button
          onClick={() => setCurrentPage((prev) => prev + 1)}
          disabled={currentPage === totalPages}
          style={{
            margin: "5px",
            padding: "8px 12px",
            cursor: currentPage === totalPages ? "not-allowed" : "pointer",
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PatientHistory;
