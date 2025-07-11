import { useState } from 'react'
import { Calendar, CalendarCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'

interface DatePickerProps {
  placeholder?: string
  value?: Date
  onChange?: (date: Date | undefined) => void
  disabled?: (date: Date) => boolean
  className?: string
}

const DatePicker = ({ placeholder, value, onChange, disabled, className }: DatePickerProps) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleDateSelect = (date: Date | undefined) => {
    onChange?.(date)
    setIsOpen(false)
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground",
            className
          )}
        >
          {value ? (
            <CalendarCheck className="mr-2 h-4 w-4" />
          ) : (
            <Calendar className="mr-2 h-4 w-4" />
          )}
          {value ? value.toLocaleDateString('de-DE') : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <CalendarComponent
          mode="single"
          selected={value}
          onSelect={handleDateSelect}
          disabled={disabled}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}

export default DatePicker