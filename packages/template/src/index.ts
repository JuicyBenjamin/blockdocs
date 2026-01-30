// Schema with template inline content
export { templateSchema, type TemplateSchema } from "./schema";

// Variable inline content and types
export {
  Variable,
  type VariableFieldType,
  type VariableOption,
  type VariableProps,
} from "./blocks/variable";

// Slash menu items
export { getVariableSlashMenuItem, getTemplateSlashMenuItems } from "./slash-menu";

// Extract form schema from template
export { extractVariables, variablesToFormSchema, blocksToFormSchema } from "./extract";
