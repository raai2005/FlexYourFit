import React, { useEffect, useState } from "react";
import Link from "next/link";

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

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-300 ${
        isOpen ? "bg-black/80 backdrop-blur-sm" : "bg-black/0 backdrop-blur-none pointer-events-none"
      }`}
      onClick={onClose}
    >
      <div
        className={`bg-zinc-900 border border-zinc-800 w-full max-w-2xl rounded-2xl shadow-2xl transform transition-all duration-300 flex flex-col max-h-[90vh] ${
          isOpen ? "scale-100 opacity-100 translate-y-0" : "scale-95 opacity-0 translate-y-4"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-zinc-800 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 rounded-full border border-zinc-800 bg-zinc-950 text-xs font-medium text-zinc-400">
                {interview.category}
              </span>
              <span
                className={`px-3 py-1 rounded-full border text-xs font-medium ${
                  interview.difficulty === "Easy"
                    ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                    : interview.difficulty === "Medium"
                    ? "text-amber-400 bg-amber-500/10 border-amber-500/20"
                    : "text-rose-400 bg-rose-500/10 border-rose-500/20"
                }`}
              >
                {interview.difficulty}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white">{interview.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-zinc-300 mb-2 uppercase tracking-wider">Overview</h3>
              <p className="text-zinc-400 leading-relaxed">
                {interview.description}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-zinc-300 mb-3 uppercase tracking-wider">Key Topics & Syllabus</h3>
              <div className="bg-zinc-950/50 rounded-xl p-4 border border-zinc-800/50">
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {interview.syllabus.map((topic, index) => (
                    <li key={index} className="flex items-start gap-2 text-zinc-400 text-sm">
                      <svg className="w-5 h-5 text-emerald-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      {topic}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-zinc-800/30 p-4 rounded-lg border border-zinc-800/500">
               <div className="p-2 rounded-full bg-zinc-800 text-zinc-300">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
               </div>
               <div>
                  <div className="text-sm font-medium text-white">Estimated Duration</div>
                  <div className="text-xs text-zinc-400">{interview.duration}</div>
               </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-zinc-800 bg-zinc-900/50 rounded-b-2xl flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg border border-zinc-700 text-zinc-300 font-medium hover:bg-zinc-800 transition-colors"
          >
            Cancel
          </button>
          <Link
            href={`/interview/${interview.id}/start`}
            className="px-6 py-2.5 rounded-lg bg-white text-zinc-900 font-semibold hover:bg-zinc-200 transition-colors flex items-center gap-2"
          >
            Start Interview
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default InterviewModal;
