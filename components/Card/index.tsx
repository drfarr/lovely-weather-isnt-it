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
  value: string | number;
  children?: React.ReactNode;
  tall?: boolean;
}): JSX.Element {
  return (
    <div
      className={`flex items-center w-full flex-col text-center justify-center min-h-full ${
        tall ? "h-52" : "h-28"
      } rounded bg-primary`}
    >
      <p className="text-xl">{title}</p>
      <p>{children}</p>
      <p className="text-lg">{value}</p>
    </div>
  );
}
