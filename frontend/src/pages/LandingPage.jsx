import React, { useState } from 'react';
import LoginForm from '../components/LoginForm';

const LandingPage = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Navbar */}
      <nav className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 sm:px-8 py-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center p-1">
            <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
              <path d="M12 2L2 22h20L12 2z" fill="#F59E0B" />
              <path d="M12 8L6 20h12L12 8z" fill="#22C55E" />
              <path d="M12 12l-3 6h6l-3-6z" fill="#5B4CF6" />
            </svg>
          </div>
          <div>
            <span className="text-white font-bold text-xl">Shivani Technologies</span>
            <span className="text-primary text-xs ml-2 bg-primary/10 px-2 py-0.5 rounded-full">Careers</span>
          </div>
        </div>

      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 flex flex-col lg:flex-row items-center justify-between gap-12 py-8 sm:py-12">
        {/* Left Content */}
        <div className="hidden lg:block max-w-xl w-full flex-1">
          <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-4">
            Accelerate Your Hiring <span className="text-primary">with<br className="hidden sm:block" />Shivani Technologies</span>
          </h1>
          <p className="text-text-secondary text-lg mb-12">
            Find top engineering and technology talent in India's leading recruitment platform.
          </p>

          <div className="space-y-8 mb-12">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-surface border border-border flex items-center justify-center shrink-0">
                <svg className="w-6 h-6 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">1-Tap Applications</h3>
                <p className="text-text-secondary text-sm">Job seekers apply with structured resume details instantly.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-surface border border-border flex items-center justify-center shrink-0">
                <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Recruiter Dashboard</h3>
                <p className="text-text-secondary text-sm">Publish job openings and manage applicants dynamically.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-surface border border-border flex items-center justify-center shrink-0">
                <svg className="w-6 h-6 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Secure Profile Database</h3>
                <p className="text-text-secondary text-sm">All resumes and candidates are safely verified and stored.</p>
              </div>
            </div>
          </div>

          <div className="bg-surface border border-border rounded-2xl p-6 flex flex-col sm:flex-row justify-between gap-6 sm:gap-0">
            <div>
              <div className="text-3xl font-bold text-primary mb-1">10k+</div>
              <div className="text-text-secondary text-xs font-semibold tracking-wider">ACTIVE CANDIDATES</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-1">98%</div>
              <div className="text-text-secondary text-xs font-semibold tracking-wider">MATCH ACCURACY</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-1">24 Hr</div>
              <div className="text-text-secondary text-xs font-semibold tracking-wider">RESPONSE TIME</div>
            </div>
          </div>
        </div>

        {/* Right Content - Login Form */}
        <div className="flex-1 flex justify-center lg:justify-end w-full relative mt-8 lg:mt-0">
          {/* Vertical Separator Line - Using absolute positioning based on screenshot */}
          <div className="absolute left-[-3rem] top-[-3rem] bottom-[-3rem] w-px bg-border hidden lg:block"></div>
          <LoginForm />
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
