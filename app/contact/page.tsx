"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Mail, Phone, Github, Linkedin } from "lucide-react";

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
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
                    <h1 className="text-4xl font-bold text-white mb-6">Get in Touch</h1>
                    <p className="text-zinc-400 text-lg mb-8 leading-relaxed">
                        Have questions about our platform or enterprise solutions? We'd love to hear from you.
                    </p>
                    
                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-lg bg-zinc-900 flex items-center justify-center border border-zinc-800 text-emerald-500 shrink-0">
                                <Mail className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-white font-medium mb-1">Email Us</h3>
                                <p className="text-zinc-400">roymegha952@gmail.com</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-lg bg-zinc-900 flex items-center justify-center border border-zinc-800 text-emerald-500 shrink-0">
                                <Phone className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-white font-medium mb-1">Phone</h3>
                                <p className="text-zinc-400">+91 7998000577</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-lg bg-zinc-900 flex items-center justify-center border border-zinc-800 text-emerald-500 shrink-0">
                                <Github className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-white font-medium mb-1">GitHub</h3>
                                <a href="https://github.com/raai2005" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-emerald-500 transition-colors">github.com/raai2005</a>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-lg bg-zinc-900 flex items-center justify-center border border-zinc-800 text-emerald-500 shrink-0">
                                <Linkedin className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-white font-medium mb-1">LinkedIn</h3>
                                <a href="https://linkedin.com/in/megha1999r" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-emerald-500 transition-colors">linkedin.com/in/megha1999r</a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
                    <form className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-zinc-400 mb-1">Name</label>
                            <input type="text" className="w-full h-12 rounded-xl bg-zinc-950 border border-zinc-800 text-white px-4 focus:outline-none focus:border-emerald-500 transition-colors" placeholder="Your name" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-zinc-400 mb-1">Email</label>
                            <input type="email" className="w-full h-12 rounded-xl bg-zinc-950 border border-zinc-800 text-white px-4 focus:outline-none focus:border-emerald-500 transition-colors" placeholder="you@company.com" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-zinc-400 mb-1">Message</label>
                            <textarea className="w-full h-32 rounded-xl bg-zinc-950 border border-zinc-800 text-white p-4 focus:outline-none focus:border-emerald-500 transition-colors resize-none" placeholder="How can we help?" />
                        </div>
                        <button type="submit" className="w-full h-12 rounded-xl bg-emerald-500 text-white font-bold hover:bg-emerald-600 transition-colors">
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
