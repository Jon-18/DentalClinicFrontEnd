import { useCallback, useEffect, useMemo, useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import addMinutes from "date-fns/addMinutes";
import format from "date-fns/format";
import getDay from "date-fns/getDay";
import isBefore from "date-fns/isBefore";
import isSameDay from "date-fns/isSameDay";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";

const locales = { "en-US": require("date-fns/locale/en-US") };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default function CalendarBaseForPatient({
  onSlotSelect,
  onEventSelect,
  selectable = true,
  role = "patient",
}) {
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });

  const [view, setView] = useState("month");
  const [appointments, setAppointments] = useState([]);

  // ✅ Convert 12hr → 24hr
  const convertToTime24 = (str, minutesToSet = null) => {
    if (!str) return null;

    let [time, modifier] = str.split(" ");
    let [hours, minutes] = time.split(":").map(Number);

    if (modifier === "PM" && hours !== 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;

    if (minutesToSet !== null) minutes = minutesToSet;

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0",
    )}:00`;
  };

  // ✅ FETCH APPOINTMENTS (FIXED)
  useEffect(() => {
    if (!userId) return;

    fetch(
      `https://dentalclinicbackend-1qfr.onrender.com/api/getAllAppointmentsRoutesPerPatient/${userId}`,
    )
      .then((res) => res.json())
      .then((data) => {
        console.log("API response:", data);

        // Make sure we have an array
        const rows = Array.isArray(data) ? data : [data];

        const formattedRows = rows.map((row) => {
          const [startHour, startMinute] = convertToTime24(row.startTime)
            .split(":")
            .map(Number);

          const [endHour, endMinute] = convertToTime24(row.endTime)
            .split(":")
            .map(Number);

          const formatStartTime = new Date(row.appointmentDate);
          formatStartTime.setHours(startHour, startMinute, 0, 0);

          const formatEndTime = new Date(row.appointmentDate);
          formatEndTime.setHours(endHour, endMinute, 0, 0);

          return { ...row, formatStartTime, formatEndTime };
        });

        setAppointments(formattedRows);
      })
      .catch((err) => {
        console.error("Error fetching appointments:", err);
        setAppointments([]);
      });
  }, [userId]);

  // ✅ Navigation
  const handleNavigate = useCallback((date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (isBefore(date, today)) {
      date = today;
    }

    setSelectedDate(date);
  }, []);

  const handleViewChange = (newView) => setView(newView);

  // ✅ Generate slots
  const generateSlots = useCallback(
    (date) => {
      const slots = [];
      let start = new Date(date);
      start.setHours(9, 0, 0, 0);

      const end = new Date(date);
      end.setHours(18, 0, 0, 0);

      while (start < end) {
        const slotStart = new Date(start);
        const slotEnd = addMinutes(slotStart, 90);

        const isBooked = appointments.some((appt) => {
          return (
            isSameDay(appt.formatStartTime, slotStart) &&
            slotStart < appt.formatEndTime &&
            slotEnd > appt.formatStartTime
          );
        });

        if (!isBooked) slots.push({ start: slotStart, end: slotEnd });

        start = slotEnd;
      }

      return slots;
    },
    [appointments],
  );

  // ✅ Events
  const calendarEvents = useMemo(
    () =>
      appointments.map((appt, i) => ({
        id: `appt-${i}`,
        title: `${appt.fullName} (${appt.notes})`,
        start: appt.formatStartTime,
        end: appt.formatEndTime,
        color: role === "admin" ? "#ff4d4f" : "#1890ff",
      })),
    [appointments, role],
  );

  // ✅ Slot click with 1-day rule
  const handleSlotClick = useCallback(
    (slot) => {
      if (!selectable) return;

      const now = new Date();
      const diffMs = slot.start - now;
      const oneDayMs = 24 * 60 * 60 * 1000;

      if (diffMs < oneDayMs) {
        toast.warn("Appointments must be scheduled at least 1 day in advance!");
        return;
      }

      onSlotSelect?.(slot, generateSlots);
    },
    [selectable, onSlotSelect, generateSlots],
  );

  return (
    <div style={{ height: 600 }}>
      <Calendar
        localizer={localizer}
        events={calendarEvents}
        selectable={selectable}
        date={selectedDate}
        view={view}
        onView={handleViewChange}
        onNavigate={handleNavigate}
        onSelectSlot={handleSlotClick}
        onSelectEvent={onEventSelect}
        step={30}
        timeslots={3}
        slotPropGetter={(slotStart) => {
          const slotEnd = addMinutes(slotStart, 30);

          const isBooked = appointments.some((appt) => {
            return (
              isSameDay(slotStart, appt.formatStartTime) &&
              slotStart < appt.formatEndTime &&
              slotEnd > appt.formatStartTime
            );
          });

          const now = new Date();
          const diffMs = slotStart - now;
          const oneDayMs = 24 * 60 * 60 * 1000;

          const isPast = slotEnd <= now || diffMs < oneDayMs;

          if (isBooked) {
            return { style: { backgroundColor: "#ffcccc" } };
          } else if (isPast) {
            return {
              style: {
                backgroundColor: "#f0f0f0",
                pointerEvents: "none",
                opacity: 0.5,
              },
            };
          }
          return {};
        }}
        eventPropGetter={(event) => {
          const now = new Date();
          const isPast = event.end < now;

          return {
            style: {
              backgroundColor: isPast ? "#d9d9d9" : event.color,
              borderRadius: "5px",
              color: isPast ? "#999" : "white",
              border: "none",
            },
          };
        }}
      />
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
