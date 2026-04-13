import React, { useEffect, useState, useCallback } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import "../style/components/dashboard.css";

export default function ClinicDashboard() {
  const [filter, setFilter] = useState("Monthly");
  const [data, setData] = useState({
    appointments: [],
    income: [],
  });
  const [loading, setLoading] = useState(false);
  const [dentistCount, setDentistCount] = useState(0);
  const [appointmentCount, setAppointmentCount] = useState(0);
  const [pendingAdmin, setPendingAdmin] = useState(0);
  const [patientsCount, setPatientsCount] = useState(0);

  // ✅ Fetch dashboard chart data
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `https://dentalclinicbackend-1qfr.onrender.com/api/getDataInDashboard/dashboard?filter=${filter}`,
      );
      const jsonData = await res.json();

      setData({
        appointments: jsonData.appointments || [],
        income: jsonData.income || [],
      });
    } catch (err) {
      setData({ appointments: [], income: [] });
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ✅ Fetch dentists
  const fetchAllDoctor = useCallback(async () => {
    try {
      const res = await fetch(
        "https://dentalclinicbackend-1qfr.onrender.com/api/dentists",
      );
      const jsonData = await res.json();
      setDentistCount(jsonData.length);
    } catch (err) {
      setDentistCount(0);
    }
  }, []);

  useEffect(() => {
    fetchAllDoctor();
  }, [fetchAllDoctor]);

  // ✅ Fetch patients
  const fetchAllPatients = useCallback(async () => {
    try {
      const res = await fetch(
        "https://dentalclinicbackend-1qfr.onrender.com/api/patients",
      );
      const jsonData = await res.json();
      setPatientsCount(jsonData.length);
    } catch (err) {
      setPatientsCount(0);
    }
  }, []);

  useEffect(() => {
    fetchAllPatients();
  }, [fetchAllPatients]);

  // ✅ Fetch appointments + pending count
  const fetchAllAppointment = useCallback(async () => {
    try {
      const res = await fetch(
        "https://dentalclinicbackend-1qfr.onrender.com/api/appointments",
      );
      const jsonData = await res.json();

      setAppointmentCount(jsonData.length);

      // ✅ FIXED: use filter instead of map
      const pendingCount = jsonData.filter(
        (item) => item.status === "Pending",
      ).length;

      setPendingAdmin(pendingCount);
    } catch (err) {
      setAppointmentCount(0);
      setPendingAdmin(0);
    }
  }, []);

  useEffect(() => {
    fetchAllAppointment();
  }, [fetchAllAppointment]);

  return (
    <div className="dashboard">
      <h1>Clinic Dashboard</h1>

      {/* Top Cards */}
      <div className="cards">
        <div className="card">
          <h4>Pending Approval - Admin</h4>
          <p>{pendingAdmin}</p>
        </div>

        <div className="card">
          <h4>Appointments</h4>
          <p>{appointmentCount}</p>
        </div>

        <div className="card">
          <h4>Dentists</h4>
          <p>{dentistCount}</p>
        </div>

        <div className="card">
          <h4>Patients</h4>
          <p>{patientsCount}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="filters">
        {["Daily", "Weekly", "Monthly"].map((f) => (
          <button
            key={f}
            className={filter === f ? "active" : ""}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="main">
          <div className="charts">
            {/* Appointments Chart */}
            <div className="chart-card">
              <h3>Appointments</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={data.appointments}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" />
                  <YAxis />
                  <Tooltip />
                  <Line dataKey="value" stroke="#4a90e2" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Income Chart */}
            <div className="chart-card">
              <h3>Income</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={data.income}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#4a90e2" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
