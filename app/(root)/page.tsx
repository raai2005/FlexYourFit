"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import heroAnimation from '../../public/assets/hero-animation.json';
import LottieAnim from "../components/LottieAnim";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  Briefcase, 
  Zap,
  Trophy,
  Star,
  Github,
  Twitter,
  Linkedin,
} from "lucide-react";
// But I need to use multi_replace.
// Canceling this thought process to switch to multi_replace.

const HomePage = () => {
  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden min-h-screen flex flex-col justify-center">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
          
          {/* Left Content */}
          <div className="flex-1 text-left z-10 w-full">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900 text-zinc-400 text-sm mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              AI-Powered Mock Interviews
            </motion.div>

            <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-4xl md:text-7xl font-bold text-white mb-6 leading-tight"
            >
              Ace Your Next
              <br />
              <span className="text-emerald-500">Technical Interview</span>
            </motion.h1>

            <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-lg text-zinc-400 max-w-xl mb-10 leading-relaxed"
            >
              Practice with AI-powered mock interviews tailored to your target
              companies. Get instant feedback and improve your skills.
            </motion.p>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center justify-start gap-4 w-full sm:w-auto"
            >
              <Link
                href="/sign-up"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white text-zinc-950 font-bold text-lg hover:bg-zinc-200 transition-all duration-200 text-center"
              >
                Start Practicing Free
              </Link>
              <Link
                href="#features"
                className="w-full sm:w-auto px-8 py-4 rounded-xl border border-zinc-800 text-zinc-300 font-medium hover:bg-zinc-900 hover:border-zinc-700 transition-all duration-200 text-center"
              >
                See How It Works
              </Link>
            </motion.div>
          </div>

          {/* Right Visual */}
          <div className="flex-1 relative w-full flex justify-center md:justify-end mt-10 md:mt-0">
             <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7 }}
                className="relative w-full max-w-lg flex items-center justify-center animate-float"
             >
                <LottieAnim animationData={heroAnimation} className="w-full h-auto max-h-[500px]" />
             </motion.div>
          </div>
        </div>
      </section>



      {/* Stats Section */}
      <section className="py-20 bg-zinc-900 border-y border-zinc-800">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "10K+", label: "Users" },
              { value: "50K+", label: "Interviews" },
              { value: "95%", label: "Success Rate" },
              { value: "500+", label: "Companies" },
            ].map((stat, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-sm font-medium text-zinc-500 uppercase tracking-wider">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 px-6 bg-zinc-950">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-20"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Everything You Need to Succeed
            </h2>
            <p className="text-zinc-400 max-w-xl mx-auto text-lg">
              Our platform provides all the tools you need to prepare for
              technical interviews with confidence.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                    />
                  </svg>
                ),
                title: "Dynamic AI Interviews",
                description:
                  "Experience realistic, audio-based interviews where our AI adapts questions to your role and responses in real-time.",
              },
              {
                icon: (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                ),
                title: "Detailed Performance Review",
                description:
                  "Get an instant 0-100 score with feedback on your audio answers, highlighting strengths and improvements to help you grow.",
              },
              {
                icon: (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                    />
                  </svg>
                ),
                title: "Personalized Career Roadmap",
                description:
                  "Generate a custom, step-by-step learning path to master your target role, from fundamentals to advanced topics.",
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group p-8 rounded-2xl border border-zinc-800 bg-zinc-900 hover:border-zinc-700 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-white group-hover:bg-emerald-500 transition-all duration-300 mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-zinc-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 px-6 bg-zinc-900 relative">
        <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">How It Works</h2>
                <p className="text-zinc-400 text-lg">Master your interview skills in 3 simple steps</p>
            </div>

            <div className="grid md:grid-cols-3 gap-12 relative z-10">
                {[
                    {
                        icon: <Briefcase className="w-8 h-8" />,
                        title: "1. Create Your Profile",
                        desc: "Enter your target role, years of experience, and tech stack to generate a personalized interview session."
                    },
                    {
                        icon: <Zap className="w-8 h-8" />,
                        title: "2. Speak with AI",
                        desc: "Engage in a natural voice conversation. Our AI listens, understands, and challenges you like a real recruiter."
                    },
                    {
                        icon: <Trophy className="w-8 h-8" />,
                        title: "3. Improve & Evolve",
                        desc: "Get instant ratings, audio transcripts, and a custom roadmap to bridge your knowledge gaps."
                    }
                ].map((step, i) => (
                    <motion.div 
                        key={i} 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: i * 0.2 }}
                        className="relative flex flex-col items-center text-center p-6"
                    >
                        <div className="w-16 h-16 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-emerald-500 mb-6 shadow-lg shadow-emerald-500/10">
                            {step.icon}
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                        <p className="text-zinc-400 leading-relaxed">{step.desc}</p>
                        
                        {/* Connector Line (Desktop only) */}
                        {i < 2 && (
                            <div className="hidden md:block absolute top-14 left-[60%] w-[80%] h-[2px] bg-gradient-to-r from-zinc-800 to-transparent z-[-1]" />
                        )}
                    </motion.div>
                ))}
            </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 px-6 bg-zinc-950">
          <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-16">Loved by Developers</h2>
              <div className="grid md:grid-cols-3 gap-8">
                  {[
                      {
                          name: "Sarah Chen",
                          role: "Software Engineer at Google",
                          content: "The AI questions were surprisingly accurate to what I faced in my actual interview. It helped me calm my nerves.",
                          avatar: "SC"
                      },
                      {
                          name: "Michael Ross",
                          role: "Frontend Dev at Amazon",
                          content: "Direct feedback on my answers was a game changer. I realized I was rambling too much. Highly recommended!",
                          avatar: "MR"
                      },
                      {
                          name: "David Kim",
                          role: "Full Stack Developer",
                          content: "I used this for a week before my onsite and got the offer. The system design questions were clearer than other platforms.",
                          avatar: "DK"
                      }
                  ].map((t, i) => (
                      <motion.div 
                        key={i} 
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: i * 0.1 }}
                        className="p-8 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors"
                      >
                          <div className="flex items-center gap-1 text-yellow-500 mb-6">
                              {[1,2,3,4,5].map(star => <Star key={star} className="w-4 h-4 fill-current" />)}
                          </div>
                          <p className="text-zinc-300 mb-6 leading-relaxed">"{t.content}"</p>
                          <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-full bg-emerald-900/30 flex items-center justify-center text-emerald-500 font-bold text-sm">
                                  {t.avatar}
                              </div>
                              <div>
                                  <div className="text-white font-medium">{t.name}</div>
                                  <div className="text-zinc-500 text-sm">{t.role}</div>
                              </div>
                          </div>
                      </motion.div>
                  ))}
              </div>
          </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 px-6 bg-zinc-900">
        <div className="max-w-3xl mx-auto max-h-full">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12">Frequently Asked Questions</h2>
            <div className="space-y-4">
                {[
                    { q: "Is FlexYourFit free to use?", a: "Yes! We offer a free tier that gives you access to basic mock interviews and feedback. We also have premium plans for unlimited practice." },
                    { q: "What kind of questions does it ask?", a: "Our AI generates questions based on your specific role (Frontend, Backend, etc.) and experience level, covering algorithms, system design, and behavioral topics." },
                    { q: "Can I review my past interviews?", a: "Absolutely. All your interview sessions are saved, complete with transcripts and AI feedback, so you can track your progress over time." },
                    { q: "Is the feedback generated by AI?", a: "Yes, we use advanced Large Language Models (like Gemini) to analyze your responses and provide constructive feedback instantly." }
                ].map((faq, i) => (
                    <motion.div 
                        key={i} 
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: i * 0.1 }}
                        className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800"
                    >
                        <h3 className="text-lg font-semibold text-white mb-2">{faq.q}</h3>
                        <p className="text-zinc-400">{faq.a}</p>
                    </motion.div>
                ))}
            </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-zinc-950">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-r from-zinc-900 via-zinc-900 to-zinc-950 p-8 md:p-12"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
              <div className="max-w-xl text-left">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Ready to Ace Your Next Interview?
                </h2>
                <p className="text-zinc-400 mb-8 text-lg leading-relaxed">
                  Join thousands of developers who have improved their interview
                  skills with FlexYourFit. Get started today.
                </p>
                <Link
                  href="/sign-up"
                  className="inline-flex px-8 py-4 rounded-xl bg-white text-zinc-950 font-bold text-lg hover:bg-zinc-200 transition-all duration-200"
                >
                  Get Started for Free
                </Link>
              </div>
              
              <div 
                className="hidden md:block relative w-96 h-96 -my-12 -mr-12"
                 style={{ 
                  maskImage: 'linear-gradient(to right, transparent, black 50%)',
                  WebkitMaskImage: 'linear-gradient(to right, transparent, black 50%)'
                }}
              >
                 <Image
                    src="/assets/hero-interview.png"
                    alt="AI Interview Companion"
                    fill
                    className="object-contain"
                 />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;