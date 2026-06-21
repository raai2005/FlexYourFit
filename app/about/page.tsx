"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      <Navbar />

      <main className="flex-1 pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Empowering Developers to <span className="text-emerald-500">Succeed</span>
            </h1>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto leading-relaxed">
              We're on a mission to democratize technical interview preparation, making it accessible, personalized, and effective for everyone.
            </p>
          </motion.div>

          {/* Story Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 md:p-12 mb-16"
          >
            <h2 className="text-2xl font-bold text-white mb-4">My Story</h2>
            <div className="space-y-4 text-zinc-400 leading-relaxed">
                <p>
                    FlexYourFit started with a simple observation: technical interviews are stressful, often biased, and rarely reflect a candidate's true potential.
                </p>
                <p>
                    I built this AI-powered platform to simulate real-world interview scenarios, providing a safe space for developers to practice, fail, and improve before the stakes catch up.
                </p>
                <p>
                    Today, I help developers land jobs at top tech companies by giving them the confidence and feedback they need to shine.
                </p>
            </div>
          </motion.div>

          {/* Team Section */}
          <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h2 className="text-3xl font-bold text-white text-center mb-12">Meet the Team</h2>
            <div className="flex justify-center">
                {[
                    { name: "Megha Roy", role: "Full Stack GenAI Developer", bg: "bg-emerald-500" },
                ].map((member, i) => (
                    <div key={i} className="text-center group">
                        <div className={`w-40 h-40 mx-auto rounded-full ${member.bg} flex items-center justify-center text-4xl font-bold text-white mb-6 shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-300`}>
                            {member.name.charAt(0)}
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">{member.name}</h3>
                        <p className="text-zinc-400 font-medium">{member.role}</p>
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
