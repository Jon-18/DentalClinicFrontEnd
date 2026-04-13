import { useState } from "react";
import "../style/components/forgotpassword.css";
import Footer from "./Footer";
import Navbar from "./NavbarHeader";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(
        "https://dentalclinicbackend-1qfr.onrender.com/api/auth/forgot-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        },
      );

      const data = await res.json();
      setMessage(data.message || "⚠️ Something went wrong.");
    } catch (err) {
      console.error(err);
      setMessage("⚠️ Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="reset-container">
        <h2>Forgot Password</h2>
        <form onSubmit={handleSubmit} className="reset-form">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
        {message && (
          <p className={message.includes("✅") ? "success" : ""}>{message}</p>
        )}
      </div>
      <Footer />
    </>
  );
}

export default ForgotPassword;
