import { useForm } from "@tanstack/react-form";
import type { FormSchema, FieldSchema, FormSection } from "../schema/types";
import { useComponentRegistry } from "../context/component-registry";

export interface DynamicFormProps {
  /** The schema describing the form structure */
  schema: FormSchema;
  /** Initial values for the form fields */
  defaultValues?: Record<string, unknown>;
  /** Called when the form is submitted with valid data */
  onSubmit: (values: Record<string, unknown>) => void | Promise<void>;
  /** Additional class name for the form */
  className?: string;
}

/**
 * Extracts default values from the schema definition
 */
function getSchemaDefaults(schema: FormSchema): Record<string, unknown> {
  const defaults: Record<string, unknown> = {};

  const processField = (field: FieldSchema) => {
    if (field.defaultValue !== undefined) {
      defaults[field.name] = field.defaultValue;
    }
  };

  schema.fields?.forEach(processField);
  schema.sections?.forEach((section) => section.fields.forEach(processField));

  return defaults;
}

/**
 * DynamicForm - Renders a form from a JSON schema
 *
 * Uses TanStack Form under the hood and allows component customization
 * through the ComponentRegistryProvider.
 */
export function DynamicForm({ schema, defaultValues, onSubmit, className }: DynamicFormProps) {
  const registry = useComponentRegistry();
  const FormWrapper = registry.form;
  const SubmitButton = registry.submitButton;
  const FieldWrapper = registry.wrapper;

  const form = useForm({
    defaultValues: { ...getSchemaDefaults(schema), ...defaultValues } as Record<string, unknown>,
    onSubmit: async ({ value }) => {
      await onSubmit(value);
    },
  });

  const renderField = (field: FieldSchema) => {
    const Component = registry.fields[field.type] ?? registry.fields.text;

    return (
      <form.Field key={field.name} name={field.name}>
        {(fieldApi) => {
          const error = fieldApi.state.meta.errors?.[0] as string | undefined;
          const touched = fieldApi.state.meta.isTouched;

          if (field.type === "hidden") {
            return (
              <Component
                field={field}
                value={fieldApi.state.value}
                onChange={fieldApi.handleChange}
                onBlur={fieldApi.handleBlur}
              />
            );
          }

          return (
            <FieldWrapper field={field} error={error} touched={touched}>
              <Component
                field={field}
                value={fieldApi.state.value}
                onChange={fieldApi.handleChange}
                onBlur={fieldApi.handleBlur}
                error={error}
                touched={touched}
              />
            </FieldWrapper>
          );
        }}
      </form.Field>
    );
  };

  const renderSection = (section: FormSection) => {
    const Section = registry.section;

    return (
      <Section key={section.id} title={section.title} description={section.description}>
        {section.fields.filter((f) => !f.hidden).map(renderField)}
      </Section>
    );
  };

  return (
    <FormWrapper onSubmit={form.handleSubmit} className={className ?? schema.className}>
      {schema.title && <h2>{schema.title}</h2>}
      {schema.description && <p>{schema.description}</p>}

      {schema.fields?.filter((f) => !f.hidden).map(renderField)}
      {schema.sections?.map(renderSection)}

      <form.Subscribe selector={(state) => state.isSubmitting}>
        {(isSubmitting) => (
          <SubmitButton label={schema.submitLabel ?? "Submit"} isSubmitting={isSubmitting} />
        )}
      </form.Subscribe>
    </FormWrapper>
  );
}
