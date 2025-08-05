import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils.ts"
import { Button } from "@/components/ui/button.tsx"
import { Calendar } from "@/components/ui/calendar.tsx"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover.tsx"

import type {ControllerRenderProps} from "react-hook-form"

type Props = {
    field: ControllerRenderProps<any, any>
    label?: string
}

export const DatePickerInput = ({ field, label }: Props) => {
    const selectedDate = field.value ? new Date(field.value) : undefined

    return (
        <div className="space-y-1 w-full">
            {label && <label className="text-sm font-medium">{label}</label>}
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className={cn(
                            "w-full justify-start text-left font-normal",
                            !selectedDate && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, "yyyy-MM-dd") : "Pick a date"}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => {
                            field.onChange(date ? format(date, "yyyy-MM-dd") : "")
                        }}
                        autoFocus
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
}
