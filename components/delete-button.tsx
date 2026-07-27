"use client";

const DeleteButton = ({
  action,
  label = "Delete",
  confirmMessage = "Are you sure you want to delete this? This can't be undone.",
  className = "text-sm text-red-600 hover:text-red-800",
}: {
  action: () => Promise<void>;
  label?: string;
  confirmMessage?: string;
  className?: string;
}) => {
  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (!window.confirm(confirmMessage)) {
          event.preventDefault();
        }
      }}
    >
      <button type='submit' className={className}>
        {label}
      </button>
    </form>
  );
};

export default DeleteButton;
