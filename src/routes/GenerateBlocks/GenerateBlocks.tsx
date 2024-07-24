import { useState } from 'react'
import FormBlockComponent from '@/components/FormBlockComponent'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import AddOptions from './components/AddOptions'
import { Tag } from 'emblor'

type FormBlockType = 'input' | 'textarea' | 'select' | 'checkbox' | 'radio'

const GenerateBlocks = () => {
  const [type, setType] = useState<FormBlockType>()
  const [isRequired, setIsRequired] = useState<boolean>(false)
  const [options, setOptions] = useState<Tag[]>([])

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
      {type === 'select' || type === 'checkbox' || type === 'radio' ? (
        <AddOptions options={options} onValueChange={setOptions} />
      ) : null}
      {/*
      TODO: add a way to add options for select, checkbox, and radio
      TODO: add a way to add a label
      TODO: add a way to make the field required
      TODO: add a way to add a placeholder
      TODO: add a way to define an input mas for input
      */}
      <h2>Preview</h2>
      {type && (
        <FormBlockComponent
          type={type}
          required={isRequired}
          options={options}
        />
      )}
    </div>
  )
}

export default GenerateBlocks
