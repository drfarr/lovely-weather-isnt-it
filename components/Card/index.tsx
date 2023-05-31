import React from "react";

/**
 * A component used to display a label for a value
 * Additonal display data can be entered as a child prop
 * @returns JSX.Element
 */
export default function Card({
  title,
  value,
  children,
  tall,
}: {
  title: string;
  value: string | number | null;
  children?: React.ReactNode;
  tall?: boolean;
}): JSX.Element {
  return (
    <div
      className={`flex p-10 space-y-3 items-center w-full flex-col text-center justify-center min-h-full ${
        tall ? "h-52" : "h-32"
      } rounded bg-primary`}
    >
      <p className="text-lg w-full">{title}</p>
      <div className="w-full">{children}</div>
      <p className="text-md">{value}</p>
    </div>
  );
}
