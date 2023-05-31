import React from "react";

/**
 * Returns a visual representation of a percentage
 * @returns JSX.Element
 */
export default function Progress({
  value = 0,
}: {
  value: number;
}): JSX.Element {
  let color = "bg-red-300";
  if (value > 25) {
    color = "bg-yellow-300";
  }
  if (value > 50) {
    color = "bg-lime-300";
  }
  if (value > 75) {
    color = "bg-green-400";
  }
  return (
    <div className="w-full bg-gray-200 rounded-full">
      <div
        className={` ${color} text-xs font-medium text-black text-center p-0.5 h-5 leading-none rounded-full`}
        style={{ width: `${value}%` }}
      >
        {value}%
      </div>
    </div>
  );
}
