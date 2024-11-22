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
import { z } from 'zod'
import { useForm, Controller, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Tag } from 'emblor'

const FormBlockType = [
  'input',
  'textarea',
  'select',
  'checkbox',
  'radio',
] as const

const tagSchema: z.ZodType<Tag> = z.object({
  id: z.string(),
  text: z.string(),
})

const BlockSchema = z.object({
  type: z.enum(FormBlockType),
  isRequired: z.boolean(),
  options: z.array(tagSchema),
  label: z.string(),
  placeholder: z.string(),
  isInputMask: z.boolean(),
  mask: z.string(),
  replacement: z.string(),
  isMaskNumber: z.boolean(),
  isShowMask: z.boolean(),
})

type TFormBlock = z.infer<typeof BlockSchema>

const GenerateBlocks = () => {
  const {
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<TFormBlock>({
    resolver: zodResolver(BlockSchema),
    defaultValues: {
      type: 'input',
      isRequired: false,
      options: [],
      label: '',
      placeholder: '',
      isInputMask: false,
      mask: '',
      replacement: '',
      isMaskNumber: false,
      isShowMask: false,
    },
  })

  const type = watch('type')
  const isRequired = watch('isRequired')
  const options = watch('options')
  const label = watch('label')
  const placeholder = watch('placeholder')
  const isInputMask = watch('isInputMask')
  const mask = watch('mask')
  const replacement = watch('replacement')
  const isMaskNumber = watch('isMaskNumber')
  const isShowMask = watch('isShowMask')

  const handleClickSaveBlock: SubmitHandler<TFormBlock> = (data) => {
    console.log({ data })
  }

  return (
    <form onSubmit={handleSubmit(handleClickSaveBlock)}>
      <div className="flex flex-col gap-4">
        <h1>Create your own form block</h1>
        <p>All you ned to do is pick which element you want to create</p>
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
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
          )}
        />

        {type === 'select' || type === 'checkbox' || type === 'radio' ? (
          <Controller
            name="options"
            control={control}
            render={({ field }) => (
              <AddOptions
                options={field.value}
                onValueChange={field.onChange}
              />
            )}
          />
        ) : null}

        <Controller
          name="label"
          control={control}
          render={({ field }) => (
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="label">Label:</Label>
              <Input
                id="label"
                placeholder="Add a label"
                value={field.value}
                onChange={field.onChange}
              />
            </div>
          )}
        />

        {type !== 'radio' && type !== 'checkbox' && (
          <Controller
            name="placeholder"
            control={control}
            render={({ field }) => (
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="placeholder">Placeholder:</Label>
                <Input
                  id="placeholder"
                  placeholder="Add a placeholder"
                  value={field.value}
                  onChange={field.onChange}
                />
              </div>
            )}
          />
        )}

        {type === 'input' && (
          <>
            <div className="flex items-center space-x-2">
              <Label htmlFor="is-input-mask">Should input have a mask?</Label>
              <Controller
                name="isInputMask"
                control={control}
                render={({ field }) => (
                  <Switch
                    id="is-input-mask"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
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
                    <Controller
                      name="mask"
                      control={control}
                      render={({ field }) => (
                        <Input
                          id="input-mask"
                          placeholder="Add an input mask"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      )}
                    />
                  </div>
                  <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="replacement">Replacement</Label>
                    <Controller
                      name="replacement"
                      control={control}
                      render={({ field }) => (
                        <Input
                          id="replacement"
                          placeholder="Add a replacement"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      )}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="is-mask-number">
                      Is the mask a number?
                    </Label>
                    <Controller
                      name="isMaskNumber"
                      control={control}
                      render={({ field }) => (
                        <Switch
                          id="is-mask-number"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      )}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="is-show-mask">Show the mask?</Label>
                    <Controller
                      name="isShowMask"
                      control={control}
                      render={({ field }) => (
                        <Switch
                          id="is-show-mask"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}

        <div className="flex items-center space-x-2">
          <Label htmlFor="required">Is the element required?</Label>
          <Controller
            name="isRequired"
            control={control}
            render={({ field }) => (
              <Switch
                id="required"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
        </div>
        <h2>Preview</h2>
        {type != null && (
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
        )}
        <div>
          <button onClick={() => console.log('click')} type="submit">
            Save block
          </button>
        </div>
      </div>
    </form>
  )
}

export default GenerateBlocks
