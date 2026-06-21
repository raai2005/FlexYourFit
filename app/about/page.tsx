"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 pt-32 pb-20 px-6 relative">
        <div className="absolute inset-x-0 top-0 h-[28rem] bg-grid bg-grid-fade pointer-events-none" />
        <div className="max-w-4xl mx-auto relative z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <span className="chip chip-brand mb-5">Our Mission</span>
            <h1 className="text-4xl md:text-6xl font-bold text-fg mb-6 tracking-tight">
              Empowering Developers to{" "}
              <span className="text-gradient-brand">Succeed</span>
            </h1>
            <p className="text-fg-muted text-lg max-w-2xl mx-auto leading-relaxed">
              We're on a mission to democratize technical interview preparation, making it
              accessible, personalized, and effective for everyone.
            </p>
          </motion.div>

          {/* Story Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="surface-card p-8 md:p-12 mb-16"
          >
            <h2 className="text-2xl font-bold text-fg mb-4">My Story</h2>
            <div className="space-y-4 text-fg-muted leading-relaxed">
              <p>
                FlexYourFit started with a simple observation: technical interviews are
                stressful, often biased, and rarely reflect a candidate's true potential.
              </p>
              <p>
                I built this AI-powered platform to simulate real-world interview scenarios,
                providing a safe space for developers to practice, fail, and improve before the
                stakes catch up.
              </p>
              <p>
                Today, I help developers land jobs at top tech companies by giving them the
                confidence and feedback they need to shine.
              </p>
            </div>
          </motion.div>

          {/* Team Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h2 className="text-3xl font-bold text-fg text-center mb-12 tracking-tight">
              Meet the Team
            </h2>
            <div className="flex justify-center">
              {[{ name: "Megha Roy", role: "Full Stack GenAI Developer" }].map((member, i) => (
                <div key={i} className="text-center group">
                  <div className="w-40 h-40 mx-auto rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 grid place-items-center text-5xl font-bold text-white mb-6 shadow-[0_18px_50px_-12px_rgba(99,102,241,0.6)] group-hover:scale-105 transition-transform duration-300">
                    {member.name.charAt(0)}
                  </div>
                  <h3 className="text-2xl font-bold text-fg mb-1">{member.name}</h3>
                  <p className="text-fg-muted font-medium">{member.role}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;
