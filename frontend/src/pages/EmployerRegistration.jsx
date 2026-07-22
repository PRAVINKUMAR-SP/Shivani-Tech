import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { Building2, Mail, Lock, User, Globe, Briefcase, MapPin } from 'lucide-react';

const EmployerRegistration = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    companyName: '',
    websiteUrl: '',
    industry: '',
    companySize: '11-50',
    companyLocation: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/auth/register', {
        ...formData,
        role: 'EMPLOYER'
      });
      setSuccess(true);
      setTimeout(() => navigate('/'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-surface border border-success rounded-3xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-success/20 text-success rounded-full flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Registration Submitted!</h2>
          <p className="text-text-secondary">
            Your company profile has been submitted for administrator review. You will be notified once approved.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-12 py-12">
        <div className="max-w-xl w-full mx-auto">
          <div className="flex items-center gap-3 mb-8">
             <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center p-1 cursor-pointer" onClick={() => navigate('/')}>
               <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
                 <path d="M12 2L2 22h20L12 2z" fill="#F59E0B" />
                 <path d="M12 8L6 20h12L12 8z" fill="#22C55E" />
                 <path d="M12 12l-3 6h6l-3-6z" fill="#5B4CF6" />
               </svg>
             </div>
             <div>
               <span className="text-white font-semibold text-xl cursor-pointer" onClick={() => navigate('/')}>Shivani Technologies</span>
               <span className="text-primary text-xs ml-2 bg-primary/10 px-2 py-0.5 rounded-full">Employer Zone</span>
             </div>
          </div>
          
          <h1 className="text-3xl font-bold text-white mb-2">Register your Company</h1>
          <p className="text-text-secondary mb-8">Join thousands of companies hiring top talent.</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <div className="bg-danger/20 text-danger p-3 rounded-xl text-sm border border-danger">{error}</div>}
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Personal Details */}
              <div className="space-y-4">
                <h3 className="text-white font-medium border-b border-border pb-2">Admin Details</h3>
                <div>
                  <label className="block text-text-secondary text-sm mb-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                    <input type="text" name="fullName" required onChange={handleChange} className="w-full bg-surface border border-border rounded-xl py-3 pl-10 pr-4 text-white focus:border-primary" />
                  </div>
                </div>
                <div>
                  <label className="block text-text-secondary text-sm mb-1">Work Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                    <input type="email" name="email" required onChange={handleChange} className="w-full bg-surface border border-border rounded-xl py-3 pl-10 pr-4 text-white focus:border-primary" />
                  </div>
                </div>
                <div>
                  <label className="block text-text-secondary text-sm mb-1">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                    <input type="password" name="password" required onChange={handleChange} className="w-full bg-surface border border-border rounded-xl py-3 pl-10 pr-4 text-white focus:border-primary" />
                  </div>
                </div>
              </div>

              {/* Company Details */}
              <div className="space-y-4">
                <h3 className="text-white font-medium border-b border-border pb-2">Company Details</h3>
                <div>
                  <label className="block text-text-secondary text-sm mb-1">Company Name</label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                    <input type="text" name="companyName" required onChange={handleChange} className="w-full bg-surface border border-border rounded-xl py-3 pl-10 pr-4 text-white focus:border-primary" />
                  </div>
                </div>
                <div>
                  <label className="block text-text-secondary text-sm mb-1">Website URL</label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                    <input type="url" name="websiteUrl" onChange={handleChange} className="w-full bg-surface border border-border rounded-xl py-3 pl-10 pr-4 text-white focus:border-primary" />
                  </div>
                </div>
                <div>
                  <label className="block text-text-secondary text-sm mb-1">Industry</label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                    <input type="text" name="industry" required onChange={handleChange} className="w-full bg-surface border border-border rounded-xl py-3 pl-10 pr-4 text-white focus:border-primary" />
                  </div>
                </div>
              </div>
            </div>

            <button type="submit" className="w-full bg-primary hover:bg-secondary text-white font-medium py-4 rounded-xl transition-colors mt-4">
              Submit for Verification
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EmployerRegistration;
