import type { TDocumentDefinitions, Content, Style } from "pdfmake/interfaces";
import type { MergedBlock, MergedInlineContent, DocumentOptions } from "../types";

// pdfmake needs to be imported dynamically for browser/node compatibility
let pdfMake: typeof import("pdfmake/build/pdfmake") | null = null;

async function getPdfMake() {
  if (!pdfMake) {
    // Dynamic import for universal compatibility
    const module = await import("pdfmake/build/pdfmake");
    pdfMake = module.default || module;

    // Load fonts - using built-in Roboto
    const pdfFonts = await import("pdfmake/build/vfs_fonts");
    (pdfMake as any).vfs = (pdfFonts as any).default?.pdfMake?.vfs || (pdfFonts as any).pdfMake?.vfs;
  }
  return pdfMake;
}

/**
 * Renders merged blocks to a PDF document
 */
export async function renderToPdf(
  blocks: MergedBlock[],
  options: DocumentOptions = {}
): Promise<Blob> {
  const pdf = await getPdfMake();

  const content: Content[] = blocks.flatMap((block) => blockToPdf(block));

  const docDefinition: TDocumentDefinitions = {
    info: {
      title: options.title,
      author: options.author,
    },
    pageSize: options.pageSize ?? "A4",
    pageMargins: [
      options.margins?.left ?? 40,
      options.margins?.top ?? 40,
      options.margins?.right ?? 40,
      options.margins?.bottom ?? 40,
    ],
    content,
    styles: defaultStyles,
    defaultStyle: {
      font: "Roboto",
      fontSize: 12,
      lineHeight: 1.4,
    },
  };

  return new Promise((resolve, reject) => {
    try {
      const pdfDoc = pdf.createPdf(docDefinition);
      pdfDoc.getBlob((blob: Blob) => {
        resolve(blob);
      });
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Default styles for PDF document
 */
const defaultStyles: Record<string, Style> = {
  header1: {
    fontSize: 24,
    bold: true,
    marginBottom: 10,
  },
  header2: {
    fontSize: 20,
    bold: true,
    marginBottom: 8,
  },
  header3: {
    fontSize: 16,
    bold: true,
    marginBottom: 6,
  },
  paragraph: {
    marginBottom: 8,
  },
  link: {
    color: "#0066cc",
    decoration: "underline",
  },
};

/**
 * Converts a merged block to pdfmake content
 */
function blockToPdf(block: MergedBlock): Content[] {
  switch (block.type) {
    case "paragraph":
      return [createParagraph(block)];

    case "heading":
      return [createHeading(block)];

    case "bulletListItem":
      return [createBulletList([block])];

    case "numberedListItem":
      return [createNumberedList([block])];

    case "table":
      return [createTable(block)];

    default:
      // For unknown block types, render as paragraph if there's content
      if (block.content && block.content.length > 0) {
        return [createParagraph(block)];
      }
      return [];
  }
}

/**
 * Creates a paragraph content
 */
function createParagraph(block: MergedBlock): Content {
  const textContent = contentToText(block.content);
  const alignment = getAlignment(block.props?.textAlignment as string);

  return {
    text: textContent,
    style: "paragraph",
    alignment,
  };
}

/**
 * Creates a heading content
 */
function createHeading(block: MergedBlock): Content {
  const level = block.props?.level as number ?? 1;
  const textContent = contentToText(block.content);
  const alignment = getAlignment(block.props?.textAlignment as string);

  const style = `header${Math.min(level, 3)}`;

  return {
    text: textContent,
    style,
    alignment,
  };
}

/**
 * Creates a bullet list
 */
function createBulletList(blocks: MergedBlock[]): Content {
  return {
    ul: blocks.map((block) => contentToText(block.content)),
    marginBottom: 8,
  };
}

/**
 * Creates a numbered list
 */
function createNumberedList(blocks: MergedBlock[]): Content {
  return {
    ol: blocks.map((block) => contentToText(block.content)),
    marginBottom: 8,
  };
}

/**
 * Creates a table
 */
function createTable(block: MergedBlock): Content {
  const body = (block.children ?? []).map((rowBlock) => {
    return (rowBlock.children ?? []).map((cellBlock) => {
      return contentToText(cellBlock.content);
    });
  });

  return {
    table: {
      headerRows: 1,
      widths: Array(body[0]?.length ?? 0).fill("*"),
      body,
    },
    marginBottom: 8,
  };
}

/**
 * Converts inline content to pdfmake text array
 */
function contentToText(
  content: MergedInlineContent[] | undefined
): Content | string {
  if (!content || content.length === 0) {
    return "";
  }

  // If single text without styles, return plain string
  if (content.length === 1 && !content[0].styles && content[0].type === "text") {
    return content[0].text;
  }

  // Return array of styled text segments
  return content.map((item) => {
    const styles = item.styles ?? {};

    const segment: Record<string, unknown> = {
      text: item.text,
    };

    if (styles.bold) segment.bold = true;
    if (styles.italic) segment.italics = true;
    if (styles.underline) segment.decoration = "underline";
    if (styles.strike) segment.decoration = "lineThrough";

    if (item.type === "link" && item.href) {
      segment.link = item.href;
      segment.color = "#0066cc";
      segment.decoration = "underline";
    }

    return segment;
  });
}

/**
 * Maps text alignment to pdfmake alignment
 */
function getAlignment(
  alignment: string | undefined
): "left" | "center" | "right" | "justify" | undefined {
  switch (alignment) {
    case "left":
      return "left";
    case "center":
      return "center";
    case "right":
      return "right";
    case "justify":
      return "justify";
    default:
      return undefined;
  }
}
