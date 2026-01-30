/**
 * Inline content within a block (text, links, variables, etc.)
 */
export interface InlineContent {
  type: string;
  text?: string;
  props?: Record<string, unknown>;
  styles?: Record<string, boolean | string>;
}

/**
 * A BlockNote block with content and optional children
 */
export interface Block {
  id?: string;
  type: string;
  props?: Record<string, unknown>;
  content?: InlineContent[] | string;
  children?: Block[];
}

/**
 * A block after variable substitution - variables are replaced with text
 */
export interface MergedBlock {
  id?: string;
  type: string;
  props?: Record<string, unknown>;
  content?: MergedInlineContent[];
  children?: MergedBlock[];
}

/**
 * Inline content after merging - no more variable types, just text/links
 */
export interface MergedInlineContent {
  type: "text" | "link";
  text: string;
  styles?: Record<string, boolean | string>;
  href?: string;
}

/**
 * Form data from a submission - field name to value mapping
 */
export type FormData = Record<string, string>;

/**
 * Options for document generation
 */
export interface DocumentOptions {
  /** Document title (used in metadata) */
  title?: string;
  /** Document author (used in metadata) */
  author?: string;
  /** Page size */
  pageSize?: "A4" | "LETTER";
  /** Page margins in points */
  margins?: {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
  };
}
