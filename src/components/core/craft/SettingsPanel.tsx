"use client";
import { useEditor } from "@craftjs/core";
import React, { memo, useCallback, useState, useEffect } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  AlignHorizontalJustifyCenter,
  AlignHorizontalJustifyEnd,
  AlignHorizontalJustifyStart,
  AlignVerticalJustifyCenter,
  AlignVerticalJustifyEnd,
  AlignVerticalJustifyStart,
  CaseSensitive,
  CaseUpper,
  CaseLower,
  Pilcrow,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Search,
} from "lucide-react";
import { CustomColorPicker } from "./utils/CustomColorPicker";

// ==================================================================================
// SECTION 1: GOOGLE FONTS DATA
// ==================================================================================
import { POPULAR_GOOGLE_FONTS } from "~/themes";

const loadGoogleFont = (fontName: string) => {
  const fontUrl = `https://fonts.googleapis.com/css2?family=${fontName.replace(/ /g, "+")}:wght@300;400;500;600;700&display=swap`;

  if (document.querySelector(`link[href="${fontUrl}"]`)) {
    return;
  }

  const link = document.createElement("link");
  link.href = fontUrl;
  link.rel = "stylesheet";
  document.head.appendChild(link);
};

// ==================================================================================
// SECTION 2: FONT PICKER COMPONENT
// ==================================================================================

