import { FC } from 'react'

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

interface FormBlockComponentProps {
  type: 'input' | 'textarea' | 'select' | 'checkbox' | 'radio'
  options?: string[]
  placeholder?: string
  required?: boolean
  label?: string
}

const FormBlockComponent: FC<FormBlockComponentProps> = ({
  type,
  options,
  placeholder,
  required = false,
}) => {
  if (type === 'input') {
    return <Input required={required} />
  }
  if (type === 'textarea') {
    return <Textarea required={required} />
  }
  if (type === 'select') {
    return (
      <Select required={required}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options?.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    )
  }
  if (type === 'checkbox') {
    return options?.map((option, index) => (
      <div className="flex items-center space-x-2">
        <Checkbox id={`checkbox-${index}`} />
        <Label htmlFor={`checkbox-${index}`}>{option}</Label>
      </div>
    ))
  }
  if (type === 'radio') {
    return (
      <RadioGroup>
        {options?.map((option, index) => (
          <div className="flex items-center space-x-2">
            <RadioGroupItem id={`radio-${index}`} value={option} />
            <Label htmlFor={`radio-${index}`}>{option}</Label>
          </div>
        ))}
      </RadioGroup>
    )
  }
  return <p>Something went wrong</p>
}

export default FormBlockComponent
