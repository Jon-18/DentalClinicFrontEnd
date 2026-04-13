import { useState } from "react";
import '../style/components/profile.css';

export default function ProfileBase({ user, editableFields = [], onSave }) {
  const [formData, setFormData] = useState(user);
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onSave?.(formData);
    setIsEditing(false);
  };

  return (
    <div className="profile-container">
      <h2>👤 Profile</h2>

      <div className="profile-fields">
        {Object.entries(formData).map(([key, value]) => (
          <div key={key} className="profile-field">
            <label>{key.charAt(0).toUpperCase() + key.slice(1)}:</label>

            {isEditing && editableFields.includes(key) ? (
              <input
                type="text"
                name={key}
                value={value}
                onChange={handleChange}
              />
            ) : (
              <span>{value}</span>
            )}
          </div>
        ))}
      </div>

      <div className="profile-buttons">
        {isEditing ? (
          <>
            <button onClick={handleSave} className="save-btn">💾 Save</button>
            <button onClick={() => setIsEditing(false)} className="cancel-btn">❌ Cancel</button>
          </>
        ) : (
          <button onClick={() => setIsEditing(true)} className="edit-btn">✏️ Edit Profile</button>
        )}
      </div>
    </div>
  );
}
