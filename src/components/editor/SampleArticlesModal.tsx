"use client";

import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store/articleStore";
import { loadArticle } from "@/store/articleStore";
import { DETAILED_SAMPLE_ARTICLES } from "@/data/sampleArticlesData";
import { X, BookOpen, Clock, Layers, ArrowRight, FileText } from "lucide-react";

interface SampleArticlesModalProps {
  onClose: () => void;
}

export function SampleArticlesModal({ onClose }: SampleArticlesModalProps) {
  const dispatch = useDispatch<AppDispatch>();

  const handleSelectSample = (sample: (typeof DETAILED_SAMPLE_ARTICLES)[0]) => {
    dispatch(loadArticle(sample));
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none"
      style={{ backgroundColor: "rgba(0,0,0,0.85)" }}
    >
      <div
        className="w-full max-w-3xl flex flex-col rounded-xl shadow-2xl overflow-hidden"
        style={{ backgroundColor: "#181818", border: "1px solid #2a2a2a" }}
      >
        {/* Modal Header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b shrink-0"
          style={{ borderColor: "#2a2a2a", backgroundColor: "#1c1c1c" }}
        >
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-[#ffffff]" />
            <div>
              <h2 className="text-base font-bold text-[#ffffff]">Sample Article Templates</h2>
              <p className="text-xs text-[#888888]">Load a detailed sample article into the editor with 1 click</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1.5 hover:bg-[#252525] transition-colors"
            style={{ color: "#777777" }}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body — Cards Grid */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {DETAILED_SAMPLE_ARTICLES.map((sample) => (
            <div
              key={sample.article.id}
              onClick={() => handleSelectSample(sample)}
              className="group cursor-pointer rounded-xl p-5 border transition-all hover:bg-[#202020] hover:border-[#555555] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              style={{ backgroundColor: "#141414", borderColor: "#2a2a2a" }}
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="rounded px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase"
                    style={{ backgroundColor: "#222222", border: "1px solid #333333", color: "#ffffff" }}
                  >
                    {sample.article.category}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] font-mono text-[#888888]">
                    <Clock className="h-3 w-3" /> {sample.article.settings.readingTime} min read
                  </span>
                  <span className="flex items-center gap-1 text-[11px] font-mono text-[#888888]">
                    <Layers className="h-3 w-3" /> {sample.article.blocks.length} blocks
                  </span>
                </div>

                <h3 className="text-base font-bold text-[#ffffff] group-hover:text-[#ffffff] transition-colors">
                  {sample.article.title}
                </h3>
                <p className="text-xs text-[#aaaaaa] mt-1 line-clamp-2 leading-relaxed">
                  {sample.article.subtitle}
                </p>
              </div>

              <button
                className="shrink-0 inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold transition-colors group-hover:bg-[#ffffff] group-hover:text-[#121212]"
                style={{ backgroundColor: "#222222", color: "#ffffff", border: "1px solid #3a3a3a" }}
              >
                <span>Load Article</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
