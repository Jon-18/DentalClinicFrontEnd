import { useEffect, useState } from "react";
import TableForm from "../TableForm";

const RegisterPatient = () => {
  const [patients, setPatients] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const columns = [
    "Full Name",
    "Date of Birth",
    "Gender",
    "Email",
    "Cellphone No.",
    "address",
    
  ];

  const [search] = useState("");

  const rowTemplate = {
    fullName: { value: "", type: "text" },
    dateOfBirth: { value: "", type: "date" },
    gender: { value: "", type: "select", options: ["Male", "Female"] },
    email: { value: "", type: "email" },
    cellphone: { value: "", type: "text", pattern: "\\d{11}", maxLength: 11 },
    address: { value: "", type: "text" },
  };

  const validatePatient = (patient) => {
    if (
      !patient.fullName ||
      !patient.dateOfBirth ||
      !patient.gender ||
      !patient.email ||
      (!patient.cellphone && patient.dateOfBirth < 2026)
    ) {
      return "All fields are required.";
    }

    if (patient.dateOfBirth) {
      const birthYear = new Date(patient.dateOfBirth).getFullYear();
      if (birthYear >= 2026) {
        return `Patient born in ${birthYear} or earlier. Eligibility: 2025 and below.`;
      }
    }

    const phoneRegex = /^\d{11}$/;
    if (!phoneRegex.test(patient.cellphone)) {
      return "Cellphone must be 11 digits.";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(patient.email)) {
      return "Invalid email format.";
    }
    return null;
  };

  // ✅ Load all patients on mount
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/patients",
        );
        const data = await res.json();
        setPatients(data);
      } catch (err) {
        console.error("Error fetching patients:", err);
        setError("Cannot fetch patients from the server.");
      }
    };
    fetchPatients();
  }, []);

  const handleSubmit = async (patient) => {
    setError("");
    setSuccess("");

    const validationError = validatePatient(patient);
    if (validationError) {
      setError(validationError);
      return { success: false, message: validationError };
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/patients",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(patient),
        },
      );

      const data = await response.json();

      if (response.ok) {
        setPatients((prev) => [...prev, { ...patient, id: data.id }]);
        setSuccess("✅ Patient registered successfully!");
        return { success: true };
      } else {
        setError(data.message || "Error registering patient.");
        return {
          success: false,
          message: data.message || "Error registering patient.",
        };
      }
    } catch (err) {
      console.error("❌ Network Error:", err);
      setError(
        "Cannot connect to the server. Please make sure the backend is running.",
      );
      return { success: false, message: err.message };
    }
  };

  const filteredPatients = patients.filter((appt) =>
    appt.fullName?.toLowerCase().includes(search.toLowerCase())
  );

  const handleDeletePatient = async (id) => {
    
    try {
      const res = await fetch(
        `http://localhost:5000/api/patients/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await res.json();

      if (res.ok) {
        setPatients((prev) => prev.filter((d) => d.id !== id));
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
        title="Register New Patient"
        columns={columns}
        data={patients || filteredPatients}
        setData={setPatients}
        rowTemplate={rowTemplate}
        onDelete={handleDeletePatient}
        onSave={handleSubmit}
        searchable = {true}
      />
    </div>
  );
};

export default RegisterPatient;
