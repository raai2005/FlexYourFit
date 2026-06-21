import React, { useEffect, useState } from "react";
import Link from "next/link";
import { X, Clock, CheckCircle2, ArrowRight } from "lucide-react";

interface Interview {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: "Easy" | "Medium" | "Hard";
  duration: string;
  syllabus: string[];
}

interface InterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  interview: Interview | null;
}

const InterviewModal = ({ isOpen, onClose, interview }: InterviewModalProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      document.body.style.overflow = "hidden";
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      document.body.style.overflow = "unset";
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isVisible && !isOpen) return null;

  if (!interview) return null;

  const difficultyColor =
    interview.difficulty === "Easy"
      ? "text-emerald-300 bg-emerald-500/10 border-emerald-500/25"
      : interview.difficulty === "Medium"
      ? "text-amber-300 bg-amber-500/10 border-amber-500/25"
      : "text-rose-300 bg-rose-500/10 border-rose-500/25";

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-300 ${
        isOpen ? "bg-black/75" : "bg-black/0 pointer-events-none"
      }`}
      onClick={onClose}
    >
      <div
        className={`bg-surface border border-line w-full max-w-2xl rounded-2xl shadow-[var(--shadow-lg)] transform transition-all duration-300 flex flex-col max-h-[90vh] ${
          isOpen ? "scale-100 opacity-100 translate-y-0" : "scale-95 opacity-0 translate-y-4"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-line flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="chip">{interview.category}</span>
              <span className={`chip border ${difficultyColor}`}>{interview.difficulty}</span>
            </div>
            <h2 className="text-2xl font-bold text-fg">{interview.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-surface-2 text-fg-muted hover:text-fg transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          <div className="space-y-6">
            <div>
              <h3 className="text-xs font-semibold text-fg-subtle mb-2 uppercase tracking-[0.1em]">
                Overview
              </h3>
              <p className="text-fg-muted leading-relaxed">{interview.description}</p>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-fg-subtle mb-3 uppercase tracking-[0.1em]">
                Key Topics & Syllabus
              </h3>
              <div className="bg-surface-2 rounded-xl p-4 border border-line">
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {interview.syllabus.map((topic, index) => (
                    <li key={index} className="flex items-start gap-2 text-fg-muted text-sm">
                      <CheckCircle2 className="w-5 h-5 text-brand-bright flex-shrink-0" />
                      {topic}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-surface-2 p-4 rounded-xl border border-line">
              <div className="p-2 rounded-full bg-surface-3 text-fg-muted">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-medium text-fg">Estimated Duration</div>
                <div className="text-xs text-fg-muted">{interview.duration}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-line bg-surface-2/40 rounded-b-2xl flex justify-end gap-3">
          <button onClick={onClose} className="btn btn-secondary h-11 px-5">
            Cancel
          </button>
          <Link href={`/interview/${interview.id}/start`} className="btn btn-primary h-11 px-6">
            Start Interview
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default InterviewModal;
