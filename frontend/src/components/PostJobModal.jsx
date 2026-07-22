import React, { useState, useEffect } from 'react';
import api from '../api';
import { X, Briefcase, Plus, Check } from 'lucide-react';

const CATEGORIES_DATA = {
  "IT & Software": [
    "Software Development",
    "Web Development",
    "Mobile App Development",
    "Frontend Development",
    "Backend Development",
    "Full Stack Development",
    "Database Development",
    "API Development"
  ],
  "Data & Analytics": [
    "Data Science",
    "Data Analytics",
    "Business Intelligence",
    "Data Engineering",
    "Machine Learning",
    "Artificial Intelligence"
  ],
  "Cloud & DevOps": [
    "Cloud Computing",
    "DevOps",
    "AWS",
    "Microsoft Azure",
    "Google Cloud",
    "Site Reliability Engineering"
  ],
  "Cybersecurity": [
    "Cybersecurity",
    "Ethical Hacking",
    "Network Security",
    "Information Security",
    "Security Engineering"
  ],
  "Design": [
    "UI/UX Design",
    "Graphic Design",
    "Product Design",
    "Web Design"
  ],
  "Testing & QA": [
    "Manual Testing",
    "Automation Testing",
    "QA Engineering",
    "Performance Testing"
  ],
  "Other": [
    "Technical Support",
    "IT Consulting",
    "System Administration",
    "Networking"
  ]
};

const DESIGNATIONS_DATA = {
  "Software Development": [
    "Software Developer",
    "Software Engineer",
    "Java Developer",
    "Java Full Stack Developer",
    "Full Stack Developer",
    "Frontend Developer",
    "Backend Developer",
    "React Developer",
    "Angular Developer",
    "Node.js Developer",
    "Spring Boot Developer",
    "Python Developer",
    ".NET Developer",
    "PHP Developer"
  ],
  "Data & AI": [
    "Data Analyst",
    "Data Scientist",
    "Data Engineer",
    "Machine Learning Engineer",
    "AI Engineer",
    "AI/ML Developer"
  ],
  "Cloud & DevOps": [
    "DevOps Engineer",
    "Cloud Engineer",
    "AWS Cloud Engineer",
    "Azure Cloud Engineer",
    "Cloud Architect",
    "Site Reliability Engineer"
  ],
  "Testing": [
    "QA Engineer",
    "QA Analyst",
    "Manual Tester",
    "Automation Tester",
    "Test Engineer"
  ],
  "Management": [
    "Project Manager",
    "Product Manager",
    "Engineering Manager",
    "Technical Lead",
    "Team Lead"
  ],
  "Other": [
    "System Administrator",
    "Network Engineer",
    "Cybersecurity Analyst",
    "Technical Support Engineer",
    "UI/UX Designer",
    "Business Analyst"
  ]
};

const LOCATIONS_DATA = {
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Trichy", "Salem", "Tirunelveli", "Erode", "Vellore"],
  "Karnataka": ["Bangalore", "Mysore", "Mangalore", "Hubli"],
  "Telangana": ["Hyderabad", "Warangal"],
  "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik"],
  "Delhi NCR": ["New Delhi", "Gurgaon", "Noida", "Ghaziabad"],
  "Other Indian Cities": ["Kochi", "Kolkata", "Ahmedabad", "Jaipur", "Chandigarh", "Bhubaneswar", "Visakhapatnam"],
  "Remote": ["Remote - India", "Remote - Worldwide"]
};

const JOB_TYPES = ["Full-time", "Part-time", "Contract", "Internship", "Freelance", "Temporary"];

const SALARY_RANGES = [
  "₹0 – ₹2 LPA",
  "₹2 – ₹4 LPA",
  "₹4 – ₹6 LPA",
  "₹6 – ₹8 LPA",
  "₹8 – ₹12 LPA",
  "₹12 – ₹20 LPA",
  "₹20+ LPA",
  "Negotiable"
];

const EXPERIENCE_LEVELS = [
  "Fresher / 0 Years",
  "0–2 Years",
  "2–4 Years",
  "4–6 Years",
  "6–8 Years",
  "8–10 Years",
  "10+ Years"
];

const SKILL_CATEGORIES = {
  "Programming": ["Java", "Python", "JavaScript", "TypeScript", "C", "C++", "C#", "PHP"],
  "Frontend": ["HTML", "CSS", "React.js", "Angular", "Vue.js", "Tailwind CSS", "Bootstrap"],
  "Backend": ["Spring Boot", "Node.js", "Express.js", "Django", ".NET", "REST API"],
  "Database": ["MySQL", "PostgreSQL", "MongoDB", "Oracle", "Redis"],
  "Cloud & DevOps": ["AWS", "Azure", "Google Cloud", "Docker", "Kubernetes", "Jenkins", "Git", "GitHub"],
  "AI & Data": ["Machine Learning", "Artificial Intelligence", "TensorFlow", "PyTorch", "Data Science", "SQL"]
};

const PostJobModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    category: '',
    designation: '',
    location: '',
    type: 'Full-time',
    salaryRange: '₹4 – ₹6 LPA',
    experience: '0–2 Years',
    skills: '',
    description: ''
  });

  const [activeSkillCategory, setActiveSkillCategory] = useState("Programming");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleToggleSkill = (skill) => {
    let currentSkills = formData.skills
      ? formData.skills.split(',').map(s => s.trim()).filter(Boolean)
      : [];

    if (currentSkills.includes(skill)) {
      currentSkills = currentSkills.filter(s => s !== skill);
    } else {
      currentSkills.push(skill);
    }

    setFormData({ ...formData, skills: currentSkills.join(', ') });
  };

  const isSkillSelected = (skill) => {
    if (!formData.skills) return false;
    const currentSkills = formData.skills.split(',').map(s => s.trim());
    return currentSkills.includes(skill);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/jobs', formData);
      onSuccess();
      onClose();
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        alert('Your session has expired or is unauthorized. Please log out and log in again.');
        localStorage.removeItem('token');
        window.location.href = '/';
      } else {
        alert(error.response?.data?.message || 'Failed to post job. Please try again.');
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-surface border border-border rounded-3xl w-full max-w-4xl my-8 flex flex-col shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-border flex justify-between items-center bg-background/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/20 text-primary rounded-xl flex items-center justify-center border border-primary/20">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Post a New Job</h2>
              <p className="text-text-secondary text-xs">Fill in structured submenus to reach qualified candidates</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="text-text-secondary hover:text-white p-2 rounded-full hover:bg-background transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
          <form id="postJobForm" onSubmit={handleSubmit} className="space-y-6">
            
            {/* Row 1: Title & Company */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-text-secondary text-xs uppercase font-semibold mb-2 tracking-wider">
                  Job Title <span className="text-danger">*</span>
                </label>
                <input 
                  required 
                  type="text" 
                  name="title" 
                  placeholder="e.g. Java Full Stack Developer" 
                  value={formData.title} 
                  onChange={handleChange} 
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 text-white focus:border-primary focus:outline-none transition-colors text-sm" 
                />
              </div>

              <div>
                <label className="block text-text-secondary text-xs uppercase font-semibold mb-2 tracking-wider">
                  Company Name <span className="text-danger">*</span>
                </label>
                <input 
                  required 
                  type="text" 
                  name="company" 
                  placeholder="e.g. Accenture, TCS, Infosys" 
                  value={formData.company} 
                  onChange={handleChange} 
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 text-white focus:border-primary focus:outline-none transition-colors text-sm" 
                />
              </div>
            </div>

            {/* Row 2: Category & Designation Submenus */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-text-secondary text-xs uppercase font-semibold mb-2 tracking-wider">
                  Category (Submenu) <span className="text-danger">*</span>
                </label>
                <select 
                  required 
                  name="category" 
                  value={formData.category} 
                  onChange={handleChange} 
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 text-white focus:border-primary focus:outline-none transition-colors text-sm cursor-pointer"
                >
                  <option value="">Select Category</option>
                  {Object.entries(CATEGORIES_DATA).map(([group, options]) => (
                    <optgroup key={group} label={group} className="bg-surface text-primary font-bold">
                      {options.map(opt => (
                        <option key={opt} value={opt} className="bg-background text-white font-normal pl-4">
                          {opt}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-text-secondary text-xs uppercase font-semibold mb-2 tracking-wider">
                  Designation (Submenu) <span className="text-danger">*</span>
                </label>
                <select 
                  required 
                  name="designation" 
                  value={formData.designation} 
                  onChange={handleChange} 
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 text-white focus:border-primary focus:outline-none transition-colors text-sm cursor-pointer"
                >
                  <option value="">Select Designation</option>
                  {Object.entries(DESIGNATIONS_DATA).map(([group, options]) => (
                    <optgroup key={group} label={group} className="bg-surface text-primary font-bold">
                      {options.map(opt => (
                        <option key={opt} value={opt} className="bg-background text-white font-normal pl-4">
                          {opt}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 3: Location & Job Type Submenus */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-text-secondary text-xs uppercase font-semibold mb-2 tracking-wider">
                  Location (State → City Submenu) <span className="text-danger">*</span>
                </label>
                <select 
                  required 
                  name="location" 
                  value={formData.location} 
                  onChange={handleChange} 
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 text-white focus:border-primary focus:outline-none transition-colors text-sm cursor-pointer"
                >
                  <option value="">Select Location</option>
                  {Object.entries(LOCATIONS_DATA).map(([state, cities]) => (
                    <optgroup key={state} label={state} className="bg-surface text-primary font-bold">
                      {cities.map(city => (
                        <option key={city} value={city} className="bg-background text-white font-normal pl-4">
                          {city}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-text-secondary text-xs uppercase font-semibold mb-2 tracking-wider">
                  Job Type <span className="text-danger">*</span>
                </label>
                <select 
                  name="type" 
                  value={formData.type} 
                  onChange={handleChange} 
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 text-white focus:border-primary focus:outline-none transition-colors text-sm cursor-pointer"
                >
                  {JOB_TYPES.map(t => (
                    <option key={t} value={t} className="bg-background text-white">{t}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 4: Salary Range & Experience Submenus */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-text-secondary text-xs uppercase font-semibold mb-2 tracking-wider">
                  Salary Range (Submenu)
                </label>
                <select 
                  name="salaryRange" 
                  value={formData.salaryRange} 
                  onChange={handleChange} 
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 text-white focus:border-primary focus:outline-none transition-colors text-sm cursor-pointer"
                >
                  {SALARY_RANGES.map(s => (
                    <option key={s} value={s} className="bg-background text-white">{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-text-secondary text-xs uppercase font-semibold mb-2 tracking-wider">
                  Experience Required (Submenu)
                </label>
                <select 
                  name="experience" 
                  value={formData.experience} 
                  onChange={handleChange} 
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 text-white focus:border-primary focus:outline-none transition-colors text-sm cursor-pointer"
                >
                  {EXPERIENCE_LEVELS.map(e => (
                    <option key={e} value={e} className="bg-background text-white">{e}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 5: Required Skills Submenus & Multi-Select Chips */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-text-secondary text-xs uppercase font-semibold tracking-wider">
                  Required Skills (Click to Select / Comma Separated)
                </label>
                <span className="text-xs text-primary font-medium">Multi-Select Submenu</span>
              </div>
              
              <input 
                type="text" 
                name="skills" 
                value={formData.skills} 
                onChange={handleChange} 
                placeholder="Selected skills will appear here or type manually..." 
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-white focus:border-primary focus:outline-none transition-colors text-sm mb-3" 
              />

              {/* Skill Submenu Category Tabs */}
              <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar border-b border-border/50 mb-3">
                {Object.keys(SKILL_CATEGORIES).map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveSkillCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                      activeSkillCategory === cat 
                        ? 'bg-primary text-white shadow-md' 
                        : 'bg-background text-text-secondary hover:text-white border border-border'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Skill Options for Selected Submenu */}
              <div className="flex flex-wrap gap-2 bg-background/50 p-3 rounded-2xl border border-border/50">
                {SKILL_CATEGORIES[activeSkillCategory].map(skill => {
                  const selected = isSkillSelected(skill);
                  return (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => handleToggleSkill(skill)}
                      className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                        selected 
                          ? 'bg-primary text-white font-semibold shadow-md shadow-primary/20 scale-105' 
                          : 'bg-surface border border-border text-text-secondary hover:text-white hover:border-primary/50'
                      }`}
                    >
                      {selected ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                      <span>{skill}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Row 6: Job Description Textarea */}
            <div>
              <label className="block text-text-secondary text-xs uppercase font-semibold mb-2 tracking-wider">
                Job Description <span className="text-danger">*</span>
              </label>
              <textarea 
                required 
                name="description" 
                value={formData.description} 
                onChange={handleChange} 
                rows="4" 
                placeholder="Provide details about key responsibilities, qualifications, requirements..." 
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-white focus:border-primary focus:outline-none transition-colors text-sm resize-none"
              ></textarea>
            </div>

          </form>
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-border bg-surface shrink-0 flex justify-end gap-3 rounded-b-3xl">
          <button 
            type="button" 
            onClick={onClose} 
            className="px-6 py-3 rounded-xl font-semibold text-text-secondary hover:text-white hover:bg-background border border-border transition-colors text-sm"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            form="postJobForm" 
            className="px-6 py-3 rounded-xl font-semibold text-white bg-primary hover:bg-secondary transition-all shadow-lg shadow-primary/20 hover:scale-105 text-sm"
          >
            Publish Job
          </button>
        </div>

      </div>
    </div>
  );
};

export default PostJobModal;
