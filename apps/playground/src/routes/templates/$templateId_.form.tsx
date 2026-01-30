import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { useLiveQuery, eq } from '@tanstack/react-db'
import {
  templateCollection,
  submissionCollection,
  type Template,
} from '../../db'
import { blocksToFormSchema } from '@blockdocs/template'
import { generateDocx, generatePdf } from '@blockdocs/document'
import type { FormSchema, FieldSchema } from '@blockdocs/form'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Textarea } from '../../components/ui/textarea'
import { Label } from '../../components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select'

export const Route = createFileRoute('/templates/$templateId_/form')({
  component: FormPreviewPage,
  ssr: false,
})

function FormPreviewPage() {
  const { templateId } = Route.useParams()

  const { data: templates, isLoading } = useLiveQuery(
    (query) =>
      query
        .from({ template: templateCollection })
        .where(({ template }) => eq(template.id, templateId))
        .select(({ template }) => ({
          id: template.id,
          name: template.name,
          description: template.description,
          content: template.content,
          createdAt: template.createdAt,
          updatedAt: template.updatedAt,
        })),
    [templateId],
  )

  const template = templates?.[0]

  if (isLoading) {
    return (
      <div className="p-5 max-w-2xl mx-auto">
        <p className="text-muted-foreground">Loading template...</p>
      </div>
    )
  }

  if (!template) {
    return (
      <div className="p-5 max-w-2xl mx-auto">
        <p className="text-muted-foreground">Template not found.</p>
        <Link to="/templates" className="text-primary hover:underline">
          Back to templates
        </Link>
      </div>
    )
  }

  const safeTemplate: Template = {
    ...template,
    id: template.id ?? templateId,
    content: Array.isArray(template.content) ? template.content : [],
  }

  return <FormPreview key={templateId} template={safeTemplate} />
}

function FormPreview({ template }: { template: Template }) {
  const [formSchema, setFormSchema] = useState<FormSchema | null>(null)
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const [downloading, setDownloading] = useState<'docx' | 'pdf' | null>(null)

  const fields = formSchema?.fields ?? []

  const handleDownloadDocx = async () => {
    setDownloading('docx')
    try {
      const content = Array.isArray(template.content) ? template.content : []
      const blob = await generateDocx(content as any[], formData, {
        title: template.name,
      })
      downloadBlob(blob, `${template.name || 'document'}.docx`)
    } catch (error) {
      console.error('Failed to generate DOCX:', error)
    } finally {
      setDownloading(null)
    }
  }

  const handleDownloadPdf = async () => {
    setDownloading('pdf')
    try {
      const content = Array.isArray(template.content) ? template.content : []
      const blob = await generatePdf(content as any[], formData, {
        title: template.name,
      })
      openBlobInNewTab(blob)
    } catch (error) {
      console.error('Failed to generate PDF:', error)
    } finally {
      setDownloading(null)
    }
  }

  useEffect(() => {
    const content = Array.isArray(template.content) ? template.content : []
    const schema = blocksToFormSchema(content as any[], template.id)
    setFormSchema(schema)

    const initialData: Record<string, string> = {}
    ;(schema.fields ?? []).forEach((field) => {
      initialData[field.name] = ''
    })
    setFormData(initialData)
  }, [template])

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()

    submissionCollection.insert({
      id: crypto.randomUUID(),
      templateId: template.id,
      data: formData,
      createdAt: new Date(),
    })

    setSubmitted(true)
  }

  const handleReset = () => {
    setSubmitted(false)
    const initialData: Record<string, string> = {}
    fields.forEach((field) => {
      initialData[field.name] = ''
    })
    setFormData(initialData)
  }

  if (!formSchema) {
    return (
      <div className="p-5 max-w-2xl mx-auto">
        <p className="text-muted-foreground">Loading form...</p>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="p-5 max-w-2xl mx-auto">
        <Card className="bg-green-50 border-green-200 mb-5">
          <CardHeader className="text-center">
            <CardTitle className="text-green-800">Submitted!</CardTitle>
            <CardDescription className="text-green-700">
              Your response has been saved.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="mb-5">
          <CardHeader>
            <CardTitle className="text-lg">Download Document</CardTitle>
            <CardDescription>
              Generate a document with your submitted data merged into the
              template.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex gap-3">
            <Button
              onClick={handleDownloadDocx}
              disabled={downloading !== null}
            >
              {downloading === 'docx' ? 'Generating...' : 'Download DOCX'}
            </Button>
            <Button
              onClick={handleDownloadPdf}
              variant="secondary"
              disabled={downloading !== null}
            >
              {downloading === 'pdf' ? 'Generating...' : 'View PDF'}
            </Button>
          </CardContent>
        </Card>

        <h3 className="font-semibold mb-2">Submitted Data:</h3>
        <pre className="bg-muted p-4 rounded-lg text-sm">
          {JSON.stringify(formData, null, 2)}
        </pre>

        <div className="flex gap-3 mt-5">
          <Button onClick={handleReset}>Submit Another</Button>
          <Link
            to="/templates/$templateId"
            params={{ templateId: template.id }}
          >
            <Button variant="secondary">Edit Template</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="p-5 max-w-2xl mx-auto">
      <div className="mb-5">
        <Link
          to="/templates/$templateId"
          params={{ templateId: template.id }}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back to editor
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-2">{template.name}</h1>
      {template.description && (
        <p className="text-muted-foreground mb-6">{template.description}</p>
      )}

      {fields.length === 0 ? (
        <Card className="border-dashed">
          <CardHeader className="text-center">
            <CardDescription>No form fields in this template.</CardDescription>
            <p className="text-sm text-muted-foreground">
              Add variables using{' '}
              <code className="bg-muted px-1 rounded">/variable</code> in the
              template editor.
            </p>
          </CardHeader>
        </Card>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4">
            {fields.map((field) => (
              <FormField
                key={field.name}
                field={field}
                value={formData[field.name] || ''}
                onChange={(value) =>
                  setFormData((previous) => ({
                    ...previous,
                    [field.name]: value,
                  }))
                }
              />
            ))}
          </div>

          <Button type="submit" className="mt-6">
            Submit
          </Button>
        </form>
      )}

      <div className="mt-10 pt-5 border-t">
        <h3 className="text-sm font-medium text-muted-foreground mb-3">
          Generated Form Schema
        </h3>
        <pre className="bg-muted p-4 rounded-lg text-xs overflow-auto">
          {JSON.stringify(formSchema, null, 2)}
        </pre>
      </div>
    </div>
  )
}

