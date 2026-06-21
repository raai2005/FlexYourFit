"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md"
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
            <svg
              className="w-5 h-5 text-white"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z" />
              <path
                d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"
                opacity="0.7"
              />
            </svg>
          </div>
          <span className="text-lg font-semibold text-white">FlexYourFit</span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className="text-sm font-medium text-zinc-400 hover:text-emerald-500 transition-colors"
          >
            Home
          </Link>
          <Link
            href="#features"
            className="text-sm font-medium text-zinc-400 hover:text-emerald-500 transition-colors"
          >
            Features
          </Link>
          <Link
            href="#how-it-works"
            className="text-sm font-medium text-zinc-400 hover:text-emerald-500 transition-colors"
          >
            How it Works
          </Link>
          <Link
            href="#testimonials"
            className="text-sm font-medium text-zinc-400 hover:text-emerald-500 transition-colors"
          >
            Testimonials
          </Link>
          <Link
            href="#faq"
            className="text-sm font-medium text-zinc-400 hover:text-emerald-500 transition-colors"
          >
            FAQ
          </Link>

          <div className="h-6 w-px bg-zinc-800 mx-2"></div>

          <Link
            href="/sign-in"
            className="text-sm text-zinc-400 hover:text-white transition-colors font-medium"
          >
            Sign in
          </Link>
          <Link
            href="/sign-up"
            className="text-sm px-4 py-2 rounded-lg bg-white text-zinc-950 font-bold hover:bg-zinc-200 transition-colors"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-zinc-400 hover:text-white transition-colors p-2"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>



      {/* Mobile Dropdown */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden border-t border-zinc-800 bg-zinc-950 overflow-hidden"
          >
            <div className="flex flex-col p-4 space-y-4">
              <Link
                href="/"
                className="text-base text-zinc-400 hover:text-white transition-colors font-medium px-2 py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="#features"
                className="text-base text-zinc-400 hover:text-white transition-colors font-medium px-2 py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </Link>
              <Link
                href="#how-it-works"
                className="text-base text-zinc-400 hover:text-white transition-colors font-medium px-2 py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                How it Works
              </Link>
              <Link
                href="#testimonials"
                className="text-base text-zinc-400 hover:text-white transition-colors font-medium px-2 py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                Testimonials
              </Link>
              <Link
                href="#faq"
                className="text-base text-zinc-400 hover:text-white transition-colors font-medium px-2 py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                FAQ
              </Link>
              <div className="h-px bg-zinc-800 my-2"></div>
              <Link
                href="/sign-in"
                className="text-base text-zinc-400 hover:text-white transition-colors font-medium px-2 py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign in
              </Link>
              <Link
                href="/sign-up"
                className="text-base text-center px-4 py-3 rounded-lg bg-white text-zinc-950 font-bold hover:bg-zinc-200 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Get Started
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
