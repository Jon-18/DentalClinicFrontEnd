import { useEffect, useState } from "react";

export default function AdminAppointmentRequests() {
  const [appointments, setAppointments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedApptId, setSelectedApptId] = useState(null);
  const [reason, setReason] = useState("");

  // Fetch appointments
  const fetchAppointments = async () => {
    try {
      const res = await fetch(
        "https://dentalclinicbackend-1qfr.onrender.com/api/appointments",
      );
      const data = await res.json();
      setAppointments(data);
    } catch (err) {
      console.error("Appointment fetch error:", err);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  // Approve / Deny action
  const updateStatus = async (id, status, reason = "") => {
    try {
      const res = await fetch(
        `https://dentalclinicbackend-1qfr.onrender.com/api/appointmentAdmin/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status, reason }),
        },
      );

      if (!res.ok) throw new Error("Failed to update");

      // 🔥 Instant UI update (removes from Pending list)
      setAppointments((prev) => prev.filter((appt) => appt.id !== id));

      // Optional: re-fetch to stay in sync with backend
      await fetchAppointments();
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  return (
    <div className="table-container">
      <h2 className="table-title">Appointment Requests</h2>

      <table className="table">
        <thead>
          <tr>
            <th>Full Name</th>
            <th>Contact Number</th>
            <th>Email</th>
            <th>Dentist</th>
            <th>Date</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Payment</th>
            <th>Receipt</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {appointments
            .filter((appt) => appt.status === "Pending")
            .map((appt) => (
              <tr key={appt.id}>
                <td>{appt.fullName}</td>
                <td>{appt.contactNumber}</td>
                <td>{appt.email}</td>
                <td>{appt.doctorName}</td>
                <td>{appt.Date}</td>
                <td>{appt.startTime}</td>
                <td>{appt.endTime}</td>
                <td>{appt.paymentMethod}</td>

                <td>
                  {appt.receiptPath ? (
                    <a
                      href={appt.receiptPath}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "#0077cc" }}
                    >
                      View
                    </a>
                  ) : (
                    "None"
                  )}
                </td>

                <td style={{ fontWeight: "bold" }}>{appt.status}</td>

                <td>
                  <button
                    onClick={() => {
                      const confirmed = window.confirm(
                        "Are you sure you want to approve this appointment?",
                      );
                      if (confirmed) {
                        updateStatus(appt.id, "Approved by Admin");
                      }
                    }}
                    style={{
                      background: "#4caf50",
                      color: "#fff",
                      border: "none",
                      padding: "5px 10px",
                      marginRight: "5px",
                      marginBottom: "5px",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "16px",
                      fontWeight: "bold",
                    }}
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => {
                      setSelectedApptId(appt.id);
                      setIsModalOpen(true);
                    }}
                    style={{
                      background: "#e53935",
                      color: "#fff",
                      border: "none",
                      padding: "5px 10px",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "16px",
                      fontWeight: "bold",
                    }}
                  >
                    Deny
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {/* Modal */}
      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "30px",
              borderRadius: "8px",
              width: "550px",
            }}
          >
            <h3>Deny Appointment</h3>

            <textarea
              placeholder="Reason for denial"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              style={{
                width: "100%",
                marginBottom: "10px",
                borderRadius: "10px",
                padding: "10px 5px",
              }}
            />

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
              }}
            >
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setReason("");
                }}
                style={{
                  padding: "10px",
                  background: "red",
                  color: "white",
                  border: "none",
                  borderRadius: "10px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  await updateStatus(selectedApptId, "Denied by Admin", reason);
                  setIsModalOpen(false);
                  setReason("");
                }}
                style={{
                  padding: "10px",
                  background: "blue",
                  color: "#fff",
                  border: "none",
                  borderRadius: "10px",
                  cursor: "pointer",
                }}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
