import { SignUp } from '@clerk/nextjs';
import React from 'react';

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-white">Join Elev8</h1>
        <p className="mt-2 text-slate-400">
          Create your account and start networking in Toronto
        </p>
      </div>
      <SignUp
        afterSignUpUrl="/onboarding"
        appearance={{
          elements: {
            rootBox: 'w-full max-w-md',
            card: 'bg-slate-900 border border-slate-800 shadow-xl',
            headerTitle: 'text-white',
            headerSubtitle: 'text-slate-400',
            formButtonPrimary:
              'bg-indigo-600 hover:bg-indigo-700 text-white font-semibold',
            formFieldLabel: 'text-slate-300',
            formFieldInput:
              'bg-slate-800 border-slate-700 text-white focus:border-indigo-500',
            footerActionLink: 'text-indigo-400 hover:text-indigo-300',
            dividerLine: 'bg-slate-700',
            dividerText: 'text-slate-500',
            socialButtonsBlockButton:
              'bg-slate-800 border-slate-700 text-white hover:bg-slate-700',
            socialButtonsBlockButtonText: 'text-white font-medium',
          },
        }}
      />
    </div>
  );
}
