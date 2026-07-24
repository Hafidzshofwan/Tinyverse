import React from "react";

interface FormattedMessageProps {
  text: string;
  isUser?: boolean;
}

export function FormattedMessage({ text, isUser = false }: FormattedMessageProps) {
  if (!text) return null;

  // Clean all text inside parentheses (...) and brackets [...]
  const cleanedText = text
    .replace(/\([^)]*\)/g, "")
    .replace(/\[[^\]]*\]/g, "")
    .replace(/ {2,}/g, " ");

  // Split into lines
  const lines = cleanedText.split("\n");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, fontFamily: "'Quicksand', sans-serif" }}>
      {lines.map((line, index) => {
        const trimmed = line.trim();

        // Empty lines act as subtle spacing
        if (!trimmed) {
          return <div key={index} style={{ height: 4 }} />;
        }

        // Header check: #, ##, ###, ####
        if (/^#{1,6}\s+/.test(trimmed)) {
          const headerText = trimmed.replace(/^#{1,6}\s+/, "");
          return (
            <div
              key={index}
              style={{
                fontWeight: 700,
                fontSize: 15,
                color: isUser ? "#ffffff" : "var(--tv-navy, #0a0b5f)",
                marginTop: index === 0 ? 0 : 6,
                marginBottom: 2,
                fontFamily: "'Quicksand', sans-serif",
              }}
            >
              {renderFormattedInline(headerText, isUser)}
            </div>
          );
        }

        // Bullet list check: *, -, +
        if (/^[*-+]\s+/.test(trimmed)) {
          const itemText = trimmed.replace(/^[*-+]\s+/, "");
          return (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 8,
                paddingLeft: 4,
                lineHeight: 1.5,
              }}
            >
              <span
                style={{
                  color: isUser ? "#ffffff" : "#d936a6",
                  fontWeight: 700,
                  fontSize: 14,
                  lineHeight: "1.4",
                }}
              >
                •
              </span>
              <div style={{ flex: 1 }}>{renderFormattedInline(itemText, isUser)}</div>
            </div>
          );
        }

        // Numbered list check: 1. , 2. , etc.
        const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
        if (numMatch) {
          const num = numMatch[1] || "1";
          const itemText = numMatch[2] || "";
          return (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 8,
                paddingLeft: 4,
                lineHeight: 1.5,
              }}
            >
              <span
                style={{
                  color: isUser ? "#ffffff" : "var(--tv-navy, #0a0b5f)",
                  fontWeight: 700,
                  fontSize: 12,
                  backgroundColor: isUser
                    ? "rgba(255, 255, 255, 0.2)"
                    : "rgba(10, 11, 95, 0.08)",
                  padding: "1px 6px",
                  borderRadius: 6,
                  lineHeight: "1.4",
                  marginTop: 2,
                }}
              >
                {num}.
              </span>
              <div style={{ flex: 1 }}>{renderFormattedInline(itemText, isUser)}</div>
            </div>
          );
        }

        // Normal line
        return (
          <div key={index} style={{ lineHeight: 1.55 }}>
            {renderFormattedInline(trimmed, isUser)}
          </div>
        );
      })}
    </div>
  );
}

function renderFormattedInline(text: string, isUser = false): React.ReactNode {
  // Regex to match bold **text**, code `text`, or italic *text*
  const regex = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g;
  const matchParts = text.split(regex);

  return matchParts.map((part, i) => {
    if (!part) return null;

    if (part.startsWith("**") && part.endsWith("**") && part.length >= 4) {
      const boldText = part.slice(2, -2);
      return (
        <strong
          key={i}
          style={{
            fontWeight: 700,
            color: isUser ? "#ffffff" : "inherit",
          }}
        >
          {cleanResidualSymbols(boldText)}
        </strong>
      );
    }

    if (part.startsWith("`") && part.endsWith("`") && part.length >= 2) {
      const codeText = part.slice(1, -1);
      return (
        <code
          key={i}
          style={{
            backgroundColor: isUser
              ? "rgba(255, 255, 255, 0.2)"
              : "rgba(10, 11, 95, 0.06)",
            padding: "2px 6px",
            borderRadius: 4,
            fontSize: "0.9em",
            fontFamily: "inherit",
            color: isUser ? "#ffffff" : "#d936a6",
          }}
        >
          {codeText}
        </code>
      );
    }

    if (
      part.startsWith("*") &&
      part.endsWith("*") &&
      part.length >= 2 &&
      !part.startsWith("**")
    ) {
      const italicText = part.slice(1, -1);
      return (
        <em key={i} style={{ fontStyle: "italic" }}>
          {cleanResidualSymbols(italicText)}
        </em>
      );
    }

    return <React.Fragment key={i}>{cleanResidualSymbols(part)}</React.Fragment>;
  });
}

// Clean any leftover raw markdown symbols (#, *, etc.) or residual parentheses that weren't part of valid blocks
function cleanResidualSymbols(str: string): string {
  if (!str) return "";
  return str
    .replace(/^#+\s*/g, "") // strip leading hashtags
    .replace(/\*\*/g, "")   // strip leftover double asterisks
    .replace(/\*/g, "")    // strip leftover single asterisks
    .replace(/`/g, "")      // strip leftover backticks
    .replace(/\([^)]*\)/g, "") // strip any residual parentheses text
    .replace(/\[[^\]]*\]/g, ""); // strip any residual bracket text
}
