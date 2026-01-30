import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({ component: HomePage });

function HomePage() {
  return (
    <div style={{ padding: "40px 20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ marginBottom: "8px" }}>BlockDocs Playground</h1>
      <p style={{ color: "#64748b", marginBottom: "40px", fontSize: "18px" }}>
        Create document templates with form fields, generate forms, and collect submissions.
      </p>

      <div style={{ display: "grid", gap: "20px", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))" }}>
        <Link
          to="/templates"
          style={{
            padding: "24px",
            border: "1px solid #e2e8f0",
            borderRadius: "12px",
            textDecoration: "none",
            color: "inherit",
            transition: "border-color 0.2s, box-shadow 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "#0369a1";
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(3, 105, 161, 0.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "#e2e8f0";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <h2 style={{ margin: "0 0 8px 0", color: "#0369a1" }}>Templates</h2>
          <p style={{ margin: 0, color: "#64748b" }}>
            Create and edit document templates with embedded form variables.
          </p>
        </Link>

        <div
          style={{
            padding: "24px",
            border: "1px dashed #e2e8f0",
            borderRadius: "12px",
            color: "#94a3b8",
          }}
        >
          <h2 style={{ margin: "0 0 8px 0" }}>Submissions</h2>
          <p style={{ margin: 0 }}>View form submissions. Coming soon...</p>
        </div>

        <div
          style={{
            padding: "24px",
            border: "1px dashed #e2e8f0",
            borderRadius: "12px",
            color: "#94a3b8",
          }}
        >
          <h2 style={{ margin: "0 0 8px 0" }}>Documents</h2>
          <p style={{ margin: 0 }}>Generate final documents from submissions. Coming soon...</p>
        </div>
      </div>

      <div style={{ marginTop: "60px", padding: "24px", background: "#f8fafc", borderRadius: "12px" }}>
        <h3 style={{ margin: "0 0 16px 0" }}>How it works</h3>
        <ol style={{ margin: 0, paddingLeft: "20px", color: "#475569", lineHeight: 1.8 }}>
          <li>
            <strong>Create a template</strong> - Use the rich text editor to design your document
          </li>
          <li>
            <strong>Add variables</strong> - Type <code>/variable</code> to insert form fields
          </li>
          <li>
            <strong>Configure fields</strong> - Click on variables to set field types, labels, and options
          </li>
          <li>
            <strong>Preview the form</strong> - See the generated form and test submissions
          </li>
          <li>
            <strong>Collect data</strong> - Share the form to collect responses
          </li>
        </ol>
      </div>
    </div>
  );
}
