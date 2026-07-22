import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import Sidebar from '../components/Sidebar';
import { Search, MapPin, DollarSign, Briefcase, CheckCircle2, Filter, ChevronDown, Heart } from 'lucide-react';

const CustomSelect = ({ value, onChange, name, defaultOption, options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedLabel = value ? (options.find(o => o.value === value)?.label || value) : defaultOption;

  return (
    <div className="relative">
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-left text-white focus:border-primary focus:outline-none text-sm flex items-center justify-between transition-colors hover:border-primary/50"
      >
        <span className="truncate">{selectedLabel}</span>
        <ChevronDown className={`w-4 h-4 text-text-secondary transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          ></div>
          <div className="absolute z-50 top-full left-0 right-0 mt-2 bg-surface border border-border rounded-xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto custom-scrollbar backdrop-blur-xl">
            <div 
              onClick={() => { onChange({ target: { name, value: '' } }); setIsOpen(false); }}
              className={`px-3 py-2.5 text-sm cursor-pointer transition-colors ${!value ? 'bg-primary/20 text-primary font-medium' : 'text-text-secondary hover:bg-background hover:text-white'}`}
            >
              {defaultOption}
            </div>
            {options.map((opt) => (
              <div
                key={opt.value}
                onClick={() => { onChange({ target: { name, value: opt.value } }); setIsOpen(false); }}
                className={`px-3 py-2.5 text-sm cursor-pointer transition-colors ${value === opt.value ? 'bg-primary/20 text-primary font-medium' : 'text-text-secondary hover:bg-background hover:text-white'}`}
              >
                {opt.label}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const role = localStorage.getItem('role');
  const isCandidate = role === 'CANDIDATE' || (!role);
  
  // Filters state
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    location: '',
    experience: '',
    type: ''
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await api.get('/jobs');
      setJobs(response.data);
      setLoading(false);
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        navigate('/');
      }
      setLoading(false);
    }
  };

  const handleApply = async (jobId) => {
    try {
      await api.post(`/jobs/${jobId}/apply`);
      setJobs(jobs.map(job => 
        job.id === jobId ? { ...job, hasApplied: true } : job
      ));
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to apply for job');
    }
  };

  const handleToggleSave = async (job) => {
    try {
      if (job.isSaved) {
        await api.delete(`/jobs/${job.id}/save`);
        setJobs(jobs.map(j => j.id === job.id ? { ...j, isSaved: false } : j));
      } else {
        await api.post(`/jobs/${job.id}/save`);
        setJobs(jobs.map(j => j.id === job.id ? { ...j, isSaved: true } : j));
      }
    } catch (err) {
      console.error("Failed to toggle bookmark", err);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const filteredJobs = jobs.filter(job => {
    const matchSearch = job.title?.toLowerCase().includes(search.toLowerCase()) || 
                        job.company?.toLowerCase().includes(search.toLowerCase()) ||
                        (job.skills && job.skills.toLowerCase().includes(search.toLowerCase()));
    
    const matchCategory = !filters.category || job.category === filters.category;
    const matchLocation = !filters.location || job.location === filters.location;
    const matchExperience = !filters.experience || job.experience === filters.experience;
    const matchType = !filters.type || job.type === filters.type;
    const matchSaved = !showSavedOnly || job.isSaved;

    return matchSearch && matchCategory && matchLocation && matchExperience && matchType && matchSaved;
  });

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        <header className="flex flex-col gap-4 p-4 sm:p-6 sticky top-0 bg-background/90 backdrop-blur-md z-10 border-b border-border/50">
          {/* Mobile Top Row */}
          <div className="flex lg:hidden items-center justify-between w-full mb-2">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center p-1">
                <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
                  <path d="M12 2L2 22h20L12 2z" fill="#F59E0B" />
                  <path d="M12 8L6 20h12L12 8z" fill="#22C55E" />
                  <path d="M12 12l-3 6h6l-3-6z" fill="#5B4CF6" />
                </svg>
              </div>
              <span className="text-white font-bold text-lg">Shivani Tech</span>
            </div>
            {/* The profile icon in Dashboard handles profile, here we just show logo */}
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">Find your next role</h1>
              <p className="text-text-secondary text-sm">Discover and apply to top engineering jobs</p>
            </div>
            <div className="flex items-center gap-3">
              {isCandidate && (
                <button 
                  onClick={() => setShowSavedOnly(!showSavedOnly)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    showSavedOnly 
                      ? 'bg-danger text-white shadow-lg shadow-danger/20' 
                      : 'bg-surface border border-border text-text-secondary hover:text-white'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${showSavedOnly ? 'fill-white' : ''}`} />
                  <span>{showSavedOnly ? 'Showing Saved Jobs' : 'Show Saved Only'}</span>
                </button>
            )}
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-6 pt-2 max-w-7xl mx-auto w-full flex flex-col lg:flex-row gap-6">
          
          {/* Advanced Search Sidebar */}
          <div className="w-full lg:w-64 shrink-0 space-y-6">
            <div className="bg-surface border border-border rounded-2xl p-5 shadow-xl">
              <h3 className="text-white font-bold mb-4 flex items-center gap-2 border-b border-border pb-3 text-base">
                <Filter className="w-4 h-4 text-primary" /> Filter Results
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-text-secondary text-xs mb-1.5 font-semibold uppercase tracking-wider">Category</label>
                  <CustomSelect 
                    name="category"
                    value={filters.category}
                    onChange={handleFilterChange}
                    defaultOption="All Categories"
                    options={[
                      { value: 'IT', label: 'IT' },
                      { value: 'Software', label: 'Software' },
                      { value: 'Marketing', label: 'Marketing' },
                      { value: 'Finance', label: 'Finance' },
                      { value: 'Engineering', label: 'Engineering' },
                      { value: 'Design', label: 'Design' }
                    ]}
                  />
                </div>
                
                <div>
                  <label className="block text-text-secondary text-xs mb-1.5 font-semibold uppercase tracking-wider">Location</label>
                  <CustomSelect 
                    name="location"
                    value={filters.location}
                    onChange={handleFilterChange}
                    defaultOption="All Locations"
                    options={[
                      { value: 'Chennai', label: 'Chennai' },
                      { value: 'Bangalore', label: 'Bangalore' },
                      { value: 'Hyderabad', label: 'Hyderabad' },
                      { value: 'Coimbatore', label: 'Coimbatore' },
                      { value: 'Remote', label: 'Remote' }
                    ]}
                  />
                </div>

                <div>
                  <label className="block text-text-secondary text-xs mb-1.5 font-semibold uppercase tracking-wider">Job Type</label>
                  <CustomSelect 
                    name="type"
                    value={filters.type}
                    onChange={handleFilterChange}
                    defaultOption="All Work Types"
                    options={[
                      { value: 'Remote', label: 'Remote' },
                      { value: 'Hybrid', label: 'Hybrid' },
                      { value: 'On-site', label: 'On-site' },
                      { value: 'Full-time', label: 'Full-time' }
                    ]}
                  />
                </div>

                <div>
                  <label className="block text-text-secondary text-xs mb-1.5 font-semibold uppercase tracking-wider">Experience</label>
                  <CustomSelect 
                    name="experience"
                    value={filters.experience}
                    onChange={handleFilterChange}
                    defaultOption="Any Experience"
                    options={[
                      { value: '0-2 Years', label: '0-2 Years' },
                      { value: '3-5 Years', label: '3-5 Years' },
                      { value: '5-8 Years', label: '5-8 Years' },
                      { value: '8+ Years', label: '8+ Years' }
                    ]}
                  />
                </div>

                <button 
                  onClick={() => {
                    setFilters({category: '', location: '', experience: '', type: ''});
                    setShowSavedOnly(false);
                    setSearch('');
                  }}
                  className="w-full border border-border text-text-secondary hover:text-white hover:bg-border/50 py-2.5 rounded-xl text-xs font-medium transition-colors mt-2"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          </div>

          {/* Job List Area */}
          <div className="flex-1 space-y-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
              <input 
                type="text" 
                placeholder="Search by role, company, or skills..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-surface border border-border rounded-2xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:border-primary transition-all text-base shadow-lg"
              />
            </div>

            {loading ? (
              <div className="text-center text-text-secondary py-12">Loading jobs...</div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredJobs.map((job) => (
                  <div key={job.id} className="bg-surface/80 border border-border rounded-2xl p-6 transition-all hover:border-primary/50 flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center shadow-lg relative group">
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-4 mb-2">
                        <h2 className="text-xl font-bold text-white group-hover:text-primary transition-colors">{job.title}</h2>
                        {isCandidate && (
                          <button 
                            onClick={() => handleToggleSave(job)}
                            className={`p-2 rounded-full border transition-all ${
                              job.isSaved 
                                ? 'bg-danger/10 border-danger/40 text-danger' 
                                : 'bg-background border-border text-text-secondary hover:text-danger hover:border-danger/30'
                            }`}
                            title={job.isSaved ? "Remove bookmark" : "Save job"}
                          >
                            <Heart className={`w-5 h-5 ${job.isSaved ? 'fill-danger text-danger' : ''}`} />
                          </button>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-4 text-sm text-text-secondary mb-3">
                        <div className="flex items-center gap-1.5 font-semibold text-white">
                          <Briefcase className="w-4 h-4 text-primary" />
                          <span>{job.company}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {job.location} ({job.type || 'On-site'})
                        </div>
                        <div className="flex items-center gap-1 font-medium text-success">
                          <DollarSign className="w-4 h-4" />
                          {job.salaryRange}
                        </div>
                      </div>
                      
                      {/* Additional Details row */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {job.category && <span className="bg-background border border-border px-2.5 py-1 rounded-lg text-xs text-text-secondary">{job.category}</span>}
                        {job.experience && <span className="bg-background border border-border px-2.5 py-1 rounded-lg text-xs text-text-secondary">{job.experience}</span>}
                        {job.skills && job.skills.split(',').map((s, i) => (
                           <span key={i} className="bg-primary/10 text-primary border border-primary/20 px-2.5 py-1 rounded-lg text-xs font-medium">{s.trim()}</span>
                        ))}
                      </div>

                      <p className="text-text-secondary text-sm line-clamp-2">
                        {job.description}
                      </p>
                    </div>
                    
                    <div className="shrink-0 w-full sm:w-auto">
                      {isCandidate ? (
                        job.hasApplied ? (
                          <button disabled className="w-full sm:w-auto flex items-center justify-center gap-2 bg-success/20 text-success border border-success/30 px-6 py-3 rounded-xl font-semibold cursor-not-allowed">
                            <CheckCircle2 className="w-5 h-5" /> Applied
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleApply(job.id)}
                            className="w-full sm:w-auto bg-primary hover:bg-secondary text-white px-8 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-primary/20 hover:scale-105"
                          >
                            Apply Now
                          </button>
                        )
                      ) : (
                        <span className="text-text-secondary text-xs italic">Login as Job Seeker to apply</span>
                      )}
                    </div>
                  </div>
                ))}
                
                {filteredJobs.length === 0 && (
                  <div className="text-center text-text-secondary py-12 bg-surface rounded-2xl border border-border shadow-xl">
                    <p className="text-lg font-semibold text-white mb-1">No jobs match your criteria</p>
                    <p className="text-sm">Try adjusting your search query or clearing your filters.</p>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
};

export default Jobs;
