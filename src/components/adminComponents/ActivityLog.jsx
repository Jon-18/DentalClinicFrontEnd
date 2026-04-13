import Table from "../Table";

const ActivityLog = () => {
  const columns = [
    { key: "dateBooked", header: "Date" },
    { key: "role", header: "Role" },
    { key: "fullname", header: "Full Name" },
    { key: "username", header: "Username" },
    { key: "email", header: "Email" },
    { key: "phoneNumber", header: "Phone Number" },
  ];

  const data = [
    {
      dateBooked: "2025-10-22",
      role : "admin",
      fullname: "Admin",
      username: "Admin",
      email: "admin@gmail.com",
      phoneNumber: "09123456789",
    }
  ];

  return (
    <div>
      <Table title="Audit Trail" columns={columns} data={data} />
    </div>
  );
};

export default ActivityLog;
