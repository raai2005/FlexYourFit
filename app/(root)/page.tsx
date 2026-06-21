"use client";

import { motion, type Variants } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import heroAnimation from "../../public/assets/hero-animation.json";
import LottieAnim from "../components/LottieAnim";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Briefcase, Zap, Trophy, Star, Mic, BarChart3, Route, ArrowRight } from "lucide-react";

const easeOutExpo = [0.16, 1, 0.3, 1] as const;

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: easeOutExpo } },
};

const viewportCfg = { once: false, amount: 0.2 } as const;

const HomePage = () => {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 min-h-screen flex flex-col justify-center">
        {/* Decorative backdrop (non-glass) */}
        <div className="absolute inset-0 bg-grid bg-grid-fade pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.4, scale: 1 }}
          transition={{ duration: 1.4, ease: easeOutExpo }}
          className="absolute -top-24 left-1/3 w-[36rem] h-[36rem] glow-brand pointer-events-none"
        />

        <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
          {/* Left Content */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="flex-1 text-left w-full"
          >
            <motion.div variants={item} className="chip chip-brand mb-7">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-bright animate-pulse" />
              AI-Powered Mock Interviews
            </motion.div>

            <motion.h1
              variants={item}
              className="text-5xl md:text-7xl font-bold text-fg mb-6 leading-[1.05] tracking-tight"
            >
              Ace Your Next
              <br />
              <span className="text-gradient-brand">Technical Interview</span>
            </motion.h1>

            <motion.p
              variants={item}
              className="text-lg text-fg-muted max-w-xl mb-10 leading-relaxed"
            >
              Practice with AI-powered mock interviews tailored to your target companies. Get
              instant feedback and improve your skills.
            </motion.p>

            <motion.div
              variants={item}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4"
            >
              <Link href="/sign-up" className="btn btn-primary h-13 px-8 text-base">
                Start Practicing Free
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="#features" className="btn btn-secondary h-13 px-8 text-base">
                See How It Works
              </Link>
            </motion.div>
          </motion.div>

          {/* Right Visual */}
          <div className="flex-1 relative w-full flex justify-center md:justify-end mt-6 md:mt-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: easeOutExpo, delay: 0.2 }}
              className="relative w-full max-w-lg flex items-center justify-center animate-float"
            >
              <LottieAnim animationData={heroAnimation} className="w-full h-auto max-h-[500px]" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-28 px-6 scroll-mt-20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={item}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.5 }}
            className="text-center mb-16 max-w-2xl mx-auto"
          >
            <span className="chip chip-brand mb-4">Features</span>
            <h2 className="text-3xl md:text-5xl font-bold text-fg mb-5 tracking-tight">
              Everything You Need to Succeed
            </h2>
            <p className="text-fg-muted text-lg">
              Our platform provides all the tools you need to prepare for technical interviews with
              confidence.
            </p>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={viewportCfg}
            className="grid md:grid-cols-3 gap-6"
          >
            {[
              {
                icon: Mic,
                title: "Dynamic AI Interviews",
                description:
                  "Experience realistic, audio-based interviews where our AI adapts questions to your role and responses in real-time.",
              },
              {
                icon: BarChart3,
                title: "Detailed Performance Review",
                description:
                  "Get an instant 0-100 score with feedback on your audio answers, highlighting strengths and improvements to help you grow.",
              },
              {
                icon: Route,
                title: "Personalized Career Roadmap",
                description:
                  "Generate a custom, step-by-step learning path to master your target role, from fundamentals to advanced topics.",
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                variants={item}
                whileHover={{ y: -6, transition: { duration: 0.25, ease: easeOutExpo } }}
                className="group surface-card p-8 transition-[background-color,border-color,box-shadow] duration-300 hover:border-line-strong hover:bg-surface-2 hover:shadow-[var(--shadow-lg)]"
              >
                <div className="w-12 h-12 rounded-xl bg-brand-soft border border-indigo-500/20 grid place-items-center text-brand-bright group-hover:bg-gradient-to-br group-hover:from-indigo-500 group-hover:to-violet-600 group-hover:text-white group-hover:border-transparent transition-all duration-300 mb-6">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-fg mb-3">{feature.title}</h3>
                <p className="text-fg-muted leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 px-6 bg-surface border-y border-line scroll-mt-20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={item}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.5 }}
            className="text-center mb-16 max-w-2xl mx-auto"
          >
            <span className="chip chip-brand mb-4">Process</span>
            <h2 className="text-3xl md:text-5xl font-bold text-fg mb-4 tracking-tight">How It Works</h2>
            <p className="text-fg-muted text-lg">Master your interview skills in 3 simple steps</p>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={viewportCfg}
            className="grid md:grid-cols-3 gap-8 relative"
          >
            {[
              {
                icon: Briefcase,
                title: "Create Your Profile",
                desc: "Enter your target role, years of experience, and tech stack to generate a personalized interview session.",
              },
              {
                icon: Zap,
                title: "Speak with AI",
                desc: "Engage in a natural voice conversation. Our AI listens, understands, and challenges you like a real recruiter.",
              },
              {
                icon: Trophy,
                title: "Improve & Evolve",
                desc: "Get instant ratings, audio transcripts, and a custom roadmap to bridge your knowledge gaps.",
              },
            ].map((step, i) => (
              <motion.div
                key={i}
                variants={item}
                className="relative flex flex-col items-center text-center px-4"
              >
                <div className="relative mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 grid place-items-center text-white shadow-[0_10px_30px_-8px_rgba(99,102,241,0.6)]">
                    <step.icon className="w-7 h-7" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-background border border-line-strong grid place-items-center text-xs font-bold text-brand-bright">
                    {i + 1}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-fg mb-3">{step.title}</h3>
                <p className="text-fg-muted leading-relaxed">{step.desc}</p>

                {i < 2 && (
                  <div className="hidden md:block absolute top-8 left-[62%] w-[76%] h-px bg-gradient-to-r from-line-strong to-transparent" />
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-28 px-6 scroll-mt-20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={item}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.5 }}
            className="text-center mb-16 max-w-2xl mx-auto"
          >
            <span className="chip chip-brand mb-4">Testimonials</span>
            <h2 className="text-3xl md:text-5xl font-bold text-fg tracking-tight">Loved by Developers</h2>
          </motion.div>
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={viewportCfg}
            className="grid md:grid-cols-3 gap-6"
          >
            {[
              {
                name: "Sarah Chen",
                role: "Software Engineer at Google",
                content:
                  "The AI questions were surprisingly accurate to what I faced in my actual interview. It helped me calm my nerves.",
                avatar: "SC",
                g: "from-indigo-500 to-violet-600",
              },
              {
                name: "Michael Ross",
                role: "Frontend Dev at Amazon",
                content:
                  "Direct feedback on my answers was a game changer. I realized I was rambling too much. Highly recommended!",
                avatar: "MR",
                g: "from-emerald-500 to-teal-600",
              },
              {
                name: "David Kim",
                role: "Full Stack Developer",
                content:
                  "I used this for a week before my onsite and got the offer. The system design questions were clearer than other platforms.",
                avatar: "DK",
                g: "from-amber-500 to-orange-600",
              },
            ].map((t, i) => (
              <motion.div
                key={i}
                variants={item}
                whileHover={{ y: -4, transition: { duration: 0.25, ease: easeOutExpo } }}
                className="surface-card p-8 flex flex-col transition-[background-color,border-color,box-shadow] duration-300 hover:border-line-strong hover:shadow-[var(--shadow-lg)]"
              >
                <div className="flex items-center gap-1 text-amber-400 mb-5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-fg/90 mb-6 leading-relaxed flex-1">&ldquo;{t.content}&rdquo;</p>
                <div className="flex items-center gap-3 pt-5 border-t border-line">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.g} grid place-items-center text-white font-bold text-sm`}>
                    {t.avatar}
                  </div>
                  <div>
                    <div className="text-fg font-semibold text-sm">{t.name}</div>
                    <div className="text-fg-subtle text-xs">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 px-6 bg-surface border-y border-line scroll-mt-20">
        <div className="max-w-3xl mx-auto">
          <motion.h2
            variants={item}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.6 }}
            className="text-3xl md:text-5xl font-bold text-center text-fg mb-12 tracking-tight"
          >
            Frequently Asked Questions
          </motion.h2>
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={viewportCfg}
            className="space-y-4"
          >
            {[
              { q: "Is FlexYourFit free to use?", a: "Yes! We offer a free tier that gives you access to basic mock interviews and feedback. We also have premium plans for unlimited practice." },
              { q: "What kind of questions does it ask?", a: "Our AI generates questions based on your specific role (Frontend, Backend, etc.) and experience level, covering algorithms, system design, and behavioral topics." },
              { q: "Can I review my past interviews?", a: "Absolutely. All your interview sessions are saved, complete with transcripts and AI feedback, so you can track your progress over time." },
              { q: "Is the feedback generated by AI?", a: "Yes, we use advanced Large Language Models (like Gemini) to analyze your responses and provide constructive feedback instantly." },
            ].map((faq, i) => (
              <motion.div key={i} variants={item} className="surface-card p-6 bg-background">
                <h3 className="text-lg font-semibold text-fg mb-2">{faq.q}</h3>
                <p className="text-fg-muted leading-relaxed">{faq.a}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={item}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.3 }}
            className="relative overflow-hidden rounded-3xl border border-indigo-500/20 bg-gradient-to-br from-indigo-600/20 via-surface to-violet-600/10 p-8 md:p-14"
          >
            <div className="absolute -top-20 -right-10 w-80 h-80 glow-brand opacity-40 pointer-events-none" />
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
              <div className="max-w-xl text-left">
                <h2 className="text-3xl md:text-5xl font-bold text-fg mb-4 tracking-tight">
                  Ready to Ace Your Next Interview?
                </h2>
                <p className="text-fg-muted mb-8 text-lg leading-relaxed">
                  Join thousands of developers who have improved their interview skills with
                  FlexYourFit. Get started today.
                </p>
                <Link href="/sign-up" className="btn btn-primary h-13 px-8 text-base">
                  Get Started for Free
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>

              <div
                className="hidden md:block relative w-96 h-96 -my-12 -mr-12"
                style={{
                  maskImage: "linear-gradient(to right, transparent, black 50%)",
                  WebkitMaskImage: "linear-gradient(to right, transparent, black 50%)",
                }}
              >
                <Image src="/assets/hero-interview.png" alt="AI Interview Companion" fill className="object-contain" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
