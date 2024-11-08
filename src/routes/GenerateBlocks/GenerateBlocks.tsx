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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import * as v from 'valibot'
import { getValue, useForm } from '@modular-forms/react'

export type FormBlockType =
  | 'input'
  | 'textarea'
  | 'select'
  | 'checkbox'
  | 'radio'

const FormBlockType: FormBlockType[] = [
  'input',
  'textarea',
  'select',
  'checkbox',
  'radio',
]

const BlockSchema = v.object({
  type: v.picklist(FormBlockType),
  isRequired: v.boolean(),
  options: v.array(v.string()),
  label: v.string(),
  placeholder: v.string(),
  isInputMask: v.boolean(),
  mask: v.string(),
  replacement: v.string(),
  isMaskNumber: v.boolean(),
  isShowMask: v.boolean(),
})

type BlockForm = v.InferInput<typeof BlockSchema>

const GenerateBlocks = () => {
  // const [type, setType] = useState<FormBlockType>()
  // const [isRequired, setIsRequired] = useState<boolean>(false)
  // const [options, setOptions] = useState<Tag[]>([])
  // const [label, setLabel] = useState<string>('')
  // const [placeholder, setPlaceholder] = useState<string>('')
  // const [isInputMask, setIsInputMask] = useState<boolean>(false)
  // const [mask, setMask] = useState<string>()
  // const [replacement, setReplacement] = useState<string>()
  // const [isMaskNumber, setIsMaskNumber] = useState<boolean>(false)
  // const [isShowMask, setIsShowMask] = useState<boolean>(false)
  const [blockForm, { Form, Field }] = useForm<BlockForm>()
  const value = getValue(blockForm, 'type')

  const handleClickSaveBlock = () => {
    console.log(value)
  }

  return (
    <Form>
      <div className="flex flex-col gap-4">
        <h1>Create your own form block</h1>
        <p>All you ned to do is pick which element you want to create</p>
        <Field name="type">
          {(field, props) => (
            <>
              <Select {...props}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Choose your input type" />
                </SelectTrigger>
                <SelectContent>
                  {FormBlockType.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div>{field.value}</div>
            </>
          )}
        </Field>
        {/* // // type === 'select' || type === 'checkbox' || type === 'radio' ? (
          //   <AddOptions options={options} onValueChange={setOptions} />
          // ) : null} */}

        {/* <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="label">Label:</Label>
          <Input
            id="label"
            placeholder="Add a label"
            onChange={(e) => setLabel(e.target.value)}
          />
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="placeholder">Placeholder:</Label>
          <Input
            id="placeholder"
            placeholder="Add a placeholder"
            onChange={(e) => setPlaceholder(e.target.value)}
          />
        </div>
        {type === 'input' && (
          <>
            <div className="flex items-center space-x-2">
              <Label htmlFor="is-input-mask">Should input have a mask?</Label>
              <Switch
                id="is-input-mask"
                checked={isInputMask}
                onCheckedChange={() => setIsInputMask((prev) => !prev)}
              />
            </div>
            {isInputMask && (
              <Card>
                <CardHeader>
                  <CardTitle>Input Mask</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="input-mask">Input Mask</Label>
                    <Input
                      id="input-mask"
                      placeholder="Add an input mask"
                      onChange={(e) => setMask(e.target.value)}
                    />
                  </div>
                  <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="replacement">Replacement</Label>
                    <Input
                      id="replacement"
                      placeholder="Add a replacement"
                      onChange={(e) => setReplacement(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="is-mask-number">
                      Is the mask a number?
                    </Label>
                    <Switch
                      id="is-mask-number"
                      checked={isMaskNumber}
                      onCheckedChange={() => setIsMaskNumber((prev) => !prev)}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="is-show-mask">Show the mask?</Label>
                    <Switch
                      id="is-show-mask"
                      checked={isShowMask}
                      onCheckedChange={() => setIsShowMask((prev) => !prev)}
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
        <div className="flex items-center space-x-2">
          <Label htmlFor="required">Is the element required?</Label>
          <Switch
            id="required"
            checked={isRequired}
            onCheckedChange={() => setIsRequired((prev) => !prev)}
          />
        </div>
        <h2>Preview</h2>
        {type && (
          <FormBlockComponent
            type={type}
            required={isRequired}
            options={options}
            label={label}
            placeholder={placeholder}
            mask={isInputMask ? mask : undefined}
            replacement={replacement}
            isMaskNumber={isMaskNumber}
            isShowMask={isShowMask}
          />
        )} */}
        <div>
          <button onClick={handleClickSaveBlock}>Save block</button>
        </div>
      </div>
    </Form>
  )
}

export default GenerateBlocks
