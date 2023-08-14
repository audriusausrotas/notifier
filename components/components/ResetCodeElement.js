export default function ResetCodeElement({
  setValue,
  rf,
  pasteHandler,
  deleteHandler,
  value,
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => {
        setValue(e.target.value);
      }}
      maxLength={1}
      ref={rf}
      onPaste={pasteHandler}
      onKeyDown={deleteHandler}
      className="reset__inputs2--input auth-input__input"
    />
  );
}
