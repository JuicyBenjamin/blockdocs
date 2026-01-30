// Core form component
export { DynamicForm, type DynamicFormProps } from "./components/dynamic-form";

// Schema types
export type {
  FieldType,
  ValidationRule,
  FieldOption,
  FieldCondition,
  BaseFieldSchema,
  OptionsFieldSchema,
  TextFieldSchema,
  NumberFieldSchema,
  FieldSchema,
  FormSection,
  FormSchema,
} from "./schema/types";

// Component registry for customization
export {
  ComponentRegistryProvider,
  useComponentRegistry,
  defaultRegistry,
  type ComponentRegistry,
  type ComponentRegistryProviderProps,
  type FieldComponentProps,
  type FieldWrapperProps,
  type SubmitButtonProps,
} from "./context/component-registry";

// Re-export TanStack Form for convenience
export { useForm, useField } from "@tanstack/react-form";
