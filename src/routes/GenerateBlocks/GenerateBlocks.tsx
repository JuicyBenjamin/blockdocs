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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

type FormBlockType = 'input' | 'textarea' | 'select' | 'checkbox' | 'radio'

const GenerateBlocks = () => {
  const [type, setType] = useState<FormBlockType>()
  const [isRequired, setIsRequired] = useState<boolean>(false)
  const [options, setOptions] = useState<Tag[]>([])
  const [label, setLabel] = useState<string>('')

  console.log(isRequired)

  return (
    <div className="flex flex-col gap-4">
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
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="label">Label:</Label>
        <Input
          id="label"
          placeholder="Add a label"
          onChange={(e) => setLabel(e.target.value)}
        />
      </div>
      <div className="flex items-center space-x-2">
        <Label htmlFor="required">Is the element required?</Label>
        <Switch
          id="required"
          checked={isRequired}
          onCheckedChange={() => setIsRequired((prev) => !prev)}
        />
      </div>
      {/*
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
          label={label}
        />
      )}
    </div>
  )
}

export default GenerateBlocks
