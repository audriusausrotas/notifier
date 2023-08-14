import React from "react";

export default function Button({ children, onclick, variant, selected }) {
  return (
    <button
      onClick={onclick}
      className={`btn btn--${variant} ${
        selected ? "btn--selected" : selected === false ? "btn--unselected" : ""
      }`}
    >
      {children}
    </button>
  );
}
