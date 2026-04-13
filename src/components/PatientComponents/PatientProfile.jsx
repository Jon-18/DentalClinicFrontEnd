import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import ProfileBase from "../Profile";

export default function PatientProfile() {
  const [patientUser, setPatientUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const userId = user?.id;

  // ==================== LOAD PROFILE ====================
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/profile/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!res.ok) {
          const text = await res.text();
          throw new Error(text);
        }

        const data = await res.json();
        setPatientUser(data);
      } catch (err) {
        console.error("❌ Fetch Profile Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId, token]);

  // ==================== SAVE PROFILE ====================
  const handleSave = async (updatedData) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/profile/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedData),
        },
      );

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
      }

      const data = await res.json();
      setPatientUser(data.user);
      toast.success("Profile updated!");
    } catch (err) {
      console.error("❌ Update Profile Error:", err);
      toast.error("Failed to update profile");
    }
  };

  if (loading) return <p>Loading profile...</p>;
  if (!patientUser) return <p>Failed to load profile.</p>;

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        theme="colored"
      />
      <ProfileBase
        user={patientUser}
        editableFields={["fullName", "username", "email", "phone", "address"]}
        onSave={handleSave}
      />
    </>
  );
}
