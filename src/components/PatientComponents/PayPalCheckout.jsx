import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

export default function PayPalCheckout() {
  return (
    <PayPalScriptProvider
      options={{
        "client-id":
          "AfHMwnQt8Fv1qVXJf3aZyxfZ1l-qT49CkqLseLX32uCqf2Fwcd06ktKTRBFmtwI2r-BaHzNGOhkI_rNz",
        currency: "PHP",
      }}
    >
      <div style={{ maxWidth: "400px" }}>
        <h3>Complete Payment</h3>

        <PayPalButtons
          style={{ layout: "vertical" }}
          createOrder={(data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    currency_code: "PHP",
                    value: "10.00",
                  },
                },
              ],
            });
          }}
          onApprove={(data, actions) => {
            return actions.order.capture().then((details) => {
              alert(
                `Payment successful 🎉\nThanks ${details.payer.name.given_name}`,
              );
              console.log("Payment details:", details);
            });
          }}
          onError={(err) => {
            console.error("PayPal error:", err);
          }}
        />
      </div>
    </PayPalScriptProvider>
  );
}
