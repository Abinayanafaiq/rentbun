"use client";

export default function ConfirmSubmit({ action, label, className, message }) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!window.confirm(message || "Yakin?")) e.preventDefault();
      }}
      className="inline"
    >
      <button type="submit" className={className}>
        {label}
      </button>
    </form>
  );
}
