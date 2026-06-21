import React from "react";
import Link from "next/link";
import { Github, Twitter, Linkedin } from "lucide-react";

const socials = [
  { icon: Github, href: "#", label: "GitHub" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
];

const Footer = () => {
  return (
    <footer className="bg-background border-t border-line pt-16 pb-8 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="grid place-items-center w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-[0_6px_20px_-6px_rgba(99,102,241,0.6)]">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z" />
                  <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" opacity="0.7" />
                </svg>
              </div>
              <span className="text-lg font-bold tracking-tight text-fg">FlexYourFit</span>
            </Link>
            <p className="text-fg-muted text-sm leading-relaxed mb-6 max-w-xs">
              Master your technical interviews with AI-powered mock sessions, real-time
              feedback, and personalized roadmaps.
            </p>
            <div className="flex items-center gap-3">
              {socials.map(({ icon: Icon, href, label }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  className="grid place-items-center w-9 h-9 rounded-lg bg-surface-2 border border-line text-fg-muted hover:text-fg hover:border-line-strong hover:bg-surface-3 transition-all"
                >
                  <Icon className="w-[18px] h-[18px]" />
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-fg mb-4 text-sm">Product</h3>
            <ul className="space-y-3 text-sm text-fg-muted">
              <li><Link href="/#features" className="hover:text-brand-bright transition-colors">Features</Link></li>
              <li><Link href="/#how-it-works" className="hover:text-brand-bright transition-colors">How it Works</Link></li>
              <li><Link href="/#testimonials" className="hover:text-brand-bright transition-colors">Testimonials</Link></li>
              <li><Link href="/#faq" className="hover:text-brand-bright transition-colors">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-fg mb-4 text-sm">Company</h3>
            <ul className="space-y-3 text-sm text-fg-muted">
              <li><Link href="/about" className="hover:text-brand-bright transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-brand-bright transition-colors">Contact</Link></li>
              <li><Link href="/privacy" className="hover:text-brand-bright transition-colors">Privacy Policy</Link></li>
              <li><Link href="https://forms.office.com/Pages/ResponsePage.aspx?id=DQSIkWdsW0yxEjajBLZtrQAAAAAAAAAAAAO__oMHtX5UNUI1QVFJTUJHMU4wVUlWNkJZMzZWQ0E0Ui4u" target="_blank" className="hover:text-brand-bright transition-colors">Feedback</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-line pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-fg-subtle text-sm">© 2026 FlexYourFit. All rights reserved.</p>
          <div className="flex gap-8 text-sm text-fg-subtle">
            <Link href="#" className="hover:text-fg transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-fg transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-fg transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
