import Link from "next/link";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
              <svg
                className="w-5 h-5 text-zinc-900"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z" />
                <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" opacity="0.7" />
              </svg>
            </div>
            <span className="text-lg font-semibold text-white">
              Study Companion
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/sign-in"
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/sign-up"
              className="text-sm px-4 py-2 rounded-lg bg-white text-zinc-900 font-medium hover:bg-zinc-200 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900/50 text-zinc-400 text-sm mb-8">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            AI-Powered Mock Interviews
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Ace Your Next
            <br />
            <span className="text-zinc-500">Technical Interview</span>
          </h1>

          <p className="text-lg text-zinc-400 max-w-2xl mx-auto mb-10">
            Practice with AI-powered mock interviews tailored to your target
            companies. Get instant feedback and improve your skills.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/sign-up"
              className="w-full sm:w-auto px-8 py-3 rounded-lg bg-white text-zinc-900 font-semibold hover:bg-zinc-200 transition-all duration-200"
            >
              Start Practicing Free
            </Link>
            <Link
              href="#features"
              className="w-full sm:w-auto px-8 py-3 rounded-lg border border-zinc-800 text-zinc-300 font-medium hover:bg-zinc-900/50 hover:border-zinc-700 transition-all duration-200"
            >
              See How It Works
            </Link>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-zinc-800/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-10 w-96 h-96 bg-zinc-800/10 rounded-full blur-3xl"></div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y border-zinc-800/50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "10K+", label: "Users" },
              { value: "50K+", label: "Interviews" },
              { value: "95%", label: "Success Rate" },
              { value: "500+", label: "Companies" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-zinc-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-zinc-400 max-w-xl mx-auto">
              Our platform provides all the tools you need to prepare for
              technical interviews.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
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
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                ),
                title: "AI Mock Interviews",
                description:
                  "Practice with our AI interviewer that simulates real interview scenarios.",
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
                title: "Instant Feedback",
                description:
                  "Get detailed feedback on your answers with actionable improvement tips.",
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
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                ),
                title: "Question Bank",
                description:
                  "Access hundreds of curated questions from top tech companies.",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="group p-6 rounded-2xl border border-zinc-800 bg-zinc-900/30 hover:bg-zinc-900/50 hover:border-zinc-700 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-white group-hover:bg-zinc-700 transition-all duration-300 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-zinc-400 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="p-12 rounded-3xl border border-zinc-800 bg-zinc-900/30">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Start Practicing?
            </h2>
            <p className="text-zinc-400 mb-8">
              Join thousands of developers who have improved their interview
              skills with Study Companion.
            </p>
            <Link
              href="/sign-up"
              className="inline-flex px-8 py-3 rounded-lg bg-white text-zinc-900 font-semibold hover:bg-zinc-200 transition-all duration-200"
            >
              Get Started for Free
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800/50 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-white flex items-center justify-center">
              <svg
                className="w-4 h-4 text-zinc-900"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z" />
                <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" opacity="0.7" />
              </svg>
            </div>
            <span className="text-sm text-zinc-400">Study Companion</span>
          </div>
          <div className="text-sm text-zinc-500">
            © 2026 Study Companion. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;