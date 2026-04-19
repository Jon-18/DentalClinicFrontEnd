import Table from "../Table";
import { useEffect, useState } from "react";

const Users = () => {
  const [appointments, setAppointments] = useState([]);

  const columns = [
    { key: "createdAt", header: "Date" },
    { key: "fullName", header: "Full Name" },
    { key: "email", header: "Username" },
    { key: "service_name", header: "Service" },
    { key: "contactNumber", header: "Phone Number" },
  ];
  const fetchAppointmentsHistory = async (user_id) => {
    try {
      const res = await fetch(
        `https://dentalclinicbackend-1qfr.onrender.com/api/patientHistoryId?user_id=${user_id}`,
      );
      const data = await res.json();
      console.log(data);

      setAppointments(data);
    } catch (err) {
      console.error("Appointment fetch error:", err);
    }
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    console.log(user.id);
    if (user?.id) {
      fetchAppointmentsHistory(user.id);
    }
  }, []);

  return (
    <div>
      <Table title="Your History" columns={columns} data={appointments} />
    </div>
  );
};

export default Users;
