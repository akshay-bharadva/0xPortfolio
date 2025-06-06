"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react"; // Keep these for now
import { DayPicker, DropdownProps } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // For year/month dropdowns
import { ScrollArea } from "@/components/ui/scroll-area"; // For year dropdown scroll

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  const currentYear = new Date().getFullYear();
  const fromYear = currentYear - 100; // Example range
  const toYear = currentYear + 10;

  // const CustomCaption = (props: { displayMonth: Date }) => {
  //   const { goToMonth, previousMonth, nextMonth, displayMonth } = props;
  //   const currentMonth = displayMonth.getMonth();
  //   const currentDisplayYear = displayMonth.getFullYear();

  //   const handleMonthChange = (value: string) => {
  //     const newMonth = parseInt(value, 10);
  //     goToMonth(new Date(currentDisplayYear, newMonth));
  //   };

  //   const handleYearChange = (value: string) => {
  //     const newYear = parseInt(value, 10);
  //     goToMonth(new Date(newYear, currentMonth));
  //   };

  //   const monthOptions = Array.from({ length: 12 }, (_, i) => ({
  //     value: i.toString(),
  //     label: new Date(0, i).toLocaleString(undefined, { month: 'long' }),
  //   }));

  //   const yearOptions = Array.from({ length: toYear - fromYear + 1 }, (_, i) => ({
  //       value: (fromYear + i).toString(),
  //       label: (fromYear + i).toString(),
  //   }));

  //   return (
  //     <div className="flex justify-between items-center px-2 py-1.5">
  //       <Button
  //         variant="outline"
  //         size="icon"
  //         className="h-7 w-7"
  //         onClick={() => previousMonth && goToMonth(previousMonth)}
  //         disabled={!previousMonth}
  //       >
  //         <ChevronLeft className="h-4 w-4" />
  //       </Button>
  //       <div className="flex gap-2">
  //           <Select
  //               value={currentMonth.toString()}
  //               onValueChange={handleMonthChange}
  //           >
  //               <SelectTrigger className="h-8 text-sm font-bold w-[120px] px-2 py-1 border-black focus:ring-indigo-500">
  //                   <SelectValue placeholder="Month" />
  //               </SelectTrigger>
  //               <SelectContent>
  //                   {monthOptions.map(option => (
  //                       <SelectItem key={option.value} value={option.value}>
  //                           {option.label}
  //                       </SelectItem>
  //                   ))}
  //               </SelectContent>
  //           </Select>
  //           <Select
  //               value={currentDisplayYear.toString()}
  //               onValueChange={handleYearChange}
  //           >
  //               <SelectTrigger className="h-8 text-sm font-bold w-[80px] px-2 py-1 border-black focus:ring-indigo-500">
  //                   <SelectValue placeholder="Year" />
  //               </SelectTrigger>
  //               <SelectContent>
  //                 <ScrollArea className="h-[200px]"> {/* Optional: Scroll for many years */}
  //                   {yearOptions.map(option => (
  //                       <SelectItem key={option.value} value={option.value}>
  //                           {option.label}
  //                       </SelectItem>
  //                   ))}
  //                 </ScrollArea>
  //               </SelectContent>
  //           </Select>
  //       </div>
  //       <Button
  //         variant="outline"
  //         size="icon"
  //         className="h-7 w-7"
  //         onClick={() => nextMonth && goToMonth(nextMonth)}
  //         disabled={!nextMonth}
  //       >
  //         <ChevronRight className="h-4 w-4" />
  //       </Button>
  //     </div>
  //   );
  // };

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "p-3 border-2 border-black rounded-none shadow-[4px_4px_0px_#000] bg-white",
        className,
      )}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        // caption: "flex justify-center pt-1 relative items-center", // Replaced by CustomCaption
        // caption_label: "text-sm font-bold text-black", // Handled by CustomCaption Selects
        // nav: "space-x-1 flex items-center", // Handled by CustomCaption Buttons
        // nav_button: cn(
        //   buttonVariants({ variant: "outline", size: "icon" }),
        //   "h-7 w-7 bg-transparent p-0 opacity-70 hover:opacity-100" // Handled by CustomCaption Buttons
        // ),
        // nav_button_previous: "absolute left-1", // Handled by CustomCaption Buttons
        // nav_button_next: "absolute right-1", // Handled by CustomCaption Buttons
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell: "text-black rounded-none w-9 font-bold text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-none [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-yellow-300 first:[&:has([aria-selected])]:rounded-none last:[&:has([aria-selected])]:rounded-none focus-within:relative focus-within:z-20 border-2 border-transparent data-[selected=true]:border-black", // added data-selected border
        day: cn(
          buttonVariants({ variant: "ghost" }), // Ghost variant needs Neo-Brutalist styling if not already
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100 rounded-none hover:bg-gray-200",
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-yellow-400 text-black border-2 border-black hover:bg-yellow-500 focus:bg-yellow-500 focus:text-black shadow-[1px_1px_0px_#000]",
        day_today:
          "bg-indigo-200 text-black border-2 border-indigo-500 font-bold",
        day_outside:
          "day-outside text-gray-500 opacity-50 aria-selected:bg-yellow-200/50 aria-selected:text-gray-700",
        day_disabled: "text-gray-400 opacity-50 cursor-not-allowed",
        day_range_middle:
          "aria-selected:bg-yellow-300/80 aria-selected:text-black rounded-none", // ensure no rounding
        day_hidden: "invisible",
        ...classNames,
      }}
      components={
        {
          // Caption: CustomCaption,
          // IconLeft: () => <ChevronLeft className="h-4 w-4" />, // No longer needed if CustomCaption handles nav
          // IconRight: () => <ChevronRight className="h-4 w-4" />, // No longer needed
        }
      }
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
