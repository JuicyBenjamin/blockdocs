import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo, useCallback, useRef } from "react";
import { useLiveQuery, eq } from "@tanstack/react-db";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";
import {
  SuggestionMenuController,
  getDefaultReactSlashMenuItems,
} from "@blocknote/react";
import { filterSuggestionItems } from "@blocknote/core";
import { templateSchema, getTemplateSlashMenuItems } from "@blockdocs/template";
import { templateCollection, type Template } from "../../db";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";

import "@blocknote/core/fonts/inter.css";
import "@blocknote/shadcn/style.css";

export const Route = createFileRoute("/templates/$templateId")({
  component: TemplateEditorPage,
  ssr: false,
});

function TemplateEditorPage() {
  const { templateId } = Route.useParams();

  const { data: templates, isLoading } = useLiveQuery(
    (query) =>
      query
        .from({ template: templateCollection })
        .where(({ template }) => eq(template.id, templateId))
        .select(({ template }) => ({
          id: template.id,
          name: template.name,
          description: template.description,
          content: template.content,
          createdAt: template.createdAt,
          updatedAt: template.updatedAt,
        })),
    [templateId]
  );

  const template = templates?.[0];

  if (isLoading) {
    return (
      <div className="p-5 max-w-4xl mx-auto">
        <p className="text-muted-foreground">Loading template...</p>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="p-5 max-w-4xl mx-auto">
        <p className="text-muted-foreground">Template not found.</p>
        <Link to="/templates" className="text-primary hover:underline">
          Back to templates
        </Link>
      </div>
    );
  }

  const safeTemplate: Template = {
    ...template,
    id: template.id ?? templateId,
    content: Array.isArray(template.content) ? template.content : [],
  };

  return <TemplateEditor key={templateId} template={safeTemplate} />;
}

function useDebounce<T extends (...args: any[]) => void>(
  callback: T,
  delay: number
): T {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  return useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  ) as T;
}

function TemplateEditor({ template }: { template: Template }) {
  const [templateName, setTemplateName] = useState(template.name);
  const [showJson, setShowJson] = useState(false);
  const [jsonContent, setJsonContent] = useState<string | null>(null);

  const editor = useCreateBlockNote({
    schema: templateSchema,
    initialContent:
      template.content?.length > 0 ? (template.content as any) : undefined,
  });

  const slashMenuItems = useMemo(() => {
    return [
      ...getDefaultReactSlashMenuItems(editor),
      ...getTemplateSlashMenuItems(editor),
    ];
  }, [editor]);

  const saveContent = useCallback(() => {
    templateCollection.update(template.id, (draft) => {
      draft.content = editor.document as Record<string, unknown>[];
      draft.updatedAt = new Date();
    });
  }, [template.id, editor]);

  const debouncedSaveContent = useDebounce(saveContent, 500);

  const saveName = useCallback(
    (newName: string) => {
      templateCollection.update(template.id, (draft) => {
        draft.name = newName;
        draft.updatedAt = new Date();
      });
    },
    [template.id]
  );

  const debouncedSaveName = useDebounce(saveName, 500);

  const handleNameChange = (newName: string) => {
    setTemplateName(newName);
    debouncedSaveName(newName);
  };

  const handleToggleJson = () => {
    if (showJson) {
      setShowJson(false);
      setJsonContent(null);
    } else {
      setJsonContent(JSON.stringify(editor.document, null, 2));
      setShowJson(true);
    }
  };

  return (
    <div className="p-5 max-w-4xl mx-auto">
      <div className="mb-5">
        <Link to="/templates" className="text-sm text-muted-foreground hover:text-foreground">
          ← Back to templates
        </Link>
      </div>

      <div className="flex gap-3 items-center mb-5">
        <input
          type="text"
          value={templateName}
          onChange={(event) => handleNameChange(event.target.value)}
          className="flex-1 text-2xl font-bold bg-transparent border-none outline-none focus:outline-none placeholder:text-muted-foreground"
          placeholder="Template name..."
        />
        <Link
          to="/templates/$templateId/form"
          params={{ templateId: template.id }}
        >
          <Button variant="outline">Preview Form</Button>
        </Link>
      </div>

      <p className="mb-5 text-muted-foreground text-sm">
        Type <code className="bg-muted px-1 rounded">/</code> for blocks. Use{" "}
        <code className="bg-muted px-1 rounded">/variable</code> to insert form
        fields.
      </p>

      <Card className="mb-5">
        <CardContent className="p-0 min-h-[300px] [&_.bn-editor]:min-h-[280px]">
          <BlockNoteView
            editor={editor}
            theme="light"
            slashMenu={false}
            onChange={debouncedSaveContent}
          >
            <SuggestionMenuController
              triggerCharacter="/"
              getItems={async (queryText: string) =>
                filterSuggestionItems(slashMenuItems, queryText)
              }
            />
          </BlockNoteView>
        </CardContent>
      </Card>

      <Button variant="secondary" onClick={handleToggleJson}>
        {showJson ? "Hide JSON" : "Show JSON"}
      </Button>

      {showJson && jsonContent && (
        <pre className="mt-3 bg-muted p-4 rounded-lg overflow-auto text-sm">
          {jsonContent}
        </pre>
      )}
    </div>
  );
}
