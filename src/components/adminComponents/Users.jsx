import { useEffect, useState } from "react";
import Table from "../Table";

const Users = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  const columns = [
    { key: "created_at", header: "Date Registered" },
    { key: "fullname", header: "Full Name" },
    { key: "username", header: "Username" },
    { key: "email", header: "Email" },
    { key: "role", header: "Role" },
  ];

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          "https://dentalclinicbackend-1qfr.onrender.com/api/users",
        );
        const users = await response.json();
        setData(users);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  // 📄 Pagination logic
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;

  const currentUsers = data.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  return (
    <div style={{ width: "90%", margin: "0 auto" }}>
      <Table title="User Accounts" columns={columns} data={currentUsers} />

      {/* 🔢 Pagination */}
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

export default Users;
