"use client";

import { useState } from "react";

export default function PasswordField({
  id,
  label,
  value,
  onChange,
  placeholder,
  minLength,
  autoComplete,
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="form-group">
      <label htmlFor={id}>{label}</label>
      <div className="password-wrap">
        <input
          id={id}
          type={visible ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          minLength={minLength}
          autoComplete={autoComplete}
          required
        />
        <button
          type="button"
          className="password-toggle"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? "Hide" : "Show"}
        </button>
      </div>
    </div>
  );
}