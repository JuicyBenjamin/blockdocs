import type { BlockNoteEditor } from "@blocknote/core";

/**
 * Creates a slash menu item for inserting a variable
 */
export function getVariableSlashMenuItem(editor: BlockNoteEditor<any, any, any>) {
  return {
    title: "Variable",
    onItemClick: () => {
      editor.insertInlineContent([
        {
          type: "variable",
          props: {
            name: "",
            label: "",
            fieldType: "text",
            placeholder: "",
            required: false,
            options: "[]",
          },
        },
        " ", // Add space after so cursor isn't stuck
      ]);
    },
    aliases: ["variable", "var", "field", "input", "placeholder", "form"],
    group: "Template",
    subtext: "Insert a form field variable",
  };
}

/**
 * Returns all template-specific slash menu items
 */
export function getTemplateSlashMenuItems(editor: BlockNoteEditor<any, any, any>) {
  return [getVariableSlashMenuItem(editor)];
}
