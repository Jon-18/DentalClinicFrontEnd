import { useEffect, useState } from "react";
import TableForm from "../TableForm";

const DentistRegistration = () => {
  const [dentists, setDentists] = useState([]);
  const [error, setError] = useState("");
  const [success] = useState("");

  const columns = [
    "Full Name",
    "Email",
    "Phone",
    "Specialization",
    "Experience (Years)",
    "License No.",
    "Address",
  ];
  

  const rowTemplate = {
    name: { value: "", type: "text" },
    email: { value: "", type: "email" },
    phone: { value: "", type: "text", pattern: "\\d{11}", maxLength: 11 },
    specialization: { value: "", type: "text" },
    experience: { value: "", type: "number", min: 0 },
    licenseNumber: { value: "", type: "text" },
    address: { value: "", type: "text" },
  };

  // ✅ Validation
  // const validateDentist = (dentist) => {
  //   if (
  //     !dentist.name ||
  //     !dentist.email ||
  //     !dentist.phone ||
  //     !dentist.specialization ||
  //     !dentist.experience ||
  //     !dentist.licenseNumber
  //   ) {
  //     return "All fields are required.";
  //   }

  //   if (dentist.experience < 0) {
  //     return "Experience cannot be negative.";
  //   }

  //   if (dentist.licenseNumber < 0) {
  //     return "License Number cannot be negative.";
  //   }

  //   const phoneRegex = /^\d{11}$/;
  //   if (!phoneRegex.test(dentist.phone)) {
  //     return "Phone number must be 11 digits.";
  //   }
  //   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //   if (!emailRegex.test(dentist.email)) {
  //     return "Invalid email format.";
  //   }
  //   return null;
  // };

  // ✅ Fetch all dentists on load
  useEffect(() => {
    const fetchDentists = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/dentists",
        );
        const data = await response.json();
        setDentists(data);
      } catch (err) {
        console.error("Error fetching dentists:", err);
        setError("Failed to fetch dentist data.");
      }
    };
    fetchDentists();
  }, []);

  // ✅ Handle form submission
  const handleSubmit = async (dentist, isEdit = false, id = null) => {
  try {
    const url = isEdit
      ? `http://localhost:5000/api/dentists/${id}`
      : "http://localhost:5000/api/dentists";

    const method = isEdit ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dentist),
    });

    const data = await res.json();

    if (res.ok) {
      if (!isEdit) {
        setDentists((prev) => [...prev, { ...dentist, id: data.id }]);
      } else {
        setDentists((prev) =>
          prev.map((d) => (d.id === id ? { ...dentist, id } : d))
        );
      }

      return { success: true };
    } else {
      return { success: false, message: data.message };
    }
  } catch {
    return { success: false, message: "Server error" };
  }
};

  const handleDeleteDentist = async (id) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/dentists/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await res.json();

      if (res.ok) {
        setDentists((prev) => prev.filter((d) => d.id !== id));
      } else {
        setError(data.message || "Delete failed");
      }
    } catch (err) {
      console.error(err);
      setError("Server error");
    }
  };

  return (
    <div>
      {error && (
        <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>
      )}
      {success && (
        <div style={{ color: "green", marginBottom: "10px" }}>{success}</div>
      )}

      <TableForm
        title="Dentist Management"
        columns={columns}
        data={dentists}
        setData={setDentists}
        rowTemplate={rowTemplate}
        onSave={handleSubmit}
         onDelete={handleDeleteDentist}
      />
    </div>
  );
};

export default DentistRegistration;
