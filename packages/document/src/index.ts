// Types
export type {
  Block,
  MergedBlock,
  InlineContent,
  MergedInlineContent,
  FormData,
  DocumentOptions,
} from "./types";

// Merge function
export { mergeTemplate } from "./merge";

// Renderers
export { renderToDocx } from "./renderers/docx";
export { renderToPdf } from "./renderers/pdf";

// Convenience functions that merge and render in one step
import { mergeTemplate } from "./merge";
import { renderToDocx } from "./renderers/docx";
import { renderToPdf } from "./renderers/pdf";
import type { Block, FormData, DocumentOptions } from "./types";

/**
 * Generates a DOCX document from template blocks and form data
 */
export async function generateDocx(
  blocks: Block[],
  data: FormData,
  options?: DocumentOptions
): Promise<Blob> {
  const merged = mergeTemplate(blocks, data);
  return renderToDocx(merged, options);
}

/**
 * Generates a PDF document from template blocks and form data
 */
export async function generatePdf(
  blocks: Block[],
  data: FormData,
  options?: DocumentOptions
): Promise<Blob> {
  const merged = mergeTemplate(blocks, data);
  return renderToPdf(merged, options);
}
