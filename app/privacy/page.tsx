"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const sections = [
  {
    title: "1. Introduction",
    body: (
      <p>
        Welcome to FlexYourFit. We value your privacy and are committed to protecting your
        personal data. This privacy policy explains how we look after your personal data when you
        visit our website and tell you about your privacy rights.
      </p>
    ),
  },
  {
    title: "2. Data We Collect",
    body: (
      <>
        <p>
          We may collect, use, store and transfer different kinds of personal data about you which
          we have grouped together follows:
        </p>
        <ul className="list-disc pl-5 space-y-2 mt-3">
          <li><strong className="text-fg">Identity Data:</strong> includes first name, last name, username or similar identifier.</li>
          <li><strong className="text-fg">Contact Data:</strong> includes email address and telephone number.</li>
          <li><strong className="text-fg">Technical Data:</strong> includes internet protocol (IP) address, your login data, browser type and version.</li>
          <li><strong className="text-fg">Usage Data:</strong> includes information about how you use our website, products and services (including interview transcripts).</li>
        </ul>
      </>
    ),
  },
  {
    title: "3. How We Use Your Data",
    body: (
      <>
        <p>
          We will only use your personal data when the law allows us to. Most commonly, we will use
          your personal data in the following circumstances:
        </p>
        <ul className="list-disc pl-5 space-y-2 mt-3">
          <li>To register you as a new customer.</li>
          <li>To provide and improve our AI interview services.</li>
          <li>To manage our relationship with you.</li>
        </ul>
      </>
    ),
  },
  {
    title: "4. Data Security",
    body: (
      <p>
        We have put in place appropriate security measures to prevent your personal data from being
        accidentally lost, used or accessed in an unauthorized way, altered or disclosed.
      </p>
    ),
  },
];

const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-fg mb-2 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-fg-subtle mb-10">Last Updated: January 25, 2026</p>

          <div className="space-y-8 text-fg-muted leading-relaxed">
            {sections.map((section) => (
              <section key={section.title} className="surface-card p-6 md:p-8">
                <h2 className="text-xl font-bold text-fg mb-4">{section.title}</h2>
                {section.body}
              </section>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPage;