function FormField({
  field,
  value,
  onChange,
}: {
  field: FieldSchema
  value: string
  onChange: (value: string) => void
}) {
  const isRequired = field.validation?.some(
    (validation: { type: string }) => validation.type === 'required',
  )

  const hasOptions = (
    fieldSchema: FieldSchema,
  ): fieldSchema is FieldSchema & {
    options: { label: string; value: string | number | boolean }[]
  } => {
    return 'options' in fieldSchema && Array.isArray(fieldSchema.options)
  }

  return (
    <div className="space-y-2">
      <Label>
        {field.label}
        {isRequired && <span className="text-destructive ml-1">*</span>}
      </Label>

      {field.type === 'textarea' ? (
        <Textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={field.placeholder}
          required={isRequired}
          rows={4}
        />
      ) : field.type === 'select' && hasOptions(field) ? (
        <Select
          value={value}
          onValueChange={(newValue) => onChange(newValue ?? '')}
          required={isRequired}
        >
          <SelectTrigger>
            <SelectValue placeholder={field.placeholder || 'Select...'} />
          </SelectTrigger>
          <SelectContent>
            {field.options.map((option) => (
              <SelectItem
                key={String(option.value)}
                value={String(option.value)}
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : field.type === 'radio' && hasOptions(field) ? (
        <div className="flex flex-col gap-2">
          {field.options.map((option) => (
            <label
              key={String(option.value)}
              className="flex items-center gap-2"
            >
              <input
                type="radio"
                name={field.name}
                value={String(option.value)}
                checked={value === String(option.value)}
                onChange={(event) => onChange(event.target.value)}
                required={isRequired}
                className="accent-primary"
              />
              {option.label}
            </label>
          ))}
        </div>
      ) : field.type === 'checkbox' ? (
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={value === 'true'}
            onChange={(event) =>
              onChange(event.target.checked ? 'true' : 'false')
            }
            className="accent-primary"
          />
          {field.placeholder || 'Yes'}
        </label>
      ) : (
        <Input
          type={
            field.type === 'email'
              ? 'email'
              : field.type === 'number'
                ? 'number'
                : 'text'
          }
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={field.placeholder}
          required={isRequired}
        />
      )}
    </div>
  )
}

/**
 * Helper to trigger a file download from a Blob
 */
function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Helper to open a Blob in a new browser tab (useful for PDFs)
 */
function openBlobInNewTab(blob: Blob) {
  const url = URL.createObjectURL(blob)
  window.open(url, '_blank')
}
