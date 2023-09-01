/* eslint-disable react/prop-types */
export default function ErrorMessage({ message }) {
  return (
    <p className="error">
      <span>⏰</span>
      {message}
    </p>
  );
}
