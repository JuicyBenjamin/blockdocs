import { useState } from 'react'
import FormBlockComponent from '@/components/FormBlockComponent'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type FormBlockType = 'input' | 'textarea' | 'select' | 'checkbox' | 'radio'

const GenerateBlocks = () => {
  const [type, setType] = useState<FormBlockType>('input')
  return (
    <div className="flex flex-col gap-2">
      <h1>Create your own form block</h1>
      <p>All you ned to do is pick which element you want to create</p>
      <Select onValueChange={(value) => setType(value as FormBlockType)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Choose your input type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="input">Input</SelectItem>
          <SelectItem value="textarea">Textarea</SelectItem>
          <SelectItem value="select">Select</SelectItem>
          <SelectItem value="checkbox">Checkbox</SelectItem>
          <SelectItem value="radio">Radio</SelectItem>
        </SelectContent>
      </Select>
      <h2>Preview</h2>
      <FormBlockComponent type={type} />
    </div>
  )
}

export default GenerateBlocks
