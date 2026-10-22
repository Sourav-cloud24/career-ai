"use client";

import { Check, ChevronDown } from "lucide-react";
import { useState } from "react";

type SelectionOptionBase = {
  id: string;
};

type SelectionCardProps<T extends SelectionOptionBase> = {
  step: string;
  icon: React.ReactNode;
  itemLabel: string;
  options: T[];
  selectedOption: T | null;
  getOptionTitle: (option: T) => string;
  getOptionSubtitle: (option: T) => string;
  onSelect: (option: T) => void;
  isLoading?: boolean;
};

function SelectionCard<T extends SelectionOptionBase>({
  step,
  icon,
  itemLabel,
  options,
  selectedOption,
  getOptionTitle,
  getOptionSubtitle,
  onSelect,
  isLoading = false,
}: SelectionCardProps<T>) {
  const [open, setOpen] = useState(false);

  const hasSelection = selectedOption !== null;

  return (
    <div className="min-w-0 flex-1 rounded-2xl border border-line bg-white p-5">
      <p className="mb-3 text-xs text-muted">{step}</p>

      <div className="flex flex-col items-center text-center">
        <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-indigo/10 text-indigo">
          {icon}
        </div>

        {hasSelection ? (
          <>
            <p className="max-w-full truncate text-[13.5px] font-medium text-ink">
              {getOptionTitle(selectedOption)}
            </p>

            <p className="mt-0.5 max-w-full truncate text-xs text-muted">
              {getOptionSubtitle(selectedOption)}
            </p>
          </>
        ) : (
          <p className="text-[13.5px] text-muted">
            {isLoading ? "Loading..." : `Select a ${itemLabel}`}
          </p>
        )}

        <button
          type="button"
          onClick={() => setOpen((previous) => !previous)}
          disabled={isLoading || options.length === 0}
          aria-expanded={open}
          className="mt-4 inline-flex h-10 items-center gap-2 rounded-lg border border-line bg-white px-5 text-[13.5px] font-semibold text-ink hover:bg-line-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {open ? "Close" : hasSelection ? "Change" : `Choose ${itemLabel}`}

          <ChevronDown
            className={`h-4 w-4 transition-transform ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {open && (
        <div className="mt-4 flex max-h-64 flex-col gap-1.5 overflow-y-auto border-t border-line pt-4">
          {options.map((option) => {
            const isSelected = option.id === selectedOption?.id;

            return (
              <button
                key={option.id}
                type="button"
                aria-pressed={isSelected}
                onClick={() => {
                  onSelect(option);
                  setOpen(false);
                }}
                className={`flex min-w-0 items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors ${
                  isSelected
                    ? "border-indigo bg-indigo/5"
                    : "border-line hover:bg-line-2"
                }`}
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-medium text-ink">
                    {getOptionTitle(option)}
                  </p>

                  <p className="truncate text-xs text-muted">
                    {getOptionSubtitle(option)}
                  </p>
                </div>

                {isSelected && (
                  <Check
                    aria-hidden="true"
                    className="h-4 w-4 flex-none text-indigo"
                  />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default SelectionCard;

// analysisApi