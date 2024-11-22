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
import { Button } from '@/components/ui/button'
import { useLoaderData, useParams } from 'react-router'
import { db } from '@/utils/db'

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

const BlockSchema = z
  .object({
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
  .superRefine((data, ctx) => {
    if (data.label === '') {
      ctx.addIssue({
        code: 'custom',
        path: ['label'],
        message: 'Label is required',
      })
    }
    if (data.isInputMask && !data.mask) {
      ctx.addIssue({
        code: 'custom',
        path: ['mask'],
        message: 'Mask is required when input mask is enabled',
      })
    }
    if (
      data.type === 'select' ||
      data.type === 'checkbox' ||
      data.type === 'radio'
    ) {
      if (data.options.length === 0) {
        ctx.addIssue({
          code: 'custom',
          path: ['options'],
          message: `Options are required for ${data.type}`,
        })
      }
    }
  })

export type TFormBlock = z.infer<typeof BlockSchema>

const GenerateBlocks = () => {
  const initialBlockData = useLoaderData() as TFormBlock | null
  const { blockId } = useParams()

  const {
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm<TFormBlock>({
    resolver: zodResolver(BlockSchema),
    defaultValues: {
      type: initialBlockData ? initialBlockData.type : 'input',
      isRequired: initialBlockData ? initialBlockData.isRequired : false,
      options: initialBlockData ? initialBlockData.options : [],
      label: initialBlockData ? initialBlockData.label : '',
      placeholder: initialBlockData ? initialBlockData.placeholder : '',
      isInputMask: initialBlockData ? initialBlockData.isInputMask : false,
      mask: initialBlockData ? initialBlockData.mask : '',
      replacement: initialBlockData ? initialBlockData.replacement : '',
      isMaskNumber: initialBlockData ? initialBlockData.isMaskNumber : false,
      isShowMask: initialBlockData ? initialBlockData.isShowMask : false,
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

  console.log(errors)

  const handleClickSaveBlock: SubmitHandler<TFormBlock> = (data) => {
    db.customBlock.update(Number(blockId), data)
  }

  const width = 'w-[180px]'

  return (
    <div>
      <div className="flex flex-col gap-2 py-2">
        <h1>Create your own form block</h1>
        <p>All you ned to do is pick which element you want to create</p>
        <Button variant="outline" size="sm" onClick={() => reset()}>
          Reset
        </Button>
      </div>
      <form onSubmit={handleSubmit(handleClickSaveBlock)}>
        <div className="flex flex-col gap-4">
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className={width}>
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
              render={({ field, fieldState }) => (
                <div className="flex gap-2 items-center">
                  <AddOptions
                    options={field.value}
                    onValueChange={field.onChange}
                  />
                  {fieldState.error && (
                    <p className="text-red-500">{fieldState.error.message}</p>
                  )}
                </div>
              )}
            />
          ) : null}

          <div>
            <Label htmlFor="label">Label:</Label>
            <Controller
              name="label"
              control={control}
              render={({ field, fieldState }) => (
                <div className="flex items-center gap-2">
                  <Input
                    id="label"
                    className={width}
                    placeholder="Add a label"
                    value={field.value}
                    onChange={field.onChange}
                  />
                  {fieldState.error && (
                    <p className="text-red-500">{fieldState.error.message}</p>
                  )}
                </div>
              )}
            />
          </div>

          {type !== 'radio' && type !== 'checkbox' && (
            <div>
              <Label htmlFor="placeholder">Placeholder:</Label>
              <Controller
                name="placeholder"
                control={control}
                render={({ field }) => (
                  <Input
                    id="placeholder"
                    placeholder="Add a placeholder"
                    className={width}
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
            </div>
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
                        render={({ field, fieldState }) => (
                          <>
                            <Input
                              id="input-mask"
                              placeholder="Add an input mask"
                              value={field.value}
                              onChange={field.onChange}
                            />
                            {fieldState.error && (
                              <p className="text-red-500">
                                {fieldState.error.message}
                              </p>
                            )}
                          </>
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
            <Button type="submit">Save block</Button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default GenerateBlocks
