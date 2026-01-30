import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  ExternalHyperlink,
  Table,
  TableRow,
  TableCell,
  WidthType,
} from "docx";
import type { MergedBlock, MergedInlineContent, DocumentOptions } from "../types";

/**
 * Renders merged blocks to a DOCX document
 */
export async function renderToDocx(
  blocks: MergedBlock[],
  options: DocumentOptions = {}
): Promise<Blob> {
  const children = blocks.flatMap((block) => blockToDocx(block));

  const document = new Document({
    title: options.title,
    creator: options.author,
    sections: [
      {
        properties: {
          page: {
            size: {
              width: options.pageSize === "LETTER" ? 12240 : 11906, // twips
              height: options.pageSize === "LETTER" ? 15840 : 16838,
            },
            margin: {
              top: options.margins?.top ?? 1440, // 1 inch in twips
              bottom: options.margins?.bottom ?? 1440,
              left: options.margins?.left ?? 1440,
              right: options.margins?.right ?? 1440,
            },
          },
        },
        children,
      },
    ],
  });

  return await Packer.toBlob(document);
}

/**
 * Converts a merged block to docx elements
 */
function blockToDocx(block: MergedBlock): (Paragraph | Table)[] {
  switch (block.type) {
    case "paragraph":
      return [createParagraph(block)];

    case "heading":
      return [createHeading(block)];

    case "bulletListItem":
      return [createBulletItem(block)];

    case "numberedListItem":
      return [createNumberedItem(block)];

    case "table":
      return [createTable(block)];

    default:
      // For unknown block types, render as paragraph
      if (block.content && block.content.length > 0) {
        return [createParagraph(block)];
      }
      return [];
  }
}

/**
 * Creates a paragraph from a block
 */
function createParagraph(block: MergedBlock): Paragraph {
  const alignment = getAlignment(block.props?.textAlignment as string);

  return new Paragraph({
    children: contentToRuns(block.content),
    alignment,
  });
}

/**
 * Creates a heading from a block
 */
function createHeading(block: MergedBlock): Paragraph {
  const level = block.props?.level as number ?? 1;
  const alignment = getAlignment(block.props?.textAlignment as string);

  const headingLevel = {
    1: HeadingLevel.HEADING_1,
    2: HeadingLevel.HEADING_2,
    3: HeadingLevel.HEADING_3,
    4: HeadingLevel.HEADING_4,
    5: HeadingLevel.HEADING_5,
    6: HeadingLevel.HEADING_6,
  }[level] ?? HeadingLevel.HEADING_1;

  return new Paragraph({
    children: contentToRuns(block.content),
    heading: headingLevel,
    alignment,
  });
}

/**
 * Creates a bullet list item
 */
function createBulletItem(block: MergedBlock): Paragraph {
  return new Paragraph({
    children: contentToRuns(block.content),
    bullet: {
      level: 0,
    },
  });
}

/**
 * Creates a numbered list item
 */
function createNumberedItem(block: MergedBlock): Paragraph {
  return new Paragraph({
    children: contentToRuns(block.content),
    numbering: {
      reference: "default-numbering",
      level: 0,
    },
  });
}

/**
 * Creates a table from a block
 */
function createTable(block: MergedBlock): Table {
  const rows = (block.children ?? []).map((rowBlock) => {
    const cells = (rowBlock.children ?? []).map((cellBlock) => {
      return new TableCell({
        children: [createParagraph(cellBlock)],
      });
    });
    return new TableRow({ children: cells });
  });

  return new Table({
    rows,
    width: {
      size: 100,
      type: WidthType.PERCENTAGE,
    },
  });
}

/**
 * Converts inline content to TextRuns
 */
function contentToRuns(
  content: MergedInlineContent[] | undefined
): (TextRun | ExternalHyperlink)[] {
  if (!content) {
    return [];
  }

  return content.map((item) => {
    const styles = item.styles ?? {};

    if (item.type === "link" && item.href) {
      return new ExternalHyperlink({
        children: [
          new TextRun({
            text: item.text,
            bold: styles.bold === true,
            italics: styles.italic === true,
            underline: styles.underline === true ? {} : undefined,
            strike: styles.strike === true,
            style: "Hyperlink",
          }),
        ],
        link: item.href,
      });
    }

    return new TextRun({
      text: item.text,
      bold: styles.bold === true,
      italics: styles.italic === true,
      underline: styles.underline === true ? {} : undefined,
      strike: styles.strike === true,
    });
  });
}

/**
 * Maps text alignment to docx alignment
 */
function getAlignment(alignment: string | undefined): AlignmentType | undefined {
  switch (alignment) {
    case "left":
      return AlignmentType.LEFT;
    case "center":
      return AlignmentType.CENTER;
    case "right":
      return AlignmentType.RIGHT;
    case "justify":
      return AlignmentType.JUSTIFIED;
    default:
      return undefined;
  }
}
