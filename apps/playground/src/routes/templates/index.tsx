import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useLiveQuery, eq } from "@tanstack/react-db";
import { templateCollection, type Template } from "../../db";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "../../components/ui/card";

export const Route = createFileRoute("/templates/")({
  component: TemplatesListPage,
  ssr: false,
});

function TemplatesListPage() {
  const navigate = useNavigate();

  const {
    data: templates,
    isLoading,
  } = useLiveQuery((query) =>
    query
      .from({ template: templateCollection })
      .select(({ template }) => ({
        id: template.id,
        name: template.name,
        description: template.description,
        content: template.content,
        createdAt: template.createdAt,
        updatedAt: template.updatedAt,
      }))
  );

  const handleCreateTemplate = async () => {
    const templateId = crypto.randomUUID();
    const now = new Date();
    await templateCollection.insert({
      id: templateId,
      name: "Untitled Template",
      description: "",
      content: [],
      createdAt: now,
      updatedAt: now,
    });
    navigate({ to: "/templates/$templateId", params: { templateId } });
  };

  const handleDeleteTemplate = (templateId: string) => {
    templateCollection.delete(templateId);
  };

  if (isLoading) {
    return (
      <div className="p-5 max-w-4xl mx-auto">
        <p className="text-muted-foreground">Loading templates...</p>
      </div>
    );
  }

  const templateList = templates ?? [];

  return (
    <div className="p-5 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-2xl font-bold">Templates</h1>
        <Button onClick={handleCreateTemplate}>+ New Template</Button>
      </div>

      {templateList.length === 0 ? (
        <Card className="border-dashed">
          <CardHeader className="text-center">
            <CardDescription>
              No templates yet. Create your first one!
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {templateList.map((template) => (
            <TemplateCard
              key={template.id}
              template={template as Template}
              onDelete={() => handleDeleteTemplate(template.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function formatDate(date: Date | string | undefined): string {
  if (!date) return "Unknown";
  const dateObject = typeof date === "string" ? new Date(date) : date;
  return dateObject.toLocaleDateString();
}

function TemplateCard({
  template,
  onDelete,
}: {
  template: Template;
  onDelete: () => void;
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <Link
          to="/templates/$templateId"
          params={{ templateId: template.id }}
          className="hover:underline"
        >
          <CardTitle className="text-primary">{template.name}</CardTitle>
        </Link>
        {template.description && (
          <CardDescription>{template.description}</CardDescription>
        )}
        <p className="text-xs text-muted-foreground mt-1">
          Updated {formatDate(template.updatedAt)}
        </p>
      </CardHeader>
      <CardFooter className="flex gap-2 pt-2">
        <Link to="/templates/$templateId" params={{ templateId: template.id }}>
          <Button variant="secondary" size="sm">
            Edit
          </Button>
        </Link>
        <Link
          to="/templates/$templateId/form"
          params={{ templateId: template.id }}
        >
          <Button variant="outline" size="sm">
            View Form
          </Button>
        </Link>
        <Button variant="destructive" size="sm" onClick={onDelete}>
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}
