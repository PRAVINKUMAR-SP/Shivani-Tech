import React from 'react';
import Sidebar from '../components/Sidebar';

const EmployeeDashboard = () => {
  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        <header className="p-6 sticky top-0 bg-background/90 backdrop-blur-md z-10 border-b border-border">
          <h1 className="text-2xl font-bold text-white mb-1">Employee Dashboard</h1>
          <p className="text-text-secondary text-sm">Internal platform management</p>
        </header>

        <div className="p-6 max-w-6xl mx-auto w-full space-y-6 flex flex-col items-center justify-center min-h-[50vh]">
          <div className="bg-surface border border-border rounded-2xl p-12 text-center text-text-secondary max-w-lg w-full">
            <h2 className="text-xl font-bold text-white mb-2">Welcome to the Employee Zone!</h2>
            <p>You have been assigned access to internal operations. Further features like candidate processing and reporting will be available in future modules.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EmployeeDashboard;
