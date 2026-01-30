import { BlockNoteSchema, defaultInlineContentSpecs } from "@blocknote/core";
import { Variable } from "./blocks/variable";

/**
 * Extended BlockNote schema with template-specific inline content
 */
export const templateSchema = BlockNoteSchema.create({
  inlineContentSpecs: {
    ...defaultInlineContentSpecs,
    variable: Variable,
  },
});

/** Type for the template editor */
export type TemplateSchema = typeof templateSchema;
