import type { VariableProps, VariableOption } from "./blocks/variable";
import type { FormSchema, FieldSchema } from "@blockdocs/form";

/** Generic block shape for extraction */
interface InlineContent {
  type: string;
  props?: Record<string, unknown>;
}

interface BlockWithContent {
  type: string;
  content?: InlineContent[] | string;
  children?: BlockWithContent[];
}

/**
 * Extracts all variable inline content from the editor blocks
 */
export function extractVariables(blocks: BlockWithContent[]): VariableProps[] {
  const variables: VariableProps[] = [];

  function walkInline(content: InlineContent[] | string | undefined) {
    if (!content || typeof content === "string") return;

    for (const item of content) {
      if (item.type === "variable" && item.props) {
        variables.push(item.props as unknown as VariableProps);
      }
    }
  }

  function walkBlock(block: BlockWithContent) {
    walkInline(block.content);
    if (block.children) {
      block.children.forEach(walkBlock);
    }
  }

  blocks.forEach(walkBlock);
  return variables;
}

/**
 * Converts extracted variables into a FormSchema for @blockdocs/form
 */
export function variablesToFormSchema(
  variables: VariableProps[],
  formId: string = "generated-form"
): FormSchema {
  const fields: FieldSchema[] = variables
    .filter((v) => v.name) // Only include variables with a name
    .map((variable) => {
      const base = {
        name: variable.name,
        type: variable.fieldType,
        label: variable.label || variable.name,
        placeholder: variable.placeholder,
        validation: variable.required
          ? [{ type: "required" as const, message: `${variable.label || variable.name} is required` }]
          : undefined,
      };

      if (variable.fieldType === "select" || variable.fieldType === "radio") {
        const options: VariableOption[] = JSON.parse(variable.options || "[]");
        return {
          ...base,
          options: options.map((o) => ({ label: o.label, value: o.value })),
        };
      }

      return base;
    });

  return {
    id: formId,
    fields,
  };
}

/**
 * Extracts variables from blocks and converts to FormSchema in one step
 */
export function blocksToFormSchema(blocks: BlockWithContent[], formId?: string): FormSchema {
  const variables = extractVariables(blocks);
  return variablesToFormSchema(variables, formId);
}
