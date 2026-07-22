import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, User, Building2, Briefcase } from 'lucide-react';
import api from '../api';

const LoginForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [authRole, setAuthRole] = useState('CANDIDATE'); // 'CANDIDATE' or 'EMPLOYER'
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    companyName: '',
    industry: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    try {
      if (isLogin) {
        // LOGIN
        const response = await api.post('/auth/login', {
          email: formData.email,
          password: formData.password
        });
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('role', response.data.role);

        const role = response.data.role;
        if (role === 'ADMIN') {
          navigate('/admin-dashboard');
        } else if (role === 'EMPLOYER') {
          navigate('/employer-dashboard');
        } else if (role === 'EMPLOYEE') {
          navigate('/employee-dashboard');
        } else {
          navigate('/dashboard');
        }
      } else {
        // REGISTER
        await api.post('/auth/register', {
          ...formData,
          role: authRole
        });

        if (authRole === 'EMPLOYER') {
          setSuccessMsg('Company registered! Awaiting admin approval. Please login later.');
        } else {
          setSuccessMsg('Registration successful! Please login.');
        }
        setIsLogin(true);
      }
    } catch (err) {
      setError(err.response?.data?.message || `${isLogin ? 'Login' : 'Registration'} failed. Please try again.`);
    }
  };

  return (
    <div className="bg-surface border border-border rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl relative max-h-[90vh]">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center p-1">
          <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
            <path d="M12 2L2 22h20L12 2z" fill="#F59E0B" />
            <path d="M12 8L6 20h12L12 8z" fill="#22C55E" />
            <path d="M12 12l-3 6h6l-3-6z" fill="#5B4CF6" />
          </svg>
        </div>
        <div>
          <span className="text-white font-semibold text-lg">Shivani Technologies</span>
        </div>
      </div>

      {/* Role Selection Tabs */}
      <div className="flex bg-background rounded-xl p-1 mb-6 border border-border">
        <button
          onClick={() => setAuthRole('CANDIDATE')}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${authRole === 'CANDIDATE' ? 'bg-primary text-white shadow-md' : 'text-text-secondary hover:text-white'}`}
        >
          Job Seeker
        </button>
        <button
          onClick={() => setAuthRole('EMPLOYER')}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${authRole === 'EMPLOYER' ? 'bg-primary text-white shadow-md' : 'text-text-secondary hover:text-white'}`}
        >
          Employer
        </button>
      </div>

      <h2 className="text-2xl font-bold text-white mb-2">
        {isLogin ? 'Welcome Back' : `Create ${authRole === 'CANDIDATE' ? 'an Account' : 'a Company'}`}
      </h2>
      <p className="text-text-secondary mb-6">
        {isLogin
          ? `Sign in to your ${authRole === 'CANDIDATE' ? 'Candidate' : 'Employer'} portal`
          : `Join us and ${authRole === 'CANDIDATE' ? 'find your dream job' : 'hire top talent'}`}
      </p>

      {/* Mode Selection Tabs (Login / Register) */}
      <div className="flex border-b border-border mb-6">
        <button
          onClick={() => { setIsLogin(true); setError(''); setSuccessMsg(''); }}
          className={`flex-1 pb-3 text-sm font-medium transition-colors border-b-2 ${isLogin ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-white'}`}
        >
          Login
        </button>
        <button
          onClick={() => { setIsLogin(false); setError(''); setSuccessMsg(''); }}
          className={`flex-1 pb-3 text-sm font-medium transition-colors border-b-2 ${!isLogin ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-white'}`}
        >
          Register
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-danger/20 border border-danger text-danger text-sm rounded-xl p-3">
            {error}
          </div>
        )}
        {successMsg && (
          <div className="bg-success/20 border border-success text-success text-sm rounded-xl p-3">
            {successMsg}
          </div>
        )}

        {!isLogin && (
          <div>
            <label className="block text-text-secondary text-sm mb-1">
              Full Name <span className="text-danger">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
              <input
                type="text"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full bg-surface border border-border rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>
        )}

        <div>
          <label className="block text-text-secondary text-sm mb-1">
            Email Address <span className="text-danger">*</span>
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="name@domain.com"
              className="w-full bg-surface border border-border rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-text-secondary text-sm mb-1">
            Password <span className="text-danger">*</span>
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="Min 6 characters"
              className="w-full bg-surface border border-border rounded-xl py-3 pl-10 pr-10 text-white focus:outline-none focus:border-primary transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {!isLogin && authRole === 'EMPLOYER' && (
          <>
            <div>
              <label className="block text-text-secondary text-sm mb-1">
                Company Name <span className="text-danger">*</span>
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                <input
                  type="text"
                  name="companyName"
                  required
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="Acme Corp"
                  className="w-full bg-surface border border-border rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>
            <div>
              <label className="block text-text-secondary text-sm mb-1">
                Industry <span className="text-danger">*</span>
              </label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                <input
                  type="text"
                  name="industry"
                  required
                  value={formData.industry}
                  onChange={handleChange}
                  placeholder="Technology, Finance, etc."
                  className="w-full bg-surface border border-border rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>
          </>
        )}

        <button
          type="submit"
          className="w-full bg-primary hover:bg-secondary text-white font-medium py-3 px-4 rounded-xl transition-colors mt-6"
        >
          {isLogin ? 'Sign In' : 'Sign Up'}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
