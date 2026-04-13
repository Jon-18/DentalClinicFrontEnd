import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../style/components/forgotpassword.css";
import Footer from "./Footer";
import Navbar from "./NavbarHeader";

function ResetPassword() {
  const { token } = useParams(); // token comes from URL: /reset-password/:token
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    // Frontend password validation
    if (password.length < 6) {
      setMessage("⚠️ Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("❌ Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Password reset successful! Redirecting to login...");
        setTimeout(() => navigate("/login"), 2000); // Redirect after 2 seconds
      } else {
        setMessage(data.message || "❌ Error resetting password.");
      }
    } catch (error) {
      console.error(error);
      setMessage("⚠️ Something went wrong. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="reset-container">
        <h2>Reset Password</h2>
        <form onSubmit={handleSubmit} className="reset-form">
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
        {message && (
          <p
            className={`message ${
              message.includes("✅") ? "success" : "error"
            }`}
            role="alert"
          >
            {message}
          </p>
        )}
        <a href="/login" className="back-link">
          ← Back to Login
        </a>
      </div>
      <Footer />
    </>
  );
}

export default ResetPassword;
