import { FC, useId } from 'react'

import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import { Checkbox } from './ui/checkbox'
import { Label } from './ui/label'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { Tag } from 'emblor'

interface FormBlockComponentProps {
  type: 'input' | 'textarea' | 'select' | 'checkbox' | 'radio'
  options?: Tag[]
  placeholder?: string
  required?: boolean
  label?: string
}

const FormBlockComponent: FC<FormBlockComponentProps> = ({
  type,
  options,
  placeholder,
  required = false,
  label,
}) => {
  const elementId = useId()
  if (type === 'input') {
    return (
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor={elementId}>{label}</Label>
        <Input id={elementId} placeholder={placeholder} required={required} />
      </div>
    )
  }
  if (type === 'textarea') {
    return (
      <div className="grid w-full gap-1.5">
        <Label htmlFor={elementId}>{label}</Label>
        <Textarea
          id={elementId}
          placeholder={placeholder}
          required={required}
        />
      </div>
    )
  }
  if (type === 'select') {
    return (
      <div className="grid w-full gap-1.5">
        <Label htmlFor={elementId}>{label}</Label>
        <Select required={required}>
          <SelectTrigger id={elementId} className="w-[180px]">
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options?.map((option) => (
              <SelectItem key={option.id} value={option.id}>
                {option.text}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    )
  }
  if (type === 'checkbox') {
    return (
      <div className="grid w-full gap-1.5">
        <Label htmlFor={elementId}>{label}</Label>
        <div id={elementId}>
          {options?.map((option) => (
            <div className="flex items-center space-x-2">
              <Checkbox id={option.id} />
              <Label htmlFor={option.id}>{option.text}</Label>
            </div>
          ))}
        </div>
      </div>
    )
  }
  if (type === 'radio') {
    return (
      <div className="grid w-full gap-1.5">
        <Label htmlFor={elementId}>{label}</Label>
        <RadioGroup id={elementId}>
          {options?.map((option) => (
            <div className="flex items-center space-x-2">
              <RadioGroupItem id={option.id} value={option.id} />
              <Label htmlFor={option.id}>{option.text}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    )
  }
  return <p>Something went wrong</p>
}

export default FormBlockComponent
