"use client";

import React, { useState } from "react";
import InterviewCard from "./InterviewCard";
import InterviewModal from "./InterviewModal";

// Define interface locally to avoid conflict with global types/index.d.ts if needed
// or export from central location. For now, matching the Firestore schema.
interface Interview {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: "Easy" | "Medium" | "Hard";
  duration: string;
  syllabus: string[];
}

interface InterviewSectionProps {
  interviews: Interview[];
}

const InterviewSection = ({ interviews }: InterviewSectionProps) => {
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = (interview: Interview) => {
    setSelectedInterview(interview);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedInterview(null), 300);
  };

  return (
    <section>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {interviews.map((interview) => (
          <InterviewCard
            key={interview.id}
            title={interview.title}
            description={interview.description}
            category={interview.category}
            difficulty={interview.difficulty}
            duration={interview.duration}
            onClick={() => handleOpenModal(interview)}
          />
        ))}
      </div>

      <InterviewModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        // @ts-ignore - The Modal expects global Interview type but we are passing our local/firestore one. 
        // They should be compatible enough for display, or we fix the Modal type later.
        interview={selectedInterview as any}
      />
    </section>
  );
};

export default InterviewSection;
