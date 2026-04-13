import React, { useState } from "react";
import "../style/components/modalform.css";

export default function ModalForm({
  title,
  fields,
  onSubmit,
  onClose,
  submitText,
}) {
  const [form, setForm] = useState({});

  const handleChange = (e, customOnChange) => {
    const { name, value, files } = e.target;

    let newValue = value;

    if (files) {
      newValue = files[0];
    }

    setForm((prev) => {
      const updated = {
        ...prev,
        [name]: newValue,
      };

      // ✅ allow parent to modify form (for dependent fields)
      if (customOnChange) {
        return customOnChange(newValue, updated) || updated;
      }

      return updated;
    });
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
            if (!field) return null;

            /* ✅ CUSTOM FIELD (like Price display) */
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

                {/* ✅ SELECT */}
                {field.type === "select" ? (
                  <select
                    name={field.name}
                    required={field.required}
                    value={form[field.name] || ""}
                    onChange={(e) =>
                      handleChange(e, field.onChange)
                    }
                  >
                    <option value="">Select {field.label}</option>
                    {field.options?.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                ) : field.type === "file" ? (
                  <input
                    type="file"
                    name={field.name}
                    required={field.required}
                    onChange={(e) =>
                      handleChange(e, field.onChange)
                    }
                  />
                ) : (
                  <input
                    type={field.type || "text"}
                    name={field.name}
                    required={field.required}
                    value={form[field.name] || ""}
                    onChange={(e) =>
                      handleChange(e, field.onChange)
                    }
                    readOnly={field.readOnly}
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