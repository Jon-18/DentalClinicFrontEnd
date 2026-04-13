import { useEffect, useState } from "react";
import TableForm from "../../TableForm";

const BranchRegistration = () => {
  const [branches, setBranches] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const columns = ["Branch Name", "Address", "Location", "Schedule"];

  const rowTemplate = {
    name: { value: "", type: "text" },
    address: { value: "", type: "text" },
    location: { value: "", type: "text" },
    schedule: {
      value: "",
      type: "select",
      options: ["Mon to Sun: 10am – 6pm", "Mon to Sun: 9am – 5pm"],
    },
  };

  const validateBranch = (branch) => {
    if (
      !branch.name ||
      !branch.address ||
      !branch.location ||
      !branch.schedule
    ) {
      return "All fields are required.";
    }
    return null;
  };

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await fetch(
          "https://dentalclinicbackend-1qfr.onrender.com/api/branches",
        );
        const data = await response.json();
        setBranches(data);
      } catch (err) {
        console.error("Error fetching branches:", err);
        setError("Failed to fetch branches.");
      }
    };
    fetchBranches();
  }, []);

  const handleSubmit = async (branch) => {
    setError("");
    setSuccess("");

    const validationError = validateBranch(branch);
    if (validationError) {
      setError(validationError);
      return { success: false, message: validationError };
    }

    try {
      const response = await fetch(
        "https://dentalclinicbackend-1qfr.onrender.com/api/branches",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(branch),
        },
      );

      const data = await response.json();

      if (response.ok) {
        setBranches((prev) => [...prev, { ...branch, id: data.id }]);
        setSuccess("✅ Branch registered successfully!");
        return { success: true };
      } else {
        setError(data.message || "Error adding branch.");
        return { success: false };
      }
    } catch (err) {
      console.error("Network Error:", err);
      setError("Cannot connect to the server.");
      return { success: false };
    }
  };

  const handleDeleteBranch = async (id) => {
    try {
      const res = await fetch(
        `https://dentalclinicbackend-1qfr.onrender.com/api/branches/${id}`,
        {
          method: "DELETE",
        },
      );
      console.log(res);

      const data = await res.json();

      if (res.ok) {
        setBranches((prev) => prev.filter((d) => d.id !== id));
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
      {error && <div style={{ color: "red" }}>{error}</div>}
      {success && <div style={{ color: "green" }}>{success}</div>}
      <TableForm
        title="Clinic Branch Management"
        columns={columns}
        data={branches}
        setData={setBranches}
        rowTemplate={rowTemplate}
        onDelete={handleDeleteBranch}
        onSave={handleSubmit}
      />
    </div>
  );
};

export default BranchRegistration;
