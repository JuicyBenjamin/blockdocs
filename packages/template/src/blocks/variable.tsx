import { createReactInlineContentSpec } from "@blocknote/react";
import { useState, useCallback, useRef } from "react";
import { createPortal } from "react-dom";

/**
 * Field types that can be generated from a variable
 */
export type VariableFieldType = "text" | "email" | "number" | "textarea" | "select" | "radio" | "checkbox";

/**
 * Option for select/radio fields (stored as JSON string in props)
 */
export interface VariableOption {
  label: string;
  value: string;
}

/**
 * Props stored on the variable inline content
 */
export interface VariableProps {
  name: string;
  label: string;
  fieldType: VariableFieldType;
  placeholder: string;
  required: boolean;
  /** JSON stringified VariableOption[] for select/radio */
  options: string;
}

/**
 * Configuration panel for a variable
 */
function VariableConfig({
  props,
  onUpdate,
  onClose,
  position,
}: {
  props: VariableProps;
  onUpdate: (updates: Partial<VariableProps>) => void;
  onClose: () => void;
  position: { top: number; left: number };
}) {
  const options: VariableOption[] = props.options ? JSON.parse(props.options) : [];
  const needsOptions = props.fieldType === "select" || props.fieldType === "radio";

  const addOption = () => {
    const newOptions = [...options, { label: "", value: "" }];
    onUpdate({ options: JSON.stringify(newOptions) });
  };

  const updateOption = (index: number, field: "label" | "value", value: string) => {
    const newOptions = [...options];
    newOptions[index] = { ...newOptions[index], [field]: value };
    if (field === "label" && !newOptions[index].value) {
      newOptions[index].value = value.toLowerCase().replace(/\s+/g, "_");
    }
    onUpdate({ options: JSON.stringify(newOptions) });
  };

  const removeOption = (index: number) => {
    const newOptions = options.filter((_, i) => i !== index);
    onUpdate({ options: JSON.stringify(newOptions) });
  };

  return (
    <div
      style={{
        position: "fixed",
        top: position.top,
        left: position.left,
        zIndex: 10000,
        background: "white",
        border: "1px solid #e2e8f0",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        padding: "12px",
        minWidth: "280px",
        maxHeight: "80vh",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontWeight: 600, fontSize: "14px" }}>Configure Variable</span>
        <button
          onClick={onClose}
          style={{ background: "none", border: "none", cursor: "pointer", fontSize: "18px", color: "#64748b" }}
        >
          ×
        </button>
      </div>

      <label style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "13px" }}>
        <span style={{ color: "#64748b" }}>Field Name</span>
        <input
          type="text"
          value={props.name}
          onChange={(e) => onUpdate({ name: e.target.value })}
          placeholder="e.g. email"
          style={{ padding: "6px 8px", border: "1px solid #e2e8f0", borderRadius: "4px", fontSize: "13px" }}
        />
      </label>

      <label style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "13px" }}>
        <span style={{ color: "#64748b" }}>Label</span>
        <input
          type="text"
          value={props.label}
          onChange={(e) => onUpdate({ label: e.target.value })}
          placeholder="e.g. Email Address"
          style={{ padding: "6px 8px", border: "1px solid #e2e8f0", borderRadius: "4px", fontSize: "13px" }}
        />
      </label>

      <label style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "13px" }}>
        <span style={{ color: "#64748b" }}>Field Type</span>
        <select
          value={props.fieldType}
          onChange={(e) => onUpdate({ fieldType: e.target.value as VariableFieldType })}
          style={{ padding: "6px 8px", border: "1px solid #e2e8f0", borderRadius: "4px", fontSize: "13px" }}
        >
          <option value="text">Text</option>
          <option value="email">Email</option>
          <option value="number">Number</option>
          <option value="textarea">Text Area</option>
          <option value="select">Dropdown (Select)</option>
          <option value="radio">Radio Buttons</option>
          <option value="checkbox">Checkbox</option>
        </select>
      </label>

      {!needsOptions && props.fieldType !== "checkbox" && (
        <label style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "13px" }}>
          <span style={{ color: "#64748b" }}>Placeholder</span>
          <input
            type="text"
            value={props.placeholder}
            onChange={(e) => onUpdate({ placeholder: e.target.value })}
            placeholder="e.g. Enter your email"
            style={{ padding: "6px 8px", border: "1px solid #e2e8f0", borderRadius: "4px", fontSize: "13px" }}
          />
        </label>
      )}

      {needsOptions && (
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <span style={{ color: "#64748b", fontSize: "13px" }}>Options</span>
          {options.map((opt, i) => (
            <div key={i} style={{ display: "flex", gap: "4px", alignItems: "center" }}>
              <input
                type="text"
                value={opt.label}
                onChange={(e) => updateOption(i, "label", e.target.value)}
                placeholder="Label"
                style={{ flex: 1, padding: "4px 6px", border: "1px solid #e2e8f0", borderRadius: "4px", fontSize: "12px" }}
              />
              <button
                onClick={() => removeOption(i)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444", fontSize: "16px" }}
              >
                ×
              </button>
            </div>
          ))}
          <button
            onClick={addOption}
            style={{ padding: "4px 8px", background: "#f1f5f9", border: "1px solid #e2e8f0", borderRadius: "4px", fontSize: "12px", cursor: "pointer" }}
          >
            + Add Option
          </button>
        </div>
      )}

      <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px" }}>
        <input
          type="checkbox"
          checked={props.required}
          onChange={(e) => onUpdate({ required: e.target.checked })}
        />
        <span>Required field</span>
      </label>
    </div>
  );
}

