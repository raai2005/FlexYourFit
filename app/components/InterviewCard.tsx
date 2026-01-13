import React from "react";
import Link from "next/link";

interface InterviewCardProps {
  title: string;
  description: string;
  category: string;
  difficulty: "Easy" | "Medium" | "Hard";
  duration: string;
  onClick: () => void;
}

const InterviewCard = ({
  title,
  description,
  category,
  difficulty,
  duration,
  onClick,
}: InterviewCardProps) => {
  const difficultyColor = {
    Easy: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    Medium: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    Hard: "text-rose-400 bg-rose-500/10 border-rose-500/20",
  }[difficulty];

  return (
    <div 
      onClick={onClick}
      className="group p-6 rounded-2xl border border-zinc-800 bg-zinc-900/30 hover:bg-zinc-900/50 hover:border-zinc-700 transition-all duration-300 flex flex-col h-full cursor-pointer relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-zinc-800/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-start justify-between mb-4">
          <div className="px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900 text-xs font-medium text-zinc-400">
            {category}
          </div>
          <div
            className={`px-3 py-1 rounded-full border text-xs font-medium ${difficultyColor}`}
          >
            {difficulty}
          </div>
        </div>

        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
          {title}
        </h3>
        <p className="text-zinc-400 text-sm mb-6 flex-grow">{description}</p>

        <div className="flex items-center justify-between mt-auto pt-6 border-t border-zinc-800/50">
          <div className="flex items-center gap-2 text-zinc-500 text-sm">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {duration}
          </div>
          <span className="text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors flex items-center gap-1">
            View Details
            <svg
              className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </span>
        </div>
      </div>
    </div>
  );
};

export default InterviewCard;
