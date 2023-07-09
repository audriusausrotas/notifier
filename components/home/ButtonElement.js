export default function ButtonElement({ children, type, onclick }) {
  return (
    <button
      className={`auth-button ${
        type === "submit" ? "auth-button__default" : "auth-button__reverse"
      }`}
      type={type}
      onClick={onclick}
    >
      {children}
    </button>
  );
}