/**
 * Variable inline content - represents a form field placeholder in the template
 */
export const Variable = createReactInlineContentSpec(
  {
    type: "variable",
    propSchema: {
      name: { default: "" },
      label: { default: "" },
      fieldType: { default: "text" },
      placeholder: { default: "" },
      required: { default: false },
      options: { default: "[]" },
    },
    content: "none",
  },
  {
    render: ({ inlineContent, updateInlineContent }) => {
      const [isConfigOpen, setIsConfigOpen] = useState(false);
      const [position, setPosition] = useState({ top: 0, left: 0 });
      const spanRef = useRef<HTMLSpanElement>(null);
      const props = inlineContent.props as unknown as VariableProps;

      const displayText = props.label || props.name || "click to configure";

      const handleUpdate = useCallback(
        (updates: Partial<VariableProps>) => {
          updateInlineContent({
            type: "variable",
            props: { ...props, ...updates },
          });
        },
        [updateInlineContent, props]
      );

      const handleClick = () => {
        if (!isConfigOpen && spanRef.current) {
          const rect = spanRef.current.getBoundingClientRect();
          setPosition({
            top: rect.bottom + 4,
            left: rect.left,
          });
        }
        setIsConfigOpen(!isConfigOpen);
      };

      return (
        <span style={{ position: "relative", display: "inline" }}>
          <span
            ref={spanRef}
            onClick={handleClick}
            style={{
              backgroundColor: isConfigOpen ? "#bae6fd" : "#e0f2fe",
              border: `1px solid ${isConfigOpen ? "#38bdf8" : "#7dd3fc"}`,
              borderRadius: "4px",
              padding: "1px 6px",
              fontFamily: "monospace",
              fontSize: "0.9em",
              color: "#0369a1",
              cursor: "pointer",
              userSelect: "none",
            }}
          >
            {`{{${displayText}}}`}
          </span>

          {isConfigOpen && typeof document !== "undefined" &&
            createPortal(
              <>
                {/* Backdrop to catch clicks outside */}
                <div
                  style={{
                    position: "fixed",
                    inset: 0,
                    zIndex: 9999,
                  }}
                  onClick={() => setIsConfigOpen(false)}
                />
                <VariableConfig
                  props={props}
                  onUpdate={handleUpdate}
                  onClose={() => setIsConfigOpen(false)}
                  position={position}
                />
              </>,
              document.body
            )}
        </span>
      );
    },
  }
);
