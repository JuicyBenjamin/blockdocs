import { createContext, useContext, type ReactNode, type ComponentType } from "react";
import type { FieldSchema } from "../schema/types";

/**
 * Props passed to all field components
 */
export interface FieldComponentProps {
  field: FieldSchema;
  value: unknown;
  onChange: (value: unknown) => void;
  onBlur: () => void;
  error?: string;
  touched?: boolean;
}

/**
 * Props for the field wrapper (label, error display, etc.)
 */
export interface FieldWrapperProps {
  field: FieldSchema;
  error?: string;
  touched?: boolean;
  children: ReactNode;
}

/**
 * Props for the submit button
 */
export interface SubmitButtonProps {
  label: string;
  isSubmitting: boolean;
  disabled?: boolean;
}

/**
 * Component registry - maps field types to components
 */
export interface ComponentRegistry {
  /** Component for each field type */
  fields: Record<string, ComponentType<FieldComponentProps>>;
  /** Wraps each field (adds label, error message, etc.) */
  wrapper: ComponentType<FieldWrapperProps>;
  /** Groups fields into sections */
  section: ComponentType<{ title?: string; description?: string; children: ReactNode }>;
  /** The form element */
  form: ComponentType<{ onSubmit: () => void; children: ReactNode; className?: string }>;
  /** Submit button */
  submitButton: ComponentType<SubmitButtonProps>;
}

// --- Default Components (unstyled HTML) ---

function DefaultInput({ field, value, onChange, onBlur }: FieldComponentProps) {
  return (
    <input
      type={field.type === "textarea" ? "text" : field.type}
      name={field.name}
      value={String(value ?? "")}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      placeholder={field.placeholder}
      disabled={field.disabled}
    />
  );
}

function DefaultTextarea({ field, value, onChange, onBlur }: FieldComponentProps) {
  return (
    <textarea
      name={field.name}
      value={String(value ?? "")}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      placeholder={field.placeholder}
      disabled={field.disabled}
    />
  );
}

function DefaultSelect({ field, value, onChange, onBlur }: FieldComponentProps) {
  const options = "options" in field ? field.options : [];
  return (
    <select
      name={field.name}
      value={String(value ?? "")}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      disabled={field.disabled}
    >
      <option value="">{field.placeholder ?? "Select..."}</option>
      {options?.map((opt) => (
        <option key={String(opt.value)} value={String(opt.value)} disabled={opt.disabled}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

function DefaultCheckbox({ field, value, onChange, onBlur }: FieldComponentProps) {
  return (
    <input
      type="checkbox"
      name={field.name}
      checked={Boolean(value)}
      onChange={(e) => onChange(e.target.checked)}
      onBlur={onBlur}
      disabled={field.disabled}
    />
  );
}

function DefaultRadio({ field, value, onChange, onBlur }: FieldComponentProps) {
  const options = "options" in field ? field.options : [];
  return (
    <div>
      {options?.map((opt) => (
        <label key={String(opt.value)}>
          <input
            type="radio"
            name={field.name}
            value={String(opt.value)}
            checked={value === opt.value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            disabled={field.disabled || opt.disabled}
          />
          {opt.label}
        </label>
      ))}
    </div>
  );
}

function DefaultHidden({ field, value }: FieldComponentProps) {
  return <input type="hidden" name={field.name} value={String(value ?? "")} />;
}

function DefaultWrapper({ field, error, touched, children }: FieldWrapperProps) {
  return (
    <div>
      {field.label && <label htmlFor={field.name}>{field.label}</label>}
      {children}
      {field.description && <p>{field.description}</p>}
      {touched && error && <span style={{ color: "red" }}>{error}</span>}
    </div>
  );
}

function DefaultSection({
  title,
  description,
  children,
}: {
  title?: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <fieldset>
      {title && <legend>{title}</legend>}
      {description && <p>{description}</p>}
      {children}
    </fieldset>
  );
}

function DefaultForm({
  onSubmit,
  children,
  className,
}: {
  onSubmit: () => void;
  children: ReactNode;
  className?: string;
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className={className}
    >
      {children}
    </form>
  );
}

function DefaultSubmitButton({ label, isSubmitting, disabled }: SubmitButtonProps) {
  return (
    <button type="submit" disabled={isSubmitting || disabled}>
      {isSubmitting ? "Submitting..." : label}
    </button>
  );
}

/**
 * Default registry with unstyled HTML elements
 */
export const defaultRegistry: ComponentRegistry = {
  fields: {
    text: DefaultInput,
    email: DefaultInput,
    password: DefaultInput,
    number: DefaultInput,
    textarea: DefaultTextarea,
    select: DefaultSelect,
    checkbox: DefaultCheckbox,
    radio: DefaultRadio,
    date: DefaultInput,
    time: DefaultInput,
    datetime: DefaultInput,
    file: DefaultInput,
    hidden: DefaultHidden,
  },
  wrapper: DefaultWrapper,
  section: DefaultSection,
  form: DefaultForm,
  submitButton: DefaultSubmitButton,
};

// --- Context ---

const ComponentRegistryContext = createContext<ComponentRegistry>(defaultRegistry);

export interface ComponentRegistryProviderProps {
  children: ReactNode;
  /** Override specific components */
  components?: {
    fields?: Record<string, ComponentType<FieldComponentProps>>;
    wrapper?: ComponentType<FieldWrapperProps>;
    section?: ComponentType<{ title?: string; description?: string; children: ReactNode }>;
    form?: ComponentType<{ onSubmit: () => void; children: ReactNode; className?: string }>;
    submitButton?: ComponentType<SubmitButtonProps>;
  };
}

/**
 * Provider for customizing form components
 */
export function ComponentRegistryProvider({ children, components }: ComponentRegistryProviderProps) {
  const registry: ComponentRegistry = {
    fields: { ...defaultRegistry.fields, ...components?.fields },
    wrapper: components?.wrapper ?? defaultRegistry.wrapper,
    section: components?.section ?? defaultRegistry.section,
    form: components?.form ?? defaultRegistry.form,
    submitButton: components?.submitButton ?? defaultRegistry.submitButton,
  };

  return (
    <ComponentRegistryContext.Provider value={registry}>
      {children}
    </ComponentRegistryContext.Provider>
  );
}

/**
 * Hook to access the component registry
 */
export function useComponentRegistry() {
  return useContext(ComponentRegistryContext);
}
