import React from "react";
import { Clock, ArrowRight } from "lucide-react";

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
    Easy: "text-emerald-300 bg-emerald-500/10 border-emerald-500/25",
    Medium: "text-amber-300 bg-amber-500/10 border-amber-500/25",
    Hard: "text-rose-300 bg-rose-500/10 border-rose-500/25",
  }[difficulty];

  return (
    <div
      onClick={onClick}
      className="group surface-card-interactive p-6 flex flex-col h-full cursor-pointer"
    >
      <div className="flex flex-col h-full">
        <div className="flex items-start justify-between mb-4">
          <div className="chip">{category}</div>
          <div className={`chip border ${difficultyColor}`}>{difficulty}</div>
        </div>

        <h3 className="text-xl font-bold text-fg mb-2 group-hover:text-brand-bright transition-colors">
          {title}
        </h3>
        <p className="text-fg-muted text-sm mb-6 flex-grow leading-relaxed">{description}</p>

        <div className="flex items-center justify-between mt-auto pt-5 border-t border-line">
          <div className="flex items-center gap-1.5 text-fg-subtle text-sm">
            <Clock className="w-4 h-4" />
            {duration}
          </div>
          <span className="text-sm font-semibold text-fg group-hover:text-brand-bright transition-colors flex items-center gap-1.5">
            View Details
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </div>
  );
};

export default InterviewCard;
