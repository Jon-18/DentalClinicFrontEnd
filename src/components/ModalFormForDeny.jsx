import React from "react";
import "../style/components/modalform.css";

export default function ModalForm({
  title,
  fields,
  onSubmit,
  onClose,
  submitText,
}) {
  const [form, setForm] = React.useState({});

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    // Support file upload
    if (files) {
      setForm((prev) => ({ ...prev, [name]: files[0] }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h3>{title}</h3>

        <form onSubmit={handleSubmit}>
          {fields.map((field, idx) => {
            // Skip undefined (filtered fields)
            if (!field) return null;

            // Custom JSX block (QR codes, additional UI, etc)
            if (field.type === "custom") {
              return (
                <div key={idx} className="modal-field">
                  {field.component}
                </div>
              );
            }

            return (
              <div key={field.name} className="modal-field">
                {field.label && <label>{field.label}</label>}

                {/* Dropdown */}
                {field.type === "select" ? (
                  <select
                    name={field.name}
                    required={field.required}
                    onChange={(e) => {
                      handleChange(e);
                      if (field.onChange) field.onChange(e); // Support per-field onChange
                    }}
                  >
                    <option value="">Select {field.label}</option>
                    {field.options?.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                ) : field.type === "file" ? (
                  // File upload
                  <input
                    type="file"
                    name={field.name}
                    required={field.required}
                    onChange={(e) => {
                      handleChange(e);
                      if (field.onChange) field.onChange(e);
                    }}
                  />
                ) : (
                  // Regular text / number / email input
                  <input
                    type={field.type}
                    name={field.name}
                    required={field.required}
                    onChange={handleChange}
                  />
                )}
              </div>
            );
          })}

          <div className="modal-actions">
            <button type="button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit">{submitText}</button>
          </div>
        </form>
      </div>
    </div>
  );
}