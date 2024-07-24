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
            <SelectItem key={option.id} value={option.id}>
              {option.text}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    )
  }
  if (type === 'checkbox') {
    return options?.map((option) => (
      <div className="flex items-center space-x-2">
        <Checkbox id={option.id} />
        <Label htmlFor={option.id}>{option.text}</Label>
      </div>
    ))
  }
  if (type === 'radio') {
    return (
      <RadioGroup>
        {options?.map((option) => (
          <div className="flex items-center space-x-2">
            <RadioGroupItem id={option.id} value={option.id} />
            <Label htmlFor={option.id}>{option.text}</Label>
          </div>
        ))}
      </RadioGroup>
    )
  }
  return <p>Something went wrong</p>
}

export default FormBlockComponent
