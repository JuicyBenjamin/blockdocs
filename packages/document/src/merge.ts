import type {
  Block,
  MergedBlock,
  InlineContent,
  MergedInlineContent,
  FormData,
} from "./types";

/**
 * Merges a template with form data by replacing variable placeholders with actual values
 */
export function mergeTemplate(blocks: Block[], data: FormData): MergedBlock[] {
  return blocks.map((block) => mergeBlock(block, data));
}

/**
 * Merges a single block, processing its content and children recursively
 */
function mergeBlock(block: Block, data: FormData): MergedBlock {
  return {
    id: block.id,
    type: block.type,
    props: block.props,
    content: mergeContent(block.content, data),
    children: block.children?.map((child) => mergeBlock(child, data)),
  };
}

/**
 * Merges inline content, replacing variables with their form data values
 */
function mergeContent(
  content: InlineContent[] | string | undefined,
  data: FormData
): MergedInlineContent[] | undefined {
  if (!content) {
    return undefined;
  }

  // Handle string content (plain text)
  if (typeof content === "string") {
    return [{ type: "text", text: content }];
  }

  // Process array of inline content
  const merged: MergedInlineContent[] = [];

  for (const item of content) {
    if (item.type === "variable") {
      // Replace variable with form data value
      const variableName = item.props?.name as string | undefined;
      const value = variableName ? data[variableName] ?? "" : "";

      if (value) {
        merged.push({
          type: "text",
          text: value,
          styles: item.styles,
        });
      }
    } else if (item.type === "text") {
      // Keep text as-is
      merged.push({
        type: "text",
        text: item.text ?? "",
        styles: item.styles,
      });
    } else if (item.type === "link") {
      // Keep links, preserving href
      merged.push({
        type: "link",
        text: item.text ?? "",
        href: item.props?.href as string | undefined,
        styles: item.styles,
      });
    }
    // Other inline content types are skipped (or could be handled as needed)
  }

  return merged.length > 0 ? merged : undefined;
}
