"use client";

import { Calendar } from "@/components/ui/calendar";
import { formatBuddhistDate } from "@/lib/utils2";
import { th } from "date-fns/locale";
import { useState } from "react";
const newData: Date = new Date("2024-09-24T17:00:00.000Z");
const Page = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(newData);
  const handleDayPickerSelect = (date: Date | undefined) => {
    if (!date) {
      setSelectedDate(undefined);
    } else {
      setSelectedDate(date);
    }
  };
  return (
    <div>
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={handleDayPickerSelect}
        disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
        locale={th}
        formatters={{
          formatCaption: (month) =>
            formatBuddhistDate(month, "LLLL yyyy", {
              locale: th,
            }),
        }}
        defaultMonth={selectedDate}
        footer={`selected ${selectedDate?.toDateString()}`}
      />
    </div>
  );
};

export default Page;
