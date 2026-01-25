"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
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
        <div className="hidden md:flex items-center gap-4">
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
      {isMenuOpen && (
        <div className="md:hidden border-t border-zinc-800 bg-zinc-950">
          <div className="flex flex-col p-4 space-y-4">
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
        </div>
      )}
    </nav>
  );
};

export default Navbar;
