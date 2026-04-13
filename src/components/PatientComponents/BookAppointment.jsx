import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CalendarBaseForPatient from "../CalendarForPatient";
import ModalForm from "../ModalForm";

export default function PatientCalendar() {
  const [showFormModal, setShowFormModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [receiptFile, setReceiptFile] = useState(null);
  const [services, setServices] = useState([]);
  const [formDefaultDate, setFormDefaultDate] = useState(null);
  const [selectedServiceId, setSelectedServiceId] = useState(null);

  const minSelectableDate = new Date();
  minSelectableDate.setHours(0, 0, 0, 0);

  const selectedService = services.find(
    (s) => s.id === Number(selectedServiceId),
  );

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  // Fetch services
  useEffect(() => {
    if (showFormModal) {
      fetch("https://dentalclinicbackend-1qfr.onrender.com/api/getAllServices")
        .then((res) => res.json())
        .then((data) => setServices(data))
        .catch((err) => console.error(err));
    }
  }, [showFormModal]);

  // Fetch doctors
  useEffect(() => {
    if (showFormModal) {
      fetch("https://dentalclinicbackend-1qfr.onrender.com/api/getAllDoctor")
        .then((res) => res.json())
        .then((data) => setDoctors(data))
        .catch((err) => console.error(err));
    }
  }, [showFormModal]);

  // SLOT SELECT
  const handleSlotSelect = (slotInfo, generateSlots) => {
    const clickedDate = new Date(slotInfo.start);
    clickedDate.setHours(0, 0, 0, 0);

    if (clickedDate < minSelectableDate) {
      toast.error("Booking is allowed only 1 day in advance.");
      return;
    }

    const slots = generateSlots(slotInfo.start);

    if (!slots || slots.length === 0) {
      toast.error("No available slots for this date.");
      return;
    }

    setSelectedSlot(slots);
    setFormDefaultDate(clickedDate);
    setShowFormModal(true);
  };

  // SUBMIT
  const handleSubmit = async (formData) => {
    try {
      if (!formData.timeSlot) {
        toast.error("Please select a time slot");
        return;
      }

      const selectedStart = new Date(formData.timeSlot);

      const selectedEnd = selectedSlot.find(
        (slot) => slot.start.toISOString() === formData.timeSlot,
      )?.end;

      if (!selectedEnd) {
        toast.error("Invalid time slot selected");
        return;
      }

      const finalAppointment = {
        ...formData,
        price: selectedService?.price,
        user_id: userId,
        email: user?.email,
        paymentMethod,
        date: selectedStart.toISOString().split("T")[0],
        startTime: selectedStart.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        endTime: selectedEnd.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      let response;

      // CASH
      if (paymentMethod === "cash") {
        response = await fetch(
          "https://dentalclinicbackend-1qfr.onrender.com/api/appointments/create",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(finalAppointment),
          },
        );
      }
      // GCASH / MAYA
      else {
        if (!receiptFile) {
          toast.error("Please upload your payment receipt.");
          return;
        }

        const uploadData = new FormData();
        uploadData.append("receipt", receiptFile);
        uploadData.append("data", JSON.stringify(finalAppointment));

        response = await fetch(
          "https://dentalclinicbackend-1qfr.onrender.com/api/appointments/create",
          {
            method: "POST",
            body: uploadData,
          },
        );
      }

      const text = await response.text();

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        toast.error("Server error: Invalid response");
        return;
      }

      if (!response.ok) {
        toast.error(data.message || "Failed to submit appointment");
        return;
      }

      toast.success(
        paymentMethod === "cash"
          ? "Appointment Submitted!"
          : "Appointment Submitted with receipt!",
      );

      setShowFormModal(false);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div style={{ margin: "50px" }}>
      <ToastContainer position="top-right" autoClose={2000} />

      <h2>🧍 Patient Appointment Booking</h2>

      <CalendarBaseForPatient
        role="patient"
        onSlotSelect={handleSlotSelect}
        minDate={minSelectableDate}
      />

      {showFormModal && (
        <ModalForm
          title="Book Appointment"
          fields={[
            {
              name: "fullName",
              label: "Full Name",
              type: "text",
              required: true,
            },
            {
              name: "contactNumber",
              label: "Contact No.",
              type: "number",
              required: true,
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
              onChange: (value, form) => {
                setSelectedServiceId(value);
                return { ...form, services: value };
              },
            },
            {
              type: "custom",
              component: (
                <div>
                  <label>Price</label>
                  <div style={{ padding: "10px", fontWeight: "bold" }}>
                    ₱{selectedService?.price || "--"}
                  </div>
                </div>
              ),
            },
            {
              name: "doctorName",
              label: "Doctor",
              type: "select",
              required: true,
              options: doctors.map((doc) => ({
                label: doc.fullName,
                value: doc.id,
              })),
            },
            {
              name: "timeSlot",
              label: "Choose Time",
              type: "select",
              required: true,
              options: selectedSlot.map((slot) => ({
                label: `${slot.start.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })} - ${slot.end.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}`,
                value: slot.start.toISOString(),
              })),
            },
            {
              name: "paymentMethod",
              label: "Payment Method",
              type: "select",
              required: true,
              options: [
                { label: "Cash", value: "cash" },
                { label: "GCash", value: "gcash" },
                { label: "PayMaya", value: "paymaya" },
              ],
              onChange: (value) => setPaymentMethod(value),
            },
            paymentMethod === "gcash" && {
              type: "custom",
              component: <p>GCash: 0975 470 3971</p>,
            },
            paymentMethod === "paymaya" && {
              type: "custom",
              component: <p>Paymaya: 0917 182 1861</p>,
            },
            (paymentMethod === "gcash" || paymentMethod === "paymaya") && {
              name: "receipt",
              label: "Upload Receipt",
              type: "file",
              required: true,
              onChange: (file) => setReceiptFile(file),
            },
          ].filter(Boolean)}
          submitText="Submit Appointment"
          onSubmit={handleSubmit}
          onClose={() => setShowFormModal(false)}
        />
      )}
    </div>
  );
}
