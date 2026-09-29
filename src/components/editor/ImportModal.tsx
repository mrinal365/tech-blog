"use client";

import { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store/articleStore";
import { loadArticle } from "@/store/articleStore";
import { importArticleJSON } from "@/lib/migrations";
import { X, Upload, FileJson, Check, AlertTriangle, XCircle, Copy } from "lucide-react";

interface ImportModalProps {
  onClose: () => void;
}

export function ImportModal({ onClose }: ImportModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [jsonText, setJsonText] = useState("");
  const [validationResult, setValidationResult] = useState<{
    valid: boolean;
    errors: string[];
    warnings: string[];
  } | null>(null);
  const [imported, setImported] = useState(false);
  const [copiedErrors, setCopiedErrors] = useState(false);

  const handleValidateAndImport = (text: string) => {
    const result = importArticleJSON(text);
    setValidationResult(result.validation);

    // ONLY close modal if JSON validation passes AND document is created
    if (result.validation.valid && result.document) {
      dispatch(loadArticle(result.document));
      setImported(true);
      setTimeout(() => onClose(), 1000);
    } else {
      setImported(false);
      // DO NOT close modal when there are validation errors!
    }
  };

  const handleCopyErrors = async () => {
    if (!validationResult) return;
    const errorText = [
      "=== JSON VALIDATION ERROR REPORT ===",
      ...validationResult.errors.map((e, i) => `[Error ${i + 1}] ${e}`),
      ...validationResult.warnings.map((w, i) => `[Warning ${i + 1}] ${w}`),
    ].join("\n");

    try {
      await navigator.clipboard.writeText(errorText);
      setCopiedErrors(true);
      setTimeout(() => setCopiedErrors(false), 2500);
    } catch {
      /* ignore */
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result as string;
      setJsonText(text);
      handleValidateAndImport(text);
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result as string;
      setJsonText(text);
      handleValidateAndImport(text);
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto" style={{ backgroundColor: "rgba(0,0,0,0.85)" }}>
      <div className="w-full max-w-3xl flex flex-col rounded-xl shadow-2xl my-8"
        style={{ backgroundColor: "#1a1a1a", border: "1px solid #2a2a2a" }}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "#2a2a2a" }}>
          <div>
            <h2 className="text-sm font-semibold" style={{ color: "#ffffff" }}>Import Article JSON</h2>
            <p className="text-[11px] text-[#888888] mt-0.5">Validate and load SDE.GUIDE JSON payloads directly into the canvas.</p>
          </div>
          <button onClick={onClose} className="rounded-md p-1.5 hover:bg-[#222222]" style={{ color: "#777777" }}>
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-5 space-y-4 max-h-[85vh] overflow-y-auto">
          {/* Drop Zone */}
          <div
            className="flex flex-col items-center justify-center rounded-xl py-8 cursor-pointer transition-colors hover:border-[#444444]"
            style={{ border: "2px dashed #2a2a2a", backgroundColor: "#121212" }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-7 w-7 mb-2 text-[#888888]" />
            <p className="text-xs font-medium text-[#e8e8e8]">Drop JSON file here</p>
            <p className="mt-0.5 text-[10px] text-[#666666]">or click to browse from disk</p>
            <input ref={fileInputRef} type="file" accept=".json" onChange={handleFileSelect} className="hidden" />
          </div>

          {/* Validation Error Feedback Panel (MODAL STAYS OPEN ON ERROR) */}
          {validationResult && validationResult.errors.length > 0 && (
            <div className="rounded-xl p-4 space-y-3 bg-[#1e1313] border border-red-500/50 shadow-xl">
              <div className="flex items-center justify-between border-b pb-2 border-red-500/30">
                <div className="flex items-center gap-2 text-red-400 font-mono text-xs font-bold">
                  <XCircle className="h-4 w-4 shrink-0" />
                  <span>Validation Failed — Modal Kept Open to Copy & Fix</span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyErrors}
                  className="flex items-center gap-1.5 rounded px-2.5 py-1 text-[11px] font-mono font-bold bg-[#2a1717] hover:bg-[#3d1e1e] border border-red-500/40 text-red-200 transition-colors focus:outline-none"
                  title="Copy error log to paste to LLM or fix"
                >
                  {copiedErrors ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5 text-red-300" />}
                  <span>{copiedErrors ? "Copied Error Log!" : "Copy Error Details"}</span>
                </button>
              </div>

              <div className="space-y-1.5 font-mono text-xs text-red-200">
                {validationResult.errors.map((err, i) => (
                  <div key={i} className="flex items-start gap-2 bg-[#281515] p-2 rounded border border-red-500/20">
                    <span className="font-bold text-red-400 shrink-0">•</span>
                    <span className="break-all">{err}</span>
                  </div>
                ))}
              </div>

              {validationResult.warnings.length > 0 && (
                <div className="pt-2 border-t border-red-500/20 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-amber-400 font-bold block">Warnings:</span>
                  {validationResult.warnings.map((warn, i) => (
                    <div key={i} className="flex items-start gap-2 text-amber-300 text-[11px] font-mono">
                      <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-amber-400 mt-0.5" />
                      <span>{warn}</span>
                    </div>
                  ))}
                </div>
              )}

              <p className="text-[11px] text-[#aaaaaa] font-sans">
                💡 Edit the JSON in the text area below or click <strong>Copy Error Details</strong> to give the error to your LLM to generate fixed JSON!
              </p>
            </div>
          )}

          {/* Success Banner */}
          {imported && (
            <div className="rounded-xl p-3 bg-[#132218] border border-green-500/40 text-green-300 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono font-bold">
                <Check className="h-4 w-4 text-green-400" />
                <span>Article document imported successfully! Loading canvas...</span>
              </div>
            </div>
          )}

          {/* Textarea for Pasting / Editing JSON */}
          <div className="relative">
            <div className="flex items-center justify-between mb-1">
              <p className="text-[10px] font-mono uppercase tracking-widest text-[#777777]">
                JSON Content Editor (Editable)
              </p>
              {jsonText && (
                <span className="text-[10px] font-mono text-[#666666]">
                  {jsonText.length.toLocaleString()} characters
                </span>
              )}
            </div>
            <textarea
              value={jsonText}
              onChange={(e) => {
                setJsonText(e.target.value);
                if (validationResult) setValidationResult(null);
              }}
              placeholder='Paste article JSON here (e.g. {"schemaVersion": "1.0", "article": { ... }})'
              rows={8}
              spellCheck={false}
              className="w-full resize-y rounded-lg p-3 font-mono text-xs outline-none focus:border-[#444444]"
              style={{ backgroundColor: "#121212", border: "1px solid #2a2a2a", color: "#e8e8e8" }}
            />
          </div>

          {/* Import / Validate Button */}
          {!imported && (
            <button
              onClick={() => handleValidateAndImport(jsonText)}
              disabled={!jsonText.trim()}
              className="flex w-full items-center justify-center gap-2 rounded-lg py-3 text-sm font-semibold transition-all hover:bg-[#333333] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              style={{ backgroundColor: "#222222", color: "#ffffff", border: "1px solid #3a3a3a" }}
            >
              <FileJson className="h-4 w-4" style={{ color: "var(--accent-theme)" }} />
              Validate & Import Article JSON
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
