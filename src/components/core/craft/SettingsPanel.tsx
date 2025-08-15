"use client";
import { useEditor } from "@craftjs/core";
import React from "react";

export const SettingsPanel = () => {
  const { selected, actions } = useEditor((state, query) => {
    const [selectedId] = state.events.selected;
    if (!selectedId) {
      return { selected: null };
    }

    const node = state.nodes[selectedId];
    if (!node) {
      return { selected: null };
    }

    const componentName = node.data.displayName;
    // Get the actual React component from the resolver using its name
    const resolvedComponent = state.options.resolver[componentName];

    // Access the static 'craft' property to get our custom settings schema
    const settingsSchema = resolvedComponent?.craft?.related?.settingsSchema;

    return {
      selected: {
        id: selectedId,
        name: componentName,
        settings: settingsSchema, // Use the schema we just looked up
        props: node.data.props,
      },
    };
  });

  const setProp = (key: string, value: any) => {
    if (selected) {
      actions.setProp(selected.id, (props) => (props[key] = value));
    }
  };

  const generateField = (field: any) => {
    const { key, type, label, options, allowUndefined } = field;
    const value = selected?.props[key];

    const commonProps = {
      id: key,
      name: key,
      className:
        "w-full px-2 py-1 text-sm bg-gray-100 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500",
    };

    switch (type) {
      case "text":
        return (
          <input
            {...commonProps}
            type="text"
            value={value || ""}
            onChange={(e) => setProp(key, e.target.value)}
          />
        );
      case "textarea":
        return (
          <textarea
            {...commonProps}
            value={value || ""}
            onChange={(e) => setProp(key, e.target.value)}
            rows={3}
          />
        );
      case "color":
        return (
          <input
            {...commonProps}
            type="color"
            value={value || "#000000"}
            onChange={(e) => setProp(key, e.target.value)}
            className="h-8 w-full p-0"
          />
        );
      case "select":
        return (
          <select
            {...commonProps}
            value={value || ""}
            onChange={(e) => setProp(key, e.target.value)}
          >
            {allowUndefined && <option value="">--</option>}
            {options.map((option: string) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      case "boolean":
        return (
          <div className="flex items-center">
            <input
              id={key}
              type="checkbox"
              checked={!!value}
              onChange={(e) => setProp(key, e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-blue-500"
            />
          </div>
        );
      default:
        return (
          <p className="text-xs text-gray-500">Unknown field type: {type}</p>
        );
    }
  };

  return (
    <aside className="w-80 overflow-y-auto border-l border-gray-200 bg-white p-4">
      {selected && selected.settings ? (
        <div>
          <h3 className="mb-4 text-lg font-semibold text-gray-800">
            {selected.name} Settings
          </h3>
          {selected.settings.groups.map((group: any) => (
            <div key={group.label} className="mb-4">
              <h4 className="text-md mb-2 border-b pb-1 font-medium text-gray-600">
                {group.label}
              </h4>
              <div className="mt-2 space-y-3">
                {group.fields.map((field: any) => (
                  <div
                    key={field.key}
                    className="grid grid-cols-2 items-center gap-2"
                  >
                    <label
                      htmlFor={field.key}
                      className="text-sm font-medium text-gray-700"
                    >
                      {field.label}
                    </label>
                    {generateField(field)}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex h-full items-center justify-center">
          <p className="text-center text-gray-500">
            {selected
              ? `"${selected.name}" has no editable settings.`
              : "Select a component to see its settings."}
          </p>
        </div>
      )}
    </aside>
  );
};
