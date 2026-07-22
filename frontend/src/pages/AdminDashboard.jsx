import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import Sidebar from '../components/Sidebar';
import MasterDataPanel from '../components/MasterDataPanel';
import { Building2, CheckCircle2, XCircle, Clock } from 'lucide-react';

const AdminDashboard = () => {
  const [pendingCompanies, setPendingCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('approvals');
  
  const [employeesList, setEmployeesList] = useState([]);
  const [newEmployee, setNewEmployee] = useState({ fullName: '', email: '', password: '' });
  
  const [allJobs, setAllJobs] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchPendingCompanies();
  }, []);

  const fetchPendingCompanies = async () => {
    try {
      const response = await api.get('/admin/companies/pending');
      setPendingCompanies(response.data);
      setLoading(false);
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        navigate('/');
      }
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await api.get('/admin/employees');
      setEmployeesList(response.data);
    } catch (error) {
      console.error("Failed to fetch employees", error);
    }
  };

  const fetchAllJobs = async () => {
    try {
      const response = await api.get('/jobs');
      setAllJobs(response.data);
    } catch (error) {
      console.error("Failed to fetch jobs", error);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    try {
      await api.delete(`/jobs/${jobId}`);
      fetchAllJobs();
    } catch (error) {
      alert("Failed to delete job");
    }
  };

  const handleApprove = async (companyId) => {
    try {
      await api.put(`/admin/companies/${companyId}/approve`);
      setPendingCompanies(pendingCompanies.filter(c => c.id !== companyId));
    } catch (error) {
      alert('Failed to approve company');
    }
  };

  const handleReject = async (companyId) => {
    try {
      await api.put(`/admin/companies/${companyId}/reject`);
      fetchPendingCompanies();
    } catch (error) {
      alert('Failed to reject company');
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        <header className="p-6 sticky top-0 bg-background/90 backdrop-blur-md z-10 border-b border-border">
          <h1 className="text-2xl font-bold text-white mb-1">Admin Dashboard</h1>
          <p className="text-text-secondary text-sm">Manage Master Data and Platform Approvals</p>
          
          <div className="flex gap-4 mt-6 border-b border-border overflow-x-auto">
            <button 
              onClick={() => setActiveTab('approvals')}
              className={`pb-3 px-2 font-medium transition-colors border-b-2 whitespace-nowrap ${activeTab === 'approvals' ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-white'}`}
            >
              Company Approvals
            </button>
            <button 
              onClick={() => setActiveTab('masterdata')}
              className={`pb-3 px-2 font-medium transition-colors border-b-2 whitespace-nowrap ${activeTab === 'masterdata' ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-white'}`}
            >
              Master Data Settings
            </button>
            <button 
              onClick={() => { setActiveTab('employees'); fetchEmployees(); }}
              className={`pb-3 px-2 font-medium transition-colors border-b-2 whitespace-nowrap ${activeTab === 'employees' ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-white'}`}
            >
              Employee Accounts
            </button>
            <button 
              onClick={() => { setActiveTab('jobs'); fetchAllJobs(); }}
              className={`pb-3 px-2 font-medium transition-colors border-b-2 whitespace-nowrap ${activeTab === 'jobs' ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-white'}`}
            >
              Job Management
            </button>
            <button 
              onClick={() => setActiveTab('communications')}
              className={`pb-3 px-2 font-medium transition-colors border-b-2 whitespace-nowrap ${activeTab === 'communications' ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-white'}`}
            >
              Communications
            </button>
          </div>
        </header>

        <div className="p-6 max-w-6xl mx-auto w-full space-y-6">
          {activeTab === 'approvals' ? (
            <>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Clock className="w-5 h-5 text-warning" /> Pending Company Approvals
                </h2>
                <div className="bg-surface px-3 py-1 rounded-full text-sm font-medium text-white border border-border">
                  {pendingCompanies.length} pending
                </div>
              </div>

              {loading ? (
                <div className="text-center text-text-secondary py-12">Loading...</div>
              ) : (
                <div className="space-y-4">
                  {pendingCompanies.length === 0 && (
                    <div className="bg-surface border border-border rounded-2xl p-12 text-center text-text-secondary">
                      No pending company registrations to review.
                    </div>
                  )}
                  {pendingCompanies.map(company => (
                    <div key={company.id} className="bg-surface border border-border rounded-2xl p-6 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                      <div className="flex gap-4 items-start">
                        <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center text-primary mt-1 shrink-0">
                          <Building2 className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            {company.companyName}
                          </h3>
                          <div className="text-sm text-text-secondary mt-1 space-y-1">
                            <div><span className="font-medium">Industry:</span> {company.industry}</div>
                            <div><span className="font-medium">Location:</span> {company.location}</div>
                            <div><span className="font-medium">Website:</span> <a href={company.websiteUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline">{company.websiteUrl}</a></div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-3 w-full md:w-auto">
                        <button 
                          onClick={() => handleReject(company.id)}
                          className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 border border-danger text-danger hover:bg-danger hover:text-white rounded-xl transition-colors font-medium"
                        >
                          <XCircle className="w-5 h-5" /> Reject
                        </button>
                        <button 
                          onClick={() => handleApprove(company.id)}
                          className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-success hover:bg-success/80 text-white rounded-xl transition-colors font-medium"
                        >
                          <CheckCircle2 className="w-5 h-5" /> Approve
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : activeTab === 'masterdata' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <MasterDataPanel title="Job Categories" endpoint="categories" />
              <MasterDataPanel title="Job Designations" endpoint="designations" />
              <MasterDataPanel title="Job Locations" endpoint="locations" />
              <MasterDataPanel title="Job Skills" endpoint="skills" />
            </div>
          ) : activeTab === 'employees' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-surface border border-border rounded-2xl p-6">
                <h2 className="text-xl font-bold text-white mb-4">Create New Employee</h2>
                <form 
                  onSubmit={async (e) => {
                    e.preventDefault();
                    try {
                      await api.post('/admin/employees', newEmployee);
                      setNewEmployee({ fullName: '', email: '', password: '' });
                      fetchEmployees();
                    } catch (err) {
                      alert("Failed to create employee");
                    }
                  }} 
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-text-secondary text-sm mb-1">Full Name</label>
                    <input required type="text" value={newEmployee.fullName} onChange={(e) => setNewEmployee({...newEmployee, fullName: e.target.value})} className="w-full bg-background border border-border rounded-xl px-4 py-2 text-white focus:border-primary focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-text-secondary text-sm mb-1">Email</label>
                    <input required type="email" value={newEmployee.email} onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})} className="w-full bg-background border border-border rounded-xl px-4 py-2 text-white focus:border-primary focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-text-secondary text-sm mb-1">Password</label>
                    <input required type="password" value={newEmployee.password} onChange={(e) => setNewEmployee({...newEmployee, password: e.target.value})} className="w-full bg-background border border-border rounded-xl px-4 py-2 text-white focus:border-primary focus:outline-none" />
                  </div>
                  <button type="submit" className="w-full bg-primary hover:bg-secondary text-white py-2 rounded-xl font-medium transition-colors">
                    Create Account
                  </button>
                </form>
              </div>

              <div className="bg-surface border border-border rounded-2xl p-6 overflow-y-auto max-h-[500px]">
                <h2 className="text-xl font-bold text-white mb-4">Active Employees</h2>
                <div className="space-y-3">
                  {employeesList.map(emp => (
                    <div key={emp.id} className="bg-background border border-border p-4 rounded-xl flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/20 text-primary rounded-full flex items-center justify-center font-bold">
                        {emp.fullName.charAt(0)}
                      </div>
                      <div>
                        <div className="text-white font-bold">{emp.fullName}</div>
                        <div className="text-text-secondary text-xs">{emp.email}</div>
                      </div>
                    </div>
                  ))}
                  {employeesList.length === 0 && (
                    <div className="text-text-secondary text-sm text-center py-4">No employees found.</div>
                  )}
                </div>
              </div>
            </div>
          ) : activeTab === 'jobs' ? (
            <div className="bg-surface border border-border rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-6">Manage Job Postings</h2>
              {allJobs.length === 0 ? (
                <div className="text-text-secondary text-center py-8">No jobs found on the platform.</div>
              ) : (
                <div className="space-y-4">
                  {allJobs.map(job => (
                    <div key={job.id} className="bg-background border border-border rounded-xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <h3 className="text-lg font-bold text-white">{job.title}</h3>
                        <p className="text-text-secondary text-sm">{job.company} • {job.location}</p>
                      </div>
                      <div className="flex gap-2 w-full md:w-auto">
                        <button className="flex-1 md:flex-none px-4 py-2 border border-primary text-primary hover:bg-primary hover:text-white rounded-lg transition-colors text-sm font-medium">
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteJob(job.id)}
                          className="flex-1 md:flex-none px-4 py-2 border border-danger text-danger hover:bg-danger hover:text-white rounded-lg transition-colors text-sm font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-surface border border-border rounded-2xl p-6 max-w-2xl mx-auto">
              <h2 className="text-xl font-bold text-white mb-2">Simulate Communication</h2>
              <p className="text-text-secondary text-sm mb-6">Send bulk Emails or SMS to target user groups (Visual stub).</p>
              
              <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert("Messages queued successfully!"); }}>
                <div>
                  <label className="block text-text-secondary text-sm mb-1">Target Audience</label>
                  <select className="w-full bg-background border border-border rounded-xl px-4 py-2 text-white focus:border-primary focus:outline-none">
                    <option>All Candidates</option>
                    <option>All Employers</option>
                    <option>All Employees</option>
                  </select>
                </div>
                <div>
                  <label className="block text-text-secondary text-sm mb-1">Message Type</label>
                  <select className="w-full bg-background border border-border rounded-xl px-4 py-2 text-white focus:border-primary focus:outline-none">
                    <option>Email</option>
                    <option>SMS</option>
                  </select>
                </div>
                <div>
                  <label className="block text-text-secondary text-sm mb-1">Message Content</label>
                  <textarea rows="4" className="w-full bg-background border border-border rounded-xl px-4 py-2 text-white focus:border-primary focus:outline-none resize-none" placeholder="Type your message here..."></textarea>
                </div>
                <button type="submit" className="w-full bg-primary hover:bg-secondary text-white py-2 rounded-xl font-medium transition-colors">
                  Send Communications
                </button>
              </form>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
