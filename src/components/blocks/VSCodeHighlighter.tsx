"use client";

import React from "react";

interface VSCodeHighlighterProps {
  code: string;
  language?: string;
  filename?: string;
}

// Token types for VS Code Dark+ Theme
const KEYWORDS = new Set([
  "import", "export", "default", "from", "function", "const", "let", "var",
  "return", "async", "await", "if", "else", "for", "while", "do", "switch",
  "case", "break", "try", "catch", "finally", "throw", "new", "class",
  "extends", "interface", "type", "enum", "implements", "typeof", "instanceof",
  "def", "fn", "pub", "struct", "use", "mod", "impl", "trait", "where",
  "SELECT", "FROM", "WHERE", "JOIN", "LEFT", "RIGHT", "GROUP", "BY", "ORDER",
  "INSERT", "INTO", "UPDATE", "DELETE", "CREATE", "TABLE", "DROP", "ALTER",
  "public", "private", "protected", "static", "readonly", "override", "as",
]);

const BUILTINS = new Set([
  "true", "false", "null", "undefined", "None", "True", "False",
  "this", "self", "super", "void", "any", "unknown", "never", "boolean",
  "string", "number", "bigint", "symbol", "object",
]);

/**
 * Parses raw code into styled JSX spans matching VS Code Dark+ theme
 */
export function VSCodeHighlighter({ code, language = "typescript", filename }: VSCodeHighlighterProps) {
  const lines = code.split("\n");

  return (
    <div
      className="rounded-lg overflow-hidden my-3 font-mono text-xs shadow-2xl"
      style={{ backgroundColor: "#1e1e1e", border: "1px solid #2d2d2d" }}
    >
      {/* Header Bar */}
      <div
        className="flex items-center justify-between px-4 py-2 text-xs border-b select-none"
        style={{ backgroundColor: "#252526", borderColor: "#2d2d2d", color: "#cccccc" }}
      >
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: "#ff5f56" }} />
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: "#ffbd2e" }} />
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: "#27c93f" }} />
          {filename && <span className="ml-2 font-medium text-[#cccccc]">{filename}</span>}
        </div>
        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded" style={{ backgroundColor: "#1e1e1e", color: "#858585" }}>
          {language}
        </span>
      </div>

      {/* Code Editor Body with Line Numbers */}
      <div className="overflow-x-auto p-4 leading-relaxed font-mono">
        <table className="w-full border-collapse text-left">
          <tbody>
            {lines.map((line, idx) => (
              <tr key={idx} className="hover:bg-[#2a2d2e] transition-colors">
                <td
                  className="pr-4 text-right select-none text-[11px]"
                  style={{ color: "#858585", width: "30px", minWidth: "30px" }}
                >
                  {idx + 1}
                </td>
                <td className="whitespace-pre pl-2" style={{ color: "#d4d4d4" }}>
                  {tokenizeLine(line)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/**
 * Tokenize a single line into colored React elements
 */
function tokenizeLine(line: string): React.ReactNode[] {
  if (!line) return [" "];

  const elements: React.ReactNode[] = [];
  let index = 0;
  let keyCount = 0;

  while (index < line.length) {
    // 1. Single-line Comment
    if (line.slice(index).startsWith("//") || line.slice(index).startsWith("# ")) {
      elements.push(
        <span key={keyCount++} style={{ color: "#6a9955", fontStyle: "italic" }}>
          {line.slice(index)}
        </span>
      );
      break;
    }

    // 2. String literal ("...", '...', `...`)
    const char = line[index];
    if (char === '"' || char === "'" || char === "`") {
      let strEnd = index + 1;
      while (strEnd < line.length) {
        if (line[strEnd] === '\\') {
          strEnd += 2;
          continue;
        }
        if (line[strEnd] === char) {
          strEnd++;
          break;
        }
        strEnd++;
      }
      elements.push(
        <span key={keyCount++} style={{ color: "#ce9178" }}>
          {line.slice(index, strEnd)}
        </span>
      );
      index = strEnd;
      continue;
    }

    // 3. JSX / HTML Component Tag (<Button, </div)
    const tagMatch = line.slice(index).match(/^<\/?([A-Za-z0-9_-]+)/);
    if (tagMatch) {
      const fullTag = tagMatch[0];
      const isComponent = /^[A-[#Z]/.test(tagMatch[1]);
      elements.push(
        <span key={keyCount++} style={{ color: isComponent ? "#4ec9b0" : "#569cd6" }}>
          {fullTag}
        </span>
      );
      index += fullTag.length;
      continue;
    }

    // 4. Identifier / Word token
    const wordMatch = line.slice(index).match(/^[A-Za-z_$][A-Za-z0-9_$]*/);
    if (wordMatch) {
      const word = wordMatch[0];
      const isFunction = line.slice(index + word.length).trim().startsWith("(");
      const isType = /^[A-Z]/.test(word);

      let color = "#9cdcfe"; // Default variable color (VS Code Light Blue)

      if (KEYWORDS.has(word)) {
        color = "#c586c0"; // Control Flow / Keywords (VS Code Purple/Magenta #c586c0)
        if (word === "import" || word === "export" || word === "from" || word === "function" || word === "const" || word === "var" || word === "let") {
          color = "#569cd6"; // Storage keywords
        }
      } else if (BUILTINS.has(word)) {
        color = "#569cd6"; // Builtins (VS Code Blue)
      } else if (isFunction) {
        color = "#dcdcaa"; // Functions (VS Code Yellow)
      } else if (isType) {
        color = "#4ec9b0"; // Classes / Types (VS Code Teal)
      }

      elements.push(
        <span key={keyCount++} style={{ color }}>
          {word}
        </span>
      );
      index += word.length;
      continue;
    }

    // 5. Numbers (123, 0.45)
    const numMatch = line.slice(index).match(/^[0-9]+(\.[0-9]+)?/);
    if (numMatch) {
      elements.push(
        <span key={keyCount++} style={{ color: "#b5cea8" }}>
          {numMatch[0]}
        </span>
      );
      index += numMatch[0].length;
      continue;
    }

    // 6. Operators / Punctuation
    elements.push(
      <span key={keyCount++} style={{ color: "#d4d4d4" }}>
        {line[index]}
      </span>
    );
    index++;
  }

  return elements;
}
