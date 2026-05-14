import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CalendarBaseForPatient from "../CalendarForPatient";
import ModalForm from "../ModalForm";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

function PayPalButton({ amount, onSuccess }) {
  return (
    <PayPalScriptProvider
      options={{
        "client-id":
          "Aat6nCbZB_atUx-8gQO5MYO2EDu_2-qeA384x7SaX8mianZeA_-vwVtOzZihXbmEcOodR-vg9QxSb5Z0",
        currency: "PHP",
      }}
    >
      <PayPalButtons
        style={{ layout: "vertical" }}
        createOrder={(data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  currency_code: "PHP",
                  value: amount,
                },
              },
            ],
          });
        }}
        onApprove={(data, actions) => {
          return actions.order.capture().then((details) => {
            onSuccess(details);
          });
        }}
      />
    </PayPalScriptProvider>
  );
}

export default function PatientCalendar() {
  const [showFormModal, setShowFormModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("");

  const [services, setServices] = useState([]);
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [paypalPaid, setPaypalPaid] = useState(false);
  const [paypalDetails, setPaypalDetails] = useState(null);

  const minSelectableDate = new Date();
  minSelectableDate.setHours(0, 0, 0, 0);

  const selectedService = services.find(
    (s) => s.id === Number(selectedServiceId),
  );
  console.log(selectedService);
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  // FETCH SERVICES
  useEffect(() => {
    if (showFormModal) {
      fetch("https://dentalclinicbackend-1qfr.onrender.com/api/getAllServices")
        .then((res) => res.json())
        .then((data) => setServices(data))
        .catch((err) => console.error(err));
    }
  }, [showFormModal]);

  // FETCH DOCTORS
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

    setPaypalPaid(false);
    setPaypalDetails(null);
    setSelectedSlot(slots);
    setShowFormModal(true);
  };

  // SUBMIT APPOINTMENT
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
        paypalDetails: paypalDetails,
        paymentStatus: paymentMethod === "paypal" ? "paid" : "pending",
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
      } else {
        const uploadData = new FormData();
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
                { label: "Paypal", value: "paypal" },
              ],
              onChange: (value) => setPaymentMethod(value),
            },
            paymentMethod === "paypal" && {
              type: "custom",
              component: (
                <div>
                  <p style={{ marginBottom: "10px" }}>
                    Pay with PayPal to confirm your booking
                  </p>

                  <PayPalButton
                    amount={selectedService?.price || "1.00"}
                    onSuccess={(details) => {
                      setPaypalPaid(true);
                      setPaypalDetails(details);
                      toast.success("PayPal payment successful!");
                    }}
                  />

                  {paypalPaid && (
                    <p style={{ color: "green", marginTop: "10px" }}>
                      Payment completed ✔
                    </p>
                  )}
                </div>
              ),
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
