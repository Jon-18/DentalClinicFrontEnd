import { Navigate, useParams } from "react-router-dom";


const ProtectedRoute = ({ children, allowedRole }) => {
const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user"));
const { id } = useParams();


if (!token || !user) return <Navigate to="/login" replace />;
if (user.role !== allowedRole) return <Navigate to="/403" replace />;
if (String(user.id) !== String(id)) return <Navigate to="/403" replace />;


return children;
};


export default ProtectedRoute;