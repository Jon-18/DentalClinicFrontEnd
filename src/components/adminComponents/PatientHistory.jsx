import { useEffect, useState } from "react";
import Table from "../Table";

const Users = () => {
  const columns = [
    { key: "dateService", header: "Date" },
    { key: "fullname", header: "Full Name" },
    { key: "username", header: "Username" },
    { key: "serviceName", header: "Service" }, // ✅ mapped field
    { key: "phoneNumber", header: "Phone Number" },
  ];

  const [users, setUsers] = useState([]);
  const [services, setServices] = useState([]);
  const [search, setSearch] = useState("");

  // ✅ Fetch Users
  const fetchUsers = () => {
    fetch("https://dentalclinicbackend-1qfr.onrender.com/api/users") // change if needed
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error("User fetch error:", err));
  };

  // ✅ Fetch Services
  const fetchServices = () => {
    fetch("https://dentalclinicbackend-1qfr.onrender.com/api/services")
      .then((res) => res.json())
      .then((data) => setServices(data))
      .catch((err) => console.error("Service fetch error:", err));
  };

  useEffect(() => {
    fetchUsers();
    fetchServices();
  }, []);

  // ✅ Create a fast lookup map (id → name)
  const serviceMap = Object.fromEntries(services.map((s) => [s.id, s.name]));

  // ✅ Filter (optional search)
  const filteredUsers = users.filter((user) =>
    user.fullname?.toLowerCase().includes(search.toLowerCase()),
  );

  // ✅ Inject serviceName into each row
  const mappedData = filteredUsers.map((user) => ({
    ...user,
    serviceName: serviceMap[user.service_id] || "Unknown Service",
  }));

  return (
    <div style={{ width: "90%", margin: "0 auto" }}>
      <h2>Your History</h2>

      {/* Optional search input */}
      <input
        type="text"
        placeholder="Search by name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: "10px", padding: "5px", width: "200px" }}
      />

      <Table title="User History" columns={columns} data={mappedData} />
    </div>
  );
};

export default Users;
