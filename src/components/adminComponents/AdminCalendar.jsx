import { useEffect, useState } from "react";
import CalendarBase from "../Calendar";
import ModalForm from "../ModalForm";
import MessageModal from "../ModalMessage";
// import { dateFnsLocalizer } from "react-big-calendar";
// import format from "date-fns/format";
// import parse from "date-fns/parse";
// import startOfWeek from "date-fns/startOfWeek";
// import getDay from "date-fns/getDay";

export default function AdminCalendar() {
  const [bookedAppointments] = useState([]);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showModalMessage, setShowModalMessage] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [selectedSlot, setSelectedSlot] = useState(null);

  const [doctors, setDoctors] = useState([]);
  const [patients, setPatient] = useState([]);
  const [services, setServices] = useState([]);

  const [selectedServiceId, setSelectedServiceId] = useState(null);

  const locales = { "en-US": require("date-fns/locale/en-US") };

  // const localizer = dateFnsLocalizer({
  //   format,
  //   parse,
  //   startOfWeek,
  //   getDay,
  //   locales,
  // });

  /* LOAD DATA */
  useEffect(() => {
    if (showFormModal) {
      fetch("http://localhost:5000/api/getAllPatient")
        .then((res) => res.json())
        .then(setPatient);

      fetch("http://localhost:5000/api/getAllDoctor")
        .then((res) => res.json())
        .then(setDoctors);

      fetch("http://localhost:5000/api/getAllServices")
        .then((res) => res.json())
        .then(setServices);
    }
  }, [showFormModal]);

  /* SLOT SELECT */
  const handleSlotSelect = (slotInfo, generateSlots) => {
    const { start } = slotInfo;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (start < today) return;

    const availableSlots = generateSlots(start);

    if (availableSlots.length === 0) {
      setModalMessage("No available time slots.");
      setShowModalMessage(true);
      return;
    }

    setSelectedSlot({ date: start, availableSlots });
    setShowFormModal(true);
  };

  /* SUBMIT */
  const handleFormSubmit = async (formData) => {
    console.log(formData);
    if (!formData.timeSlot) {
      alert("Select time slot");
      return;
    }

    const selectedStart = new Date(formData.timeSlot);

    const selectedEnd = selectedSlot.availableSlots.find(
      (slot) => slot.start.toISOString() === formData.timeSlot,
    )?.end;

    const selectedService = services.find(
      (s) => s.id === Number(selectedServiceId),
    );

    const finalAppointment = {
      ...formData,
      price: selectedService?.price,
      date: selectedStart.toISOString().split("T")[0],
      startTime: selectedStart.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      endTime: selectedEnd?.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    console.log(finalAppointment);
    try {
      // const res = await fetch("http://localhost:5000/api/getAllPatient", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(finalAppointment),
      // });

      // const data = await res.json();

      setShowFormModal(false);
      setModalMessage("Appointment Created!");
      setShowModalMessage(true);
    } catch (err) {
      console.error("ERROR:", err);
      setModalMessage("Failed to create appointment");
      setShowModalMessage(true);
    }
  };

  const selectedService = services.find(
    (s) => s.id === Number(selectedServiceId),
  );

  /* FORM FIELDS */
  const appointmentFields = [
    {
      name: "fullName",
      label: "Patient",
      type: "select",
      required: true,
      options: patients.map((p) => ({
        label: p.fullName,
        value: p.id,
      })),
    },
    {
      name: "doctorName",
      label: "Doctor",
      type: "select",
      required: true,
      options: doctors.map((d) => ({
        label: d.fullName,
        value: d.id,
      })),
    },
    {
      name: "services",
      label: "Services",
      type: "select",
      required: true,
      options: services.map((s) => ({
        label: `${s.service_name} - ₱${s.price}`,
        value: s.id,
      })),

      /* ✅ UPDATE PRICE WITHOUT RESET */
      onChange: (value, form) => {
        setSelectedServiceId(value);

        const selected = services.find((s) => s.id === Number(value));

        if (!selected) return form;

        return {
          ...form,
          services: value,
        };
      },
    },
    {
      name: "timeSlot",
      label: "Available Time",
      type: "select",
      required: true,
      options: selectedSlot
        ? selectedSlot.availableSlots.map((slot) => ({
            label: `${slot.start.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })} - ${slot.end.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}`,
            value: slot.start.toISOString(),
          }))
        : [],
    },
    {
      name: "email",
      label: "Email",
      type: "email",
    },

    /* ✅ PRICE DISPLAY ONLY */
    {
      type: "custom",
      component: (
        <div>
          <label>price</label>
          <div
            style={{
              padding: "10px",
              background: "#f5f5f5",
              borderRadius: "6px",
              fontWeight: "bold",
            }}
          >
            ₱{selectedService?.price || "--"}
          </div>
        </div>
      ),
    },
  ];

  return (
    <div style={{ margin: "50px" }}>
      <h2>🦷 Admin Appointment Scheduler</h2>

      <CalendarBase
        role="admin"
        bookedAppointments={bookedAppointments}
        onSlotSelect={handleSlotSelect}
      />

      {showModalMessage && (
        <MessageModal
          message={modalMessage}
          onClose={() => setShowModalMessage(false)}
        />
      )}

      {showFormModal && (
        <ModalForm
          title="Create Appointment"
          fields={appointmentFields}
          onSubmit={handleFormSubmit}
          onClose={() => setShowFormModal(false)}
          submitText="Create"
        />
      )}
    </div>
  );
}
