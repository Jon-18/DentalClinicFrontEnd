import CalendarBase from "../Calendar";

export default function DoctorCalendar({ doctorAppointments }) {
  return (
    <div style={{ margin: "50px" }}>
      <h2>👨‍⚕️ Doctor Schedule</h2>
      <CalendarBase
        role="doctor"
        bookedAppointments={doctorAppointments}
        selectable={false}
        onEventSelect={(event) =>
          alert(`Appointment with ${event.title}`)
        }
      />
    </div>
  );
}
