"use client";

import Image from "next/image";
import { useState } from "react";

export default function InputElement({ type, label, plh, value, setValue }) {
  const [show, setShow] = useState(false);

  function showPassword() {
    setShow(true);
  }

  function hidePassword() {
    setShow(false);
  }

  return (
    <div className="auth-input">
      <label htmlFor={label} className="auth-input__label">
        {label}
      </label>
      <div className="auth-input__input">
        <input
          type={type !== "password" ? type : show ? "text" : type}
          placeholder={plh}
          id={label}
          required
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
          }}
        />
        {type === "password" && (
          <Image
            src="/icons/eye.svg"
            alt="icon of an eye"
            width={20}
            height={20}
            onMouseDown={showPassword}
            onMouseUp={hidePassword}
            onMouseLeave={hidePassword}
          />
        )}
      </div>
    </div>
  );
}
