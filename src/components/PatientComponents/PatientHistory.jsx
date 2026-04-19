import { useEffect, useState } from "react";
import Table from "../Table";

const Users = () => {
  const columns = [
    { key: "dateService", header: "Date" },
    { key: "fullname", header: "Full Name" },
    { key: "username", header: "Username" },
    { key: "serviceName", header: "Service" }, // ✅ use serviceName
    { key: "phoneNumber", header: "Phone Number" },
  ];

  const [users, setUsers] = useState([]);
  const [services, setServices] = useState([]);

  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => setUsers(data));

    fetch("/api/services")
      .then((res) => res.json())
      .then((data) => setServices(data));
  }, []);

  // ✅ create service map
  const serviceMap = Object.fromEntries(services.map((s) => [s.id, s.name]));

  // ✅ map users with service name
  const mappedData = users.map((user) => ({
    ...user,
    serviceName: serviceMap[user.service_id] || "Unknown Service",
  }));

  return (
    <div>
      <Table title="Your History" columns={columns} data={mappedData} />
    </div>
  );
};

export default Users;
