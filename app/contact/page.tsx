"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Mail, Phone, Github, Linkedin } from "lucide-react";

const contactRows = [
  { icon: Mail, label: "Email Us", value: "roymegha952@gmail.com", href: null },
  { icon: Phone, label: "Phone", value: "+91 7998000577", href: null },
  { icon: Github, label: "GitHub", value: "github.com/raai2005", href: "https://github.com/raai2005" },
  { icon: Linkedin, label: "LinkedIn", value: "linkedin.com/in/megha1999r", href: "https://linkedin.com/in/megha1999r" },
];

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid md:grid-cols-2 gap-12"
          >
            {/* Contact Info */}
            <div>
              <span className="chip chip-brand mb-5">Contact</span>
              <h1 className="text-4xl md:text-5xl font-bold text-fg mb-6 tracking-tight">
                Get in Touch
              </h1>
              <p className="text-fg-muted text-lg mb-8 leading-relaxed">
                Have questions about our platform or enterprise solutions? We'd love to hear from
                you.
              </p>

              <div className="space-y-5">
                {contactRows.map(({ icon: Icon, label, value, href }) => (
                  <div key={label} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-brand-soft grid place-items-center border border-indigo-500/20 text-brand-bright shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-fg font-medium mb-0.5">{label}</h3>
                      {href ? (
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-fg-muted hover:text-brand-bright transition-colors"
                        >
                          {value}
                        </a>
                      ) : (
                        <p className="text-fg-muted">{value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Form */}
            <div className="surface-card p-8">
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-fg-muted mb-1.5">Name</label>
                  <input type="text" className="field" placeholder="Your name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-fg-muted mb-1.5">Email</label>
                  <input type="email" className="field" placeholder="you@company.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-fg-muted mb-1.5">Message</label>
                  <textarea className="field h-32" placeholder="How can we help?" />
                </div>
                <button type="submit" className="btn btn-primary w-full h-12">
                  Send Message
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ContactPage;
