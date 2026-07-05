import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-950 text-white">
      {/* Hero Section */}
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex px-8">
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Elev8
          </h1>
          <p className="text-xl text-slate-400 mb-8 max-w-xl">
            The localized professional network layer for Toronto.
            AI-powered matching for people, events, and opportunities.
          </p>

          {/* CTA Buttons */}
          <div className="flex gap-4 justify-center lg:justify-start">
            <Link
              href="/sign-in"
              className="rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className="rounded-lg border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-300 hover:bg-slate-800 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl px-8">
        <div className="p-6 border border-slate-800 rounded-lg bg-slate-900/50 hover:border-indigo-800/50 transition-colors">
          <div className="text-indigo-400 text-2xl mb-3">🤖</div>
          <h2 className="text-xl font-semibold mb-2">AI Recommendations</h2>
          <p className="text-slate-400">
            Discover people you should meet based on your goals, industry, and community.
          </p>
        </div>

        <div className="p-6 border border-slate-800 rounded-lg bg-slate-900/50 hover:border-indigo-800/50 transition-colors">
          <div className="text-indigo-400 text-2xl mb-3">📅</div>
          <h2 className="text-xl font-semibold mb-2">Event Discovery</h2>
          <p className="text-slate-400">
            Curated Toronto events for founders, investors, and operators.
          </p>
        </div>

        <div className="p-6 border border-slate-800 rounded-lg bg-slate-900/50 hover:border-indigo-800/50 transition-colors">
          <div className="text-indigo-400 text-2xl mb-3">☕</div>
          <h2 className="text-xl font-semibold mb-2">Coffee Chat Matching</h2>
          <p className="text-slate-400">
            Intent-based matching with smart scheduling for meaningful connections.
          </p>
        </div>
      </div>

      {/* Trust Bar */}
      <div className="mt-16 w-full max-w-5xl px-8">
        <div className="border-t border-slate-800 pt-8 text-center">
          <p className="text-xs text-slate-600">
            Built for the Toronto professional community • PIPEDA compliant • Data you control
          </p>
        </div>
      </div>
    </main>
  );
}
