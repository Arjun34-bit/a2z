import { cn } from "@/lib/utils";

interface StepTrackerProps {
  current: number;
  total: number;
}

export function StepTracker({ current, total }: StepTrackerProps) {
  return (
    <div className="flex items-center gap-2 mb-8">
      {Array.from({ length: total }).map((_, i) => {
        const stepNum = i + 1;
        const isCompleted = current > stepNum;
        const isActive = current === stepNum;
        return (
          <div key={i} className="flex items-center gap-2">
            <div
              className={cn(
                "flex items-center justify-center w-7 h-7 rounded-full text-[11px] font-700 transition-all duration-300",
                isCompleted && "bg-[#6F55C8] text-white",
                isActive && "bg-[#6F55C8] text-white ring-4 ring-[#EDE9FF]",
                !isCompleted && !isActive && "bg-[#F0EDFC] text-[#9E99B4]"
              )}
            >
              {isCompleted ? (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M2 6l3 3 5-5"
                    stroke="white"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                stepNum
              )}
            </div>
            {i < total - 1 && (
              <div
                className={cn(
                  "h-0.5 w-10 rounded-full transition-all duration-500",
                  isCompleted ? "bg-[#6F55C8]" : "bg-[#E8E4F5]"
                )}
              />
            )}
          </div>
        );
      })}
      <span className="ml-auto text-[12px] font-semibold text-[#9E99B4]">
        Step {current} of {total}
      </span>
    </div>
  );
}
