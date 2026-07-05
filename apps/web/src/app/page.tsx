import React from 'react';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-slate-950 text-white">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <h1 className="text-4xl font-bold mb-8">Elev8 Guild: Toronto AI Networking</h1>
        <p className="text-xl text-slate-400">
          The localized professional network layer for Toronto.
        </p>
      </div>
      
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
        <div className="p-6 border border-slate-800 rounded-lg bg-slate-900/50">
          <h2 className="text-2xl font-semibold mb-4">AI Recommendations</h2>
          <p className="text-slate-400">Discover people you should meet in the Toronto tech ecosystem.</p>
        </div>
        <div className="p-6 border border-slate-800 rounded-lg bg-slate-900/50">
          <h2 className="text-2xl font-semibold mb-4">Event Discovery</h2>
          <p className="text-slate-400">Localized event layer for founders, investors, and operators.</p>
        </div>
      </div>
    </main>
  );
}
