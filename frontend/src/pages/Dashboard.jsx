import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { 
  FileText, 
  Heart, 
  Search,
  Briefcase,
  Award,
  Building2,
  MapPin,
  DollarSign,
  CheckCircle2,
  Trash2
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import NotificationCenter from '../components/NotificationCenter';

const Dashboard = () => {
  const [profile, setProfile] = useState(null);
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [activeTab, setActiveTab] = useState('applied'); // 'applied' | 'saved'
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, [navigate]);

  const fetchDashboardData = async () => {
    try {
      const [profileRes, appsRes, jobsRes, savedRes] = await Promise.all([
        api.get('/candidate/profile'),
        api.get('/jobs/applications'),
        api.get('/jobs'),
        api.get('/jobs/saved')
      ]);
      setProfile(profileRes.data);
      setApplications(appsRes.data);
      setJobs(jobsRes.data);
      setSavedJobs(savedRes.data);
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        navigate('/');
      }
    }
  };

  const handleUnsave = async (jobId) => {
    try {
      await api.delete(`/jobs/${jobId}/save`);
      setSavedJobs(savedJobs.filter(j => j.id !== jobId));
    } catch (err) {
      console.error(err);
    }
  };

  const initials = profile?.fullName 
    ? profile.fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : 'C';
  const name = profile?.fullName ? profile.fullName.split(' ')[0] : 'Candidate';

  const featuredJob = jobs.length > 0 ? jobs[0] : null;
  const companyCounts = {};
  jobs.forEach(j => {
    if (j.company) {
      companyCounts[j.company] = (companyCounts[j.company] || 0) + 1;
    }
  });
  const topCompanies = Object.entries(companyCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 7)
    .map(([cname, count], i) => {
      const colors = ['bg-primary', 'bg-emerald-500', 'bg-blue-500', 'bg-amber-500', 'bg-purple-500', 'bg-indigo-600', 'bg-[hsl(222.2,47.4%,11.2%)]'];
      return {
        name: cname,
        roles: `${count} Role${count > 1 ? 's' : ''}`,
        logo: cname.charAt(0).toUpperCase(),
        color: colors[i % colors.length]
      };
    });

  let profileCompletion = 0;
  if (profile) {
    let filledFields = 0;
    const fieldsToCheck = [
      profile.fullName,
      profile.about,
      profile.resumeUrl,
      profile.linkedinUrl,
      profile.githubUrl,
      profile.portfolioUrl
    ];
    
    fieldsToCheck.forEach(field => {
      if (field && field.trim() !== '') filledFields++;
    });

    if (profile.skills && profile.skills.length > 0) filledFields++;
    if (profile.educations && profile.educations.length > 0) filledFields++;
    if (profile.experiences && profile.experiences.length > 0) filledFields++;

    const totalFields = 9;
    profileCompletion = Math.round((filledFields / totalFields) * 100);
  }

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />

      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-6 gap-4 sticky top-0 bg-background/90 backdrop-blur-md z-10 border-b border-border/50">
          <div className="flex items-center justify-between w-full sm:w-auto sm:order-2">
            {/* Mobile Logo */}
            <div className="flex lg:hidden items-center gap-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center p-1">
                <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
                  <path d="M12 2L2 22h20L12 2z" fill="#F59E0B" />
                  <path d="M12 8L6 20h12L12 8z" fill="#22C55E" />
                  <path d="M12 12l-3 6h6l-3-6z" fill="#5B4CF6" />
                </svg>
              </div>
              <span className="text-white font-bold text-lg">Shivani Tech</span>
            </div>

            <div className="flex items-center gap-4">
              <NotificationCenter />
              <div 
                onClick={() => navigate('/profile')}
                className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary to-emerald-400 flex items-center justify-center text-white font-bold text-xs cursor-pointer shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
              >
                {initials}
              </div>
            </div>
          </div>
          
          <div className="relative w-full sm:w-96 sm:order-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
            <input 
              type="text" 
              placeholder="Search jobs, companies..." 
              onKeyDown={(e) => {
                if (e.key === 'Enter') navigate('/jobs');
              }}
              className="w-full bg-surface border border-border rounded-full py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-primary transition-all"
            />
          </div>
        </header>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-6 max-w-6xl mx-auto w-full">
          
          {/* Top Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {/* Profile Card */}
            <div className="bg-surface/80 border border-success/40 rounded-2xl p-5 flex items-center gap-4 shadow-xl relative overflow-hidden group">
              <div className="w-14 h-14 rounded-full border-2 border-success p-1 shrink-0">
                <div className="w-full h-full rounded-full bg-primary flex items-center justify-center text-white font-bold text-base">
                  {initials}
                </div>
              </div>
              <div>
                <div className="text-white font-semibold text-base">{name}'s Profile</div>
                <div className="text-text-secondary text-xs mb-1">Profile Strength</div>
                <div className="text-success font-bold text-xl">{profileCompletion}%</div>
                <button className="text-primary text-xs hover:underline mt-1 font-medium" onClick={() => navigate('/profile')}>
                  Edit Profile →
                </button>
              </div>
            </div>

            {/* Applications Stat Card */}
            <div 
              onClick={() => setActiveTab('applied')} 
              className={`bg-surface/80 border rounded-2xl p-5 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${activeTab === 'applied' ? 'border-primary ring-1 ring-primary/50 shadow-lg shadow-primary/10' : 'border-border hover:border-primary/50'}`}
            >
              <div className="text-3xl font-bold text-white mb-1">{applications.length}</div>
              <div className="text-text-secondary text-xs font-medium mb-1">Total Applications</div>
              <span className="text-xs text-primary font-medium">View Submitted</span>
            </div>

            {/* Saved Jobs Stat Card */}
            <div 
              onClick={() => setActiveTab('saved')} 
              className={`bg-surface/80 border rounded-2xl p-5 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${activeTab === 'saved' ? 'border-danger ring-1 ring-danger/50 shadow-lg shadow-danger/10' : 'border-border hover:border-danger/50'}`}
            >
              <div className="text-3xl font-bold text-white mb-1">{savedJobs.length}</div>
              <div className="text-text-secondary text-xs font-medium mb-1">Saved Bookmarks</div>
              <span className="text-xs text-danger font-medium">View Bookmarks</span>
            </div>
          </div>

          {/* Applied / Saved Tabs */}
          <div className="flex items-center justify-center gap-4 sm:gap-8 border-b border-border pb-2">
            <button 
              className={`flex items-center gap-2 pb-3 transition-colors text-sm font-medium border-b-2 ${activeTab === 'applied' ? 'border-primary text-primary font-bold' : 'border-transparent text-text-secondary hover:text-white'}`} 
              onClick={() => setActiveTab('applied')}
            >
              <FileText className="w-4 h-4 text-primary" />
              <span>Applied Jobs ({applications.length})</span>
            </button>
            <button 
              className={`flex items-center gap-2 pb-3 transition-colors text-sm font-medium border-b-2 ${activeTab === 'saved' ? 'border-danger text-danger font-bold' : 'border-transparent text-text-secondary hover:text-white'}`} 
              onClick={() => setActiveTab('saved')}
            >
              <Heart className="w-4 h-4 text-danger fill-danger" />
              <span>Saved Jobs ({savedJobs.length})</span>
            </button>
          </div>

          {/* Tab Content Display */}
          {activeTab === 'applied' && (
            <div className="space-y-3">
              <h3 className="text-white font-bold text-lg mb-2">My Applications</h3>
              {applications.length === 0 ? (
                <div className="bg-surface/50 border border-border rounded-2xl p-8 text-center text-text-secondary">
                  <p className="mb-3">You haven't applied to any jobs yet.</p>
                  <button onClick={() => navigate('/jobs')} className="bg-primary hover:bg-secondary text-white px-5 py-2 rounded-xl text-sm font-medium transition-colors">
                    Explore Openings
                  </button>
                </div>
              ) : (
                applications.map((app) => (
                  <div key={app.id} className="bg-surface/80 border border-border rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-primary/40 transition-colors shadow-md">
                    <div className="flex items-start gap-4">
                      <div className="w-11 h-11 bg-primary/10 border border-primary/20 text-primary rounded-xl flex items-center justify-center font-bold shrink-0 mt-0.5">
                        <Building2 className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-white font-bold text-base">{app.jobTitle}</h4>
                        <p className="text-text-secondary text-xs">{app.company} • Applied on {new Date(app.appliedAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 self-end sm:self-center">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${
                        app.status === 'ACCEPTED' ? 'bg-success/20 text-success border-success/30' :
                        app.status === 'SHORTLISTED' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                        app.status === 'INTERVIEW_SCHEDULED' ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' :
                        app.status === 'REJECTED' ? 'bg-danger/20 text-danger border-danger/30' :
                        'bg-warning/20 text-warning border-warning/30'
                      }`}>
                        {app.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'saved' && (
            <div className="space-y-3">
              <h3 className="text-white font-bold text-lg mb-2">Bookmarked Positions</h3>
              {savedJobs.length === 0 ? (
                <div className="bg-surface/50 border border-border rounded-2xl p-8 text-center text-text-secondary">
                  <p className="mb-3">No saved jobs found. Click the heart icon on any job to save it here.</p>
                  <button onClick={() => navigate('/jobs')} className="bg-primary hover:bg-secondary text-white px-5 py-2 rounded-xl text-sm font-medium transition-colors">
                    Browse Jobs
                  </button>
                </div>
              ) : (
                savedJobs.map((job) => (
                  <div key={job.id} className="bg-surface/80 border border-border rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-danger/40 transition-colors shadow-md">
                    <div className="flex items-start gap-4">
                      <div className="w-11 h-11 bg-danger/10 border border-danger/20 text-danger rounded-xl flex items-center justify-center font-bold shrink-0 mt-0.5">
                        <Heart className="w-6 h-6 fill-danger" />
                      </div>
                      <div>
                        <h4 className="text-white font-bold text-base">{job.title}</h4>
                        <p className="text-text-secondary text-xs flex items-center gap-2 mt-1">
                          <span>{job.company}</span> • <span><MapPin className="w-3 h-3 inline" /> {job.location}</span> • <span><DollarSign className="w-3 h-3 inline text-success" /> {job.salaryRange}</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 self-end sm:self-center">
                      <button 
                        onClick={() => handleUnsave(job.id)}
                        className="p-2 text-text-secondary hover:text-danger hover:bg-danger/10 rounded-xl transition-colors"
                        title="Remove bookmark"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => navigate('/jobs')}
                        className="bg-primary hover:bg-secondary text-white text-xs px-4 py-2 rounded-xl font-medium transition-colors"
                      >
                        View & Apply
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Featured Role */}
          {featuredJob && (
            <div className="bg-gradient-to-r from-surface via-surface/90 to-primary/10 border border-primary/30 rounded-2xl p-5 sm:p-6 relative overflow-hidden shadow-2xl">
              <div className="flex flex-col sm:flex-row items-start justify-between relative z-10 gap-4">
                <div>
                  <div className="flex items-center gap-2 text-warning text-xs font-bold mb-2 tracking-wider">
                    <Award className="w-4 h-4" /> FEATURED OPPORTUNITY
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-1">{featuredJob.title}</h3>
                  <p className="text-text-secondary text-sm mb-4">{featuredJob.company} • {featuredJob.type} • {featuredJob.experience} Experience</p>
                  <button className="bg-primary hover:bg-secondary text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-primary/20 hover:scale-105" onClick={() => navigate('/jobs')}>
                    View Details & Apply
                  </button>
                </div>
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 shrink-0">
                  <Briefcase className="w-8 h-8 text-primary" />
                </div>
              </div>
            </div>
          )}

          {/* Top Hiring Companies */}
          {topCompanies.length > 0 && (
            <div>
              <h3 className="text-white font-bold mb-4 text-lg">Top Hiring Companies</h3>
              <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
                {topCompanies.map((company, i) => (
                  <div key={i} className="min-w-[130px] bg-surface/80 border border-border hover:border-primary/50 transition-all rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer shadow-sm hover:-translate-y-1" onClick={() => navigate('/jobs')}>
                    <div className={`w-12 h-12 rounded-2xl ${company.color} flex items-center justify-center text-white font-bold text-xl mb-3 shadow-md`}>
                      {company.logo}
                    </div>
                    <div className="text-white text-sm font-semibold truncate w-full text-center">{company.name}</div>
                    <div className="text-success text-xs font-medium mt-1">{company.roles}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default Dashboard;
