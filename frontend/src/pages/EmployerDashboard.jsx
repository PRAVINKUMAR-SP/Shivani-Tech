import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import Sidebar from '../components/Sidebar';
import PostJobModal from '../components/PostJobModal';
import { Briefcase, Users, PlusCircle, CheckCircle, ChevronDown, ChevronUp, Mail, Edit3, Trash2 } from 'lucide-react';

const EmployerDashboard = () => {
  const [showPostModal, setShowPostModal] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [expandedJobId, setExpandedJobId] = useState(null);
  const [applicantsData, setApplicantsData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyJobs();
  }, []);

  const fetchMyJobs = async () => {
    try {
      const res = await api.get('/jobs/my-jobs');
      setJobs(res.data);
    } catch (error) {
      console.error("Failed to fetch jobs", error);
    }
  };

  const fetchApplicants = async (jobId) => {
    try {
      const res = await api.get(`/jobs/${jobId}/applications`);
      setApplicantsData(prev => ({ ...prev, [jobId]: res.data }));
    } catch (error) {
      console.error("Failed to fetch applicants", error);
    }
  };

  const toggleJobExpanded = (jobId) => {
    if (expandedJobId === jobId) {
      setExpandedJobId(null);
    } else {
      setExpandedJobId(jobId);
      fetchApplicants(jobId);
    }
  };

  const handleUpdateStatus = async (jobId, appId, newStatus) => {
    try {
      await api.put(`/jobs/applications/${appId}/status`, { status: newStatus });
      setApplicantsData(prev => ({
        ...prev,
        [jobId]: prev[jobId].map(app => app.id === appId ? { ...app, status: newStatus } : app)
      }));
    } catch (err) {
      alert("Failed to update candidate status");
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job posting?")) return;
    try {
      await api.delete(`/jobs/${jobId}`);
      fetchMyJobs();
    } catch (error) {
      alert("Failed to delete job.");
    }
  };

  const handleJobPosted = () => {
    setShowSuccessToast(true);
    fetchMyJobs();
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  return (
    <div className="min-h-screen bg-background flex relative">
      <Sidebar />
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        <header className="p-4 sm:p-6 sticky top-0 bg-background/90 backdrop-blur-md z-10 border-b border-border/50 flex flex-col gap-4">
          {/* Mobile Top Row */}
          <div className="flex lg:hidden items-center justify-between w-full">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/employer-dashboard')}>
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center p-1">
                <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
                  <path d="M12 2L2 22h20L12 2z" fill="#F59E0B" />
                  <path d="M12 8L6 20h12L12 8z" fill="#22C55E" />
                  <path d="M12 12l-3 6h6l-3-6z" fill="#5B4CF6" />
                </svg>
              </div>
              <span className="text-white font-bold text-lg">Shivani Tech</span>
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Employer Recruitment Console</h1>
            <p className="text-text-secondary text-sm">Manage your job openings, evaluate applicants, and update hiring pipeline</p>
          </div>
        </header>

        <div className="p-6 max-w-6xl mx-auto w-full space-y-6">
          {/* Quick Actions / Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-surface/80 border border-border rounded-2xl p-6 shadow-xl">
              <div className="w-12 h-12 bg-primary/20 text-primary rounded-2xl flex items-center justify-center mb-4 border border-primary/20">
                <Briefcase className="w-6 h-6" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">{jobs.length}</div>
              <div className="text-text-secondary text-sm font-medium">Active Job Openings</div>
            </div>
            
            <div className="bg-surface/80 border border-border rounded-2xl p-6 shadow-xl">
              <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mb-4 border border-emerald-500/20">
                <Users className="w-6 h-6" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">
                {Object.values(applicantsData).reduce((acc, curr) => acc + curr.length, 0)}
              </div>
              <div className="text-text-secondary text-sm font-medium">Applicants Evaluated</div>
            </div>

            <div 
              className="bg-gradient-to-tr from-primary to-indigo-600 hover:brightness-110 border border-transparent rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all shadow-xl shadow-primary/20 hover:scale-[1.02]"
              onClick={() => setShowPostModal(true)}
            >
              <PlusCircle className="w-8 h-8 text-white mb-2" />
              <div className="text-xl font-bold text-white">Post a New Job</div>
              <div className="text-white/80 text-xs mt-1">Attract top candidates</div>
            </div>
          </div>

          {/* Jobs List */}
          <h2 className="text-xl font-bold text-white mt-8 mb-4">Posted Job Openings</h2>
          {jobs.length === 0 ? (
            <div className="bg-surface/50 border border-border rounded-2xl p-12 text-center text-text-secondary shadow-xl">
              <h3 className="text-lg font-bold text-white mb-2">No jobs posted yet</h3>
              <p>Click "Post a New Job" to list your first vacancy.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map(job => (
                <div key={job.id} className="bg-surface/80 border border-border hover:border-primary/40 rounded-2xl overflow-hidden transition-all shadow-lg">
                  <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div 
                      className="cursor-pointer flex-1"
                      onClick={() => toggleJobExpanded(job.id)}
                    >
                      <h3 className="text-lg font-bold text-white hover:text-primary transition-colors">{job.title}</h3>
                      <p className="text-text-secondary text-sm mt-1">{job.company} • {job.location} • {job.type || 'Full-time'}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => handleDeleteJob(job.id)}
                        className="text-red-400 text-sm font-medium hover:underline flex items-center gap-1"
                      >
                        <Trash2 className="w-4 h-4" /> Delete
                      </button>
                      <button 
                        className="flex items-center gap-2 cursor-pointer bg-background border border-border hover:border-primary/50 text-white px-4 py-2 rounded-xl transition-all"
                        onClick={() => toggleJobExpanded(job.id)}
                      >
                        <span className="text-sm font-medium">
                          {applicantsData[job.id]?.length || 0} Applicants
                        </span>
                        {expandedJobId === job.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {expandedJobId === job.id && (
                    <div className="border-t border-border/60 bg-background/50 p-6 space-y-4">
                      <h4 className="text-xs font-bold text-text-secondary uppercase tracking-wider">Candidate Applications Pipeline</h4>
                      
                      {!applicantsData[job.id] ? (
                        <div className="text-text-secondary text-sm">Loading applicants...</div>
                      ) : applicantsData[job.id].length === 0 ? (
                        <div className="text-text-secondary text-sm italic bg-surface/60 p-6 rounded-xl border border-border text-center">
                          No candidate applications submitted for this position yet.
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {applicantsData[job.id].map(app => (
                            <div key={app.id} className="bg-surface/90 border border-border/80 p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-primary/40 transition-colors">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-primary/20 text-primary rounded-full flex items-center justify-center font-bold text-base shrink-0">
                                  {app.candidateName?.charAt(0) || 'C'}
                                </div>
                                <div>
                                  <div className="font-bold text-white text-base">{app.candidateName}</div>
                                  <div className="text-text-secondary text-xs flex items-center gap-1 mt-0.5">
                                    <Mail className="w-3.5 h-3.5 text-primary" /> {app.candidateEmail}
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-4 self-end sm:self-center">
                                <div className="text-right">
                                  <label className="block text-[10px] text-text-secondary mb-1 uppercase font-semibold">Status Pipeline</label>
                                  <select 
                                    value={app.status}
                                    onChange={(e) => handleUpdateStatus(job.id, app.id, e.target.value)}
                                    className={`text-xs px-3 py-1.5 rounded-xl font-bold border focus:outline-none cursor-pointer transition-all ${
                                      app.status === 'ACCEPTED' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' :
                                      app.status === 'SHORTLISTED' ? 'bg-blue-500/20 text-blue-400 border-blue-500/40' :
                                      app.status === 'INTERVIEW_SCHEDULED' ? 'bg-purple-500/20 text-purple-400 border-purple-500/40' :
                                      app.status === 'REJECTED' ? 'bg-red-500/20 text-red-400 border-red-500/40' :
                                      'bg-amber-500/20 text-amber-400 border-amber-500/40'
                                    }`}
                                  >
                                    <option value="APPLIED" className="bg-surface text-white">APPLIED</option>
                                    <option value="SHORTLISTED" className="bg-surface text-white">SHORTLISTED</option>
                                    <option value="INTERVIEW_SCHEDULED" className="bg-surface text-white">INTERVIEW SCHEDULED</option>
                                    <option value="ACCEPTED" className="bg-surface text-white">ACCEPTED / HIRED</option>
                                    <option value="REJECTED" className="bg-surface text-white">REJECTED</option>
                                  </select>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {showPostModal && (
        <PostJobModal 
          onClose={() => setShowPostModal(false)} 
          onSuccess={handleJobPosted}
        />
      )}

      {showSuccessToast && (
        <div className="fixed bottom-6 right-6 bg-emerald-600 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-fade-in z-50">
          <CheckCircle className="w-5 h-5" />
          <span className="font-semibold text-sm">Job opening published successfully!</span>
        </div>
      )}
    </div>
  );
};

export default EmployerDashboard;
