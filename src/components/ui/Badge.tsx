import clsx from "clsx";

type Variant = "success" | "warning" | "danger";

export default function Badge({
  label,
  variant,
}: {
  label: string;
  variant: Variant;
}) {
  const styles = {
    success: "bg-green-100 text-green-700",
    warning: "bg-yellow-100 text-yellow-700",
    danger: "bg-red-100 text-red-700",
  };

  return (
    <span className={clsx("px-2 py-1 text-xs rounded", styles[variant])}>
      {label}
    </span>
  );
}