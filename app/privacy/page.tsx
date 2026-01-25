"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      <Navbar />

      <main className="flex-1 pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-2">Privacy Policy</h1>
          <p className="text-zinc-500 mb-8">Last Updated: January 25, 2026</p>

          <div className="prose prose-invert prose-emerald max-w-none space-y-8 text-zinc-400">
            <section>
                <h2 className="text-xl font-bold text-white mb-4">1. Introduction</h2>
                <p>
                    Welcome to FlexYourFit. We value your privacy and are committed to protecting your personal data. This privacy policy explains how we look after your personal data when you visit our website and tell you about your privacy rights.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-bold text-white mb-4">2. Data We Collect</h2>
                <p>
                    We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows:
                </p>
                <ul className="list-disc pl-5 space-y-2 mt-2">
                    <li><strong>Identity Data:</strong> includes first name, last name, username or similar identifier.</li>
                    <li><strong>Contact Data:</strong> includes email address and telephone number.</li>
                    <li><strong>Technical Data:</strong> includes internet protocol (IP) address, your login data, browser type and version.</li>
                    <li><strong>Usage Data:</strong> includes information about how you use our website, products and services (including interview transcripts).</li>
                </ul>
            </section>

            <section>
                <h2 className="text-xl font-bold text-white mb-4">3. How We Use Your Data</h2>
                <p>
                    We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
                </p>
                <ul className="list-disc pl-5 space-y-2 mt-2">
                    <li>To register you as a new customer.</li>
                    <li>To provide and improve our AI interview services.</li>
                    <li>To manage our relationship with you.</li>
                </ul>
            </section>

            <section>
                <h2 className="text-xl font-bold text-white mb-4">4. Data Security</h2>
                <p>
                    We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed.
                </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPage;