export const FontPicker = memo(
  ({
    value,
    onChange,
  }: {
    value: string;
    onChange: (font: string) => void;
  }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const filteredFonts = POPULAR_GOOGLE_FONTS.filter((font) =>
      font.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    const handleFontSelect = (fontName: string) => {
      loadGoogleFont(fontName);
      onChange(fontName);
      setIsOpen(false);
    };
    useEffect(() => {
      POPULAR_GOOGLE_FONTS.forEach((font) => loadGoogleFont(font.name));
    }, []);
    useEffect(() => {
      if (value && POPULAR_GOOGLE_FONTS.some((font) => font.name === value)) {
        loadGoogleFont(value);
      }
    }, [value]);

    return (
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex w-full items-center justify-between rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-left text-sm focus:ring-2 focus:ring-gray-500 focus:outline-none"
          style={{ fontFamily: value || "inherit" }}
        >
          <span>{value || "Select font..."}</span>
          <ArrowDown
            className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        </button>

        {isOpen && (
          <div className="absolute z-50 mt-1 max-h-64 w-full overflow-hidden rounded-md border border-gray-300 bg-white shadow-lg">
            <div className="border-b border-gray-200 p-2">
              <div className="relative">
                <Search className="absolute top-1/2 left-2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                <input
                  type="text"
                  placeholder="Search fonts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded border border-gray-300 py-1 pr-3 pl-8 text-sm focus:ring-1 focus:ring-gray-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="max-h-48 overflow-y-auto">
              {filteredFonts.map((font) => (
                <button
                  key={font.name}
                  onClick={() => handleFontSelect(font.name)}
                  className={`w-full border-b border-gray-100 px-3 py-2 text-left text-sm last:border-b-0 hover:bg-gray-50 ${
                    value === font.name ? "bg-gray-100 text-gray-700" : ""
                  }`}
                  style={{ fontFamily: font.name }}
                >
                  <div>
                    <div className="font-medium">{font.name}</div>
                    <div className="text-xs text-gray-500 capitalize">
                      {font.category}
                    </div>
                  </div>
                </button>
              ))}

              {filteredFonts.length === 0 && (
                <div className="px-3 py-4 text-center text-sm text-gray-500">
                  No fonts found matching "{searchTerm}"
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  },
);
FontPicker.displayName = "FontPicker";

type ButtonGroupOption = {
  value: string;
  label: string;
  icon: React.ElementType;
};

const ButtonGroup = memo(
  ({
    options,
    value,
    onChange,
  }: {
    options: ButtonGroupOption[];
    value: string;
    onChange: (value: string) => void;
  }) => (
    <div className="flex w-full items-center rounded-md border border-gray-300 bg-gray-100 p-0.5">
      {options.map((option) => {
        const isActive = value === option.value;
        return (
          <button
            key={option.value}
            title={option.label}
            onClick={() => onChange(option.value)}
            className={`flex-1 rounded-[5px] p-1.5 text-gray-600 transition-colors hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:outline-none ${
              isActive ? "!bg-white !text-gray-600 shadow-sm" : ""
            }`}
          >
            <option.icon className="mx-auto h-4 w-4" />
          </button>
        );
      })}
    </div>
  ),
);
ButtonGroup.displayName = "ButtonGroup";

const IconToggleButton = memo(
  ({
    label,
    icon: Icon,
    isActive,
    onClick,
  }: {
    label: string;
    icon: React.ElementType;
    isActive: boolean;
    onClick: () => void;
  }) => (
    <button
      title={label}
      onClick={onClick}
      className={`flex-1 rounded-[5px] p-1.5 text-gray-600 transition-colors hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:outline-none ${
        isActive ? "!bg-gray-50 !text-gray-600" : ""
      }`}
    >
      <Icon className="mx-auto h-4 w-4" />
    </button>
  ),
);
IconToggleButton.displayName = "IconToggleButton";

const CUSTOM_UI_MAP: Record<string, React.FC<any>> = {
  flexDirection: ({ value, onChange, field }) => (
    <ButtonGroup
      value={value}
      onChange={(newValue) => onChange(field.key, newValue)}
      options={[
        { value: "row", label: "Row", icon: ArrowRight },
        { value: "column", label: "Column", icon: ArrowDown },
        { value: "row-reverse", label: "Row Reverse", icon: ArrowLeft },
        { value: "column-reverse", label: "Column Reverse", icon: ArrowUp },
      ]}
    />
  ),
  justifyContent: ({ value, onChange, field }) => (
    <ButtonGroup
      value={value}
      onChange={(newValue) => onChange(field.key, newValue)}
      options={[
        {
          value: "flex-start",
          label: "Justify Start",
          icon: AlignHorizontalJustifyStart,
        },
        {
          value: "center",
          label: "Justify Center",
          icon: AlignHorizontalJustifyCenter,
        },
        {
          value: "flex-end",
          label: "Justify End",
          icon: AlignHorizontalJustifyEnd,
        },
      ]}
    />
  ),
  alignItems: ({ value, onChange, field }) => (
    <ButtonGroup
      value={value}
      onChange={(newValue) => onChange(field.key, newValue)}
      options={[
        {
          value: "flex-start",
          label: "Align Start",
          icon: AlignVerticalJustifyStart,
        },
        {
          value: "center",
          label: "Align Center",
          icon: AlignVerticalJustifyCenter,
        },
        {
          value: "flex-end",
          label: "Align End",
          icon: AlignVerticalJustifyEnd,
        },
      ]}
    />
  ),
  textAlign: ({ value, onChange, field }) => (
    <ButtonGroup
      value={value}
      onChange={(newValue) => onChange(field.key, newValue)}
      options={[
        { value: "left", label: "Align Left", icon: AlignLeft },
        { value: "center", label: "Align Center", icon: AlignCenter },
        { value: "right", label: "Align Right", icon: AlignRight },
        { value: "justify", label: "Justify", icon: AlignJustify },
      ]}
    />
  ),
  textTransform: ({ value, onChange, field }) => (
    <ButtonGroup
      value={value}
      onChange={(newValue) => onChange(field.key, newValue)}
      options={[
        { value: "none", label: "None", icon: Pilcrow },
        { value: "capitalize", label: "Capitalize", icon: CaseSensitive },
        { value: "uppercase", label: "Uppercase", icon: CaseUpper },
        { value: "lowercase", label: "Lowercase", icon: CaseLower },
      ]}
    />
  ),
  fontFamily: ({ value, onChange, field }) => (
    <FontPicker
      value={value}
      onChange={(newValue) => onChange(field.key, newValue)}
    />
  ),
};

const TOGGLE_ICON_MAP: Record<string, React.ElementType> = {
  fontWeight: Bold,
  italic: Italic,
  underline: Underline,
  strike: Strikethrough,
};

export const SettingsPanel = () => {
  const { selected, actions } = useEditor((state) => {
    const [selectedId] = state.events.selected;
    if (!selectedId) return { selected: null };
    const node = state.nodes[selectedId];
    if (!node) return { selected: null };
    const componentName = node.data.displayName;
    const resolvedComponent = state.options.resolver[componentName];
    const settingsSchema = resolvedComponent?.craft?.related?.settingsSchema;
    return {
      selected: {
        id: selectedId,
        name: componentName,
        settings: settingsSchema,
        props: node.data.props,
      },
    };
  });

  const setProp = useCallback(
    (key: string, value: any) => {
      if (selected) {
        actions.setProp(selected.id, (props) => (props[key] = value));
      }
    },
    [selected, actions],
  );

  const generateField = useCallback(
    (field: any) => {
      const { key, type, label, options, allowUndefined, children } = field;
      const value = selected?.props[key];
      const commonProps = {
        id: key,
        name: key,
        className:
          "w-full px-2 py-1 text-sm bg-gray-100 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500",
      };

      const CustomComponent = CUSTOM_UI_MAP[key];
      if (CustomComponent) {
        return (
          <CustomComponent value={value} onChange={setProp} field={field} />
        );
      }

      if (type === "custom-toggle-group") {
        return (
          <div className="flex w-full items-center rounded-md border border-gray-300 bg-gray-100 p-0.5">
            {children.map((childField: any) => {
              const Icon = TOGGLE_ICON_MAP[childField.key];
              if (!Icon) return null;
              let isActive = !!selected?.props[childField.key];
              const handleClick = () => {
                if (childField.valueMap) {
                  const nextValue =
                    selected?.props[childField.key] === childField.valueMap.on
                      ? childField.valueMap.off
                      : childField.valueMap.on;
                  setProp(childField.key, nextValue);
                } else {
                  setProp(childField.key, !selected?.props[childField.key]);
                }
              };
              if (childField.key === "fontWeight") {
                isActive =
                  selected?.props.fontWeight === childField.valueMap.on ||
                  Number(selected?.props.fontWeight) >= 600;
              }
              return (
                <IconToggleButton
                  key={childField.key}
                  label={childField.label}
                  icon={Icon}
                  isActive={isActive}
                  onClick={handleClick}
                />
              );
            })}
          </div>
        );
      }

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
            <CustomColorPicker
              value={value}
              onChange={(color) => setProp(key, color)}
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
                className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-gray-600 focus:ring-gray-500"
              />
            </div>
          );
        default:
          return (
            <p className="text-xs text-gray-500">Unknown field type: {type}</p>
          );
      }
    },
    [selected, setProp],
  );

  return (
    <aside className="overflow-y-auto border-l border-gray-200 bg-white p-4">
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
                {group.fields.map((field: any) => {
                  if (
                    field.type === "textarea" ||
                    field.type === "custom-toggle-group" ||
                    CUSTOM_UI_MAP[field.key]
                  ) {
                    return (
                      <div
                        key={field.key}
                        className="flex w-full flex-col gap-1.5"
                      >
                        <label
                          htmlFor={field.key}
                          className="text-sm font-medium text-gray-700"
                        >
                          {field.label}
                        </label>
                        {generateField(field)}
                      </div>
                    );
                  }
                  return (
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
                  );
                })}
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
