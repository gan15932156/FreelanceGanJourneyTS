"use client";

import { cn } from "@/lib/utils";

interface Props {
  colSpan: number;
  colSpanContent?: string;
  headingText: string;
  content: string;
  gridGap: string;
}
const QuotationInfoItem: React.FC<Props> = ({
  colSpan,
  colSpanContent = "col-[2_/_span_1]",
  headingText,
  content,
  gridGap,
}: Props) => {
  return (
    <div
      className={cn(
        "p-1 grid grid-cols-subgrid items-center",
        gridGap,
        `col-span-${colSpan}`
      )}
    >
      <p className="col-span-1 col-start-1 text-sm font-medium leading-none">
        {headingText}
      </p>
      <p
        className={cn(
          "min-h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
          colSpanContent
        )}
      >
        {content}
      </p>
    </div>
  );
};

export default QuotationInfoItem;
