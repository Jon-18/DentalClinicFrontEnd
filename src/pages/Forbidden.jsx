const Forbidden = () => {
  return (
    <div style={{ textAlign: "center", padding: "40px" }}>
      <h1>403 - Forbidden</h1>
      <p>You do not have permission to access this page.</p>
      <a href="/login">Go back to Login</a>
    </div>
  );
};

export default Forbidden;
