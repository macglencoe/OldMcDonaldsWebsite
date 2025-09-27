"use client"
import clsx from "clsx";
import { Minus, Person, Plus, User } from "phosphor-react";

const BAR_COLOR_CLASSES = {
  amber: "bg-amber-500",
  blue: "bg-blue-500",
  emerald: "bg-emerald-500",
  green: "bg-green-500",
  indigo: "bg-indigo-500",
  lime: "bg-lime-500",
  orange: "bg-orange-500",
  pink: "bg-pink-500",
  purple: "bg-purple-500",
  red: "bg-red-500",
  rose: "bg-rose-500",
  sky: "bg-sky-500",
  teal: "bg-teal-500",
  violet: "bg-violet-500",
  yellow: "bg-yellow-500",
};

export default function Fillbar({
  color = "green",
  amount = 0,
  max = 0,
  isEditable = false,
  onChange,
}) {
  const numericAmount = Number(amount);
  const hasPositiveAmount = Number.isFinite(numericAmount) && numericAmount > 0;

  if (!hasPositiveAmount && !isEditable) {
    return null;
  }

  const clampedAmount = hasPositiveAmount ? numericAmount : 0;
  const numericMax = Number(max);
  const hasPositiveMax = Number.isFinite(numericMax) && numericMax > 0;
  const safeMax = hasPositiveMax ? numericMax : clampedAmount || 1;

  const normalizedColor = String(color).toLowerCase();
  const fillClass = BAR_COLOR_CLASSES[normalizedColor] ?? "bg-gray-500";
  const totalSegments = Math.max(1, Math.round(safeMax));
  const filledSegments = Math.max(
    0,
    Math.min(totalSegments, Math.round(clampedAmount))
  );

  const displayAmount = Math.round(clampedAmount);
  const displayMax = Math.round(safeMax);

  const handleIncrement = () => {
    if (!isEditable || typeof onChange !== "function") {
      return;
    }

    const nextAmount = Math.min(totalSegments, filledSegments + 1);
    if (nextAmount !== filledSegments) {
      onChange(nextAmount);
    }
  };

  const handleDecrement = () => {
    if (!isEditable || typeof onChange !== "function") {
      return;
    }

    const nextAmount = Math.max(0, filledSegments - 1);
    if (nextAmount !== filledSegments) {
      onChange(nextAmount);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex w-full overflow-hidden rounded-md border border-gray-300">
        {Array.from({ length: totalSegments }).map((_, index) => {
          const isFilled = index < filledSegments;
          const isLastFilled = isEditable && isFilled && index === filledSegments - 1;
          const isNextToFill =
            isEditable &&
            !isFilled &&
            index === filledSegments &&
            filledSegments < totalSegments;

          const segmentClasses = clsx(
            "flex-1 basis-0 h-9 flex items-center justify-center text-xs font-semibold transition-colors border-l border-gray-200 first:border-l-0",
            isFilled ? clsx(fillClass, "text-white") : "bg-gray-100 text-gray-600"
          );

          if (isLastFilled) {
            return (
              <button
                type="button"
                key={index}
                onClick={handleDecrement}
                className={clsx(segmentClasses, "cursor-pointer select-none")}
                aria-label="Remove one"
              >
                <Minus weight="bold" />
              </button>
            );
          }

          if (isNextToFill) {
            return (
              <button
                type="button"
                key={index}
                onClick={handleIncrement}
                className={clsx(segmentClasses, "cursor-pointer select-none")}
                aria-label="Add one"
              >
                <Plus weight="bold" />
              </button>
            );
          }

          return (
            <div key={index} className={segmentClasses}>
              {isFilled ? (
                <Person weight="fill" size={16} className="hidden md:block text-white" />
              ) : null}
            </div>
          );
        })}
      </div>
      <span className="text-lg font-medium text-gray-700">{`${displayAmount}/${displayMax}`}</span>
    </div>
  );
}
