/**
 * Template document - stores the BlockNote editor content
 */
export interface Template {
  id: string;
  name: string;
  description?: string;
  /** BlockNote document JSON */
  content: Record<string, unknown>[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Form submission - data submitted against a template
 */
export interface Submission {
  id: string;
  templateId: string;
  /** Form field values as key-value pairs */
  data: Record<string, unknown>;
  createdAt: Date;
}
