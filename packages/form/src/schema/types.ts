/**
 * Field types supported by the dynamic form builder
 */
export type FieldType =
  | "text"
  | "email"
  | "password"
  | "number"
  | "textarea"
  | "select"
  | "checkbox"
  | "radio"
  | "date"
  | "time"
  | "datetime"
  | "file"
  | "hidden"
  | "custom";

/**
 * Validation rule definition
 */
export interface ValidationRule {
  type: "required" | "min" | "max" | "minLength" | "maxLength" | "pattern" | "custom";
  value?: string | number | boolean | RegExp;
  message: string;
}

/**
 * Option for select, radio, checkbox groups
 */
export interface FieldOption {
  label: string;
  value: string | number | boolean;
  disabled?: boolean;
}

/**
 * Condition for showing/hiding fields
 */
export interface FieldCondition {
  field: string;
  operator: "eq" | "neq" | "gt" | "lt" | "gte" | "lte" | "contains" | "empty" | "notEmpty";
  value?: unknown;
}

/**
 * Base field schema definition
 */
export interface BaseFieldSchema {
  name: string;
  type: FieldType;
  label?: string;
  description?: string;
  placeholder?: string;
  defaultValue?: unknown;
  disabled?: boolean;
  hidden?: boolean;
  validation?: ValidationRule[];
  conditions?: FieldCondition[];
  className?: string;
  /** Custom component key for overriding the default renderer */
  component?: string;
  /** Additional props passed to the field component */
  props?: Record<string, unknown>;
}

/**
 * Field schema with options (select, radio, checkbox)
 */
export interface OptionsFieldSchema extends BaseFieldSchema {
  type: "select" | "radio" | "checkbox";
  options: FieldOption[];
  multiple?: boolean;
}

/**
 * Text-based field schema
 */
export interface TextFieldSchema extends BaseFieldSchema {
  type: "text" | "email" | "password" | "textarea";
  minLength?: number;
  maxLength?: number;
}

/**
 * Number field schema
 */
export interface NumberFieldSchema extends BaseFieldSchema {
  type: "number";
  min?: number;
  max?: number;
  step?: number;
}

/**
 * Union type for all field schemas
 */
export type FieldSchema =
  | BaseFieldSchema
  | OptionsFieldSchema
  | TextFieldSchema
  | NumberFieldSchema;

/**
 * Form section for grouping fields
 */
export interface FormSection {
  id: string;
  title?: string;
  description?: string;
  fields: FieldSchema[];
  conditions?: FieldCondition[];
  className?: string;
}

/**
 * Complete form schema definition
 */
export interface FormSchema {
  id: string;
  title?: string;
  description?: string;
  sections?: FormSection[];
  fields?: FieldSchema[];
  submitLabel?: string;
  resetLabel?: string;
  className?: string;
}
