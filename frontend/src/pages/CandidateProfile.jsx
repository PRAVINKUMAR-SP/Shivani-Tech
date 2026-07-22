import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import Sidebar from '../components/Sidebar';
import { User, FileText, CheckCircle, Upload, LogOut, Briefcase, Folder } from 'lucide-react';

const CandidateProfile = () => {
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    about: '',
    resumeUrl: '',
    linkedinUrl: '',
    githubUrl: '',
    portfolioUrl: '',
    profilePictureUrl: '',
    dateOfBirth: '',
    mobile: '',
    experienceLevel: 'Fresher',
    designation: 'N/A',
    currentCompany: 'N/A',
    totalExp: '0 years',
    relevantExp: '0 years',
    currentCtc: '0 LPA',
    expectedCtc: '3 LPA',
    noticePeriod: 'Immediate',
    skills: [],
    projects: [],
    internships: [],
    educations: []
  });
  const [skillsInput, setSkillsInput] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const resumeInputRef = useRef(null);
  const photoInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/profile');
      if (res.data) {
        setProfile({
          fullName: res.data.fullName || '',
          email: res.data.email || '',
          about: res.data.about || '',
          resumeUrl: res.data.resumeUrl || '',
          linkedinUrl: res.data.linkedinUrl || '',
          githubUrl: res.data.githubUrl || '',
          portfolioUrl: res.data.portfolioUrl || '',
          profilePictureUrl: res.data.profilePictureUrl || '',
          dateOfBirth: res.data.dateOfBirth || '',
          mobile: res.data.mobile || '',
          experienceLevel: res.data.experienceLevel || 'Fresher',
          designation: res.data.designation || 'N/A',
          currentCompany: res.data.currentCompany || 'N/A',
          totalExp: res.data.totalExp || '0 years',
          relevantExp: res.data.relevantExp || '0 years',
          currentCtc: res.data.currentCtc || '0 LPA',
          expectedCtc: res.data.expectedCtc || '3 LPA',
          noticePeriod: res.data.noticePeriod || 'Immediate',
          skills: res.data.skills || [],
          projects: res.data.projects || [],
          internships: res.data.internships || [],
          educations: res.data.educations || []
        });
        setSkillsInput((res.data.skills || []).join(', '));
      }
    } catch (error) {
      console.error("Failed to fetch profile", error);
    }
  };

  const calculateCompletion = () => {
    const fields = [
      profile.about, profile.dateOfBirth, profile.mobile, 
      profile.experienceLevel, profile.designation, profile.currentCompany,
      profile.totalExp, profile.relevantExp, profile.resumeUrl,
      profile.currentCtc, profile.expectedCtc, profile.noticePeriod
    ];
    let filled = fields.filter(f => f && f.trim() !== '').length;
    if (profile.skills && profile.skills.length > 0) filled++;
    if (profile.projects && profile.projects.length > 0) filled++;
    if (profile.internships && profile.internships.length > 0) filled++;
    if (profile.educations && profile.educations.length > 0) filled++;
    if (profile.profilePictureUrl) filled++;
    
    // total = 12 fields + 5 lists/media = 17
    return Math.round((filled / 17) * 100);
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSkillsChange = (e) => {
    setSkillsInput(e.target.value);
    const parsedSkills = e.target.value.split(',').map(s => s.trim()).filter(s => s !== '');
    setProfile({ ...profile, skills: parsedSkills });
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    setUploadingResume(true);
    try {
      const resUpload = await api.post('/profile/upload-resume', formData);
      
      if (resUpload.data) {
        let parsedData = null;
        try {
          const resParse = await api.post('/profile/parse-resume', formData);
          parsedData = resParse.data;
        } catch (parseErr) {
          console.error("Parsing failed", parseErr);
        }
        
        setProfile(prev => {
          const newSkills = parsedData?.skills?.length > 0 
            ? Array.from(new Set([...prev.skills, ...parsedData.skills])) 
            : prev.skills;
            
          if (parsedData?.skills?.length > 0) setSkillsInput(newSkills.join(', '));

          return { 
            ...prev, 
            resumeUrl: resUpload.data,
            about: parsedData?.about || prev.about,
            mobile: parsedData?.mobile || prev.mobile,
            linkedinUrl: parsedData?.linkedinUrl || prev.linkedinUrl,
            githubUrl: parsedData?.githubUrl || prev.githubUrl,
            skills: newSkills,
            projects: parsedData?.projects?.length > 0 ? parsedData.projects : prev.projects,
            internships: parsedData?.internships?.length > 0 ? parsedData.internships : prev.internships
          };
        });
        alert('Resume uploaded and details autofilled successfully!');
      }
    } catch (err) {
      alert('Failed to upload resume');
    } finally {
      setUploadingResume(false);
      if (resumeInputRef.current) resumeInputRef.current.value = '';
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    setUploadingPhoto(true);
    try {
      const resUpload = await api.post('/profile/upload-photo', formData);
      if (resUpload.data) {
        setProfile(prev => ({ ...prev, profilePictureUrl: resUpload.data }));
      }
    } catch (err) {
      alert('Failed to upload photo');
    } finally {
      setUploadingPhoto(false);
      if (photoInputRef.current) photoInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    try {
      await api.put('/profile', profile);
      setIsEditing(false);
    } catch (error) {
      alert("Failed to update profile");
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length > 1) return parts[0][0] + parts[1][0];
    return parts[0][0];
  };

  const completionPercent = calculateCompletion();

  return (
    <div className="min-h-screen bg-background flex relative text-white">
      <Sidebar />
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        {/* Mobile Top Row */}
        <header className="flex lg:hidden items-center justify-between p-4 sm:p-6 sticky top-0 bg-background/90 backdrop-blur-md z-10 border-b border-border/50">
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
        </header>
        <div className="p-8 max-w-5xl mx-auto w-full space-y-4">
          
          {/* Header Card */}
          <div className="bg-[#111115] border border-[#222] rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <div className="relative group">
                <div className="w-20 h-20 rounded-full overflow-hidden bg-primary/20 border-2 border-primary/40 flex items-center justify-center text-xl font-bold">
                  {profile.profilePictureUrl ? (
                    <img src={profile.profilePictureUrl} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-primary">{getInitials(profile.fullName)}</span>
                  )}
                </div>
                {isEditing && (
                  <button onClick={() => photoInputRef.current?.click()} className="absolute bottom-0 right-0 bg-primary text-white p-1.5 rounded-full border border-background shadow-sm">
                    <Upload className="w-3 h-3" />
                  </button>
                )}
                <input type="file" accept=".jpg,.jpeg,.png" ref={photoInputRef} onChange={handlePhotoUpload} className="hidden" />
              </div>
              <div>
                <h1 className="text-xl font-bold">{profile.fullName || 'User'}</h1>
                <p className="text-sm text-text-secondary">{profile.email}</p>
                <p className="text-sm text-success mt-1">{completionPercent}% complete</p>
              </div>
            </div>
            <button onClick={() => isEditing ? handleSubmit() : setIsEditing(true)} className="border border-[#333] hover:border-primary hover:text-primary px-5 py-1.5 rounded-full text-sm font-medium transition-colors">
              {isEditing ? 'Save Profile' : 'Edit'}
            </button>
          </div>

          {!isEditing ? (
            // VIEW MODE
            <div className="space-y-4">
              <div className="bg-[#111115] border border-[#222] rounded-2xl p-6">
                <h2 className="text-sm text-text-secondary flex items-center gap-2 mb-2">
                  <span className="w-4 h-4 text-orange-400 bg-orange-400/20 rounded-full flex items-center justify-center text-[10px]">✏️</span> About
                </h2>
                <p className="text-sm">{profile.about || 'Not provided'}</p>
              </div>

              <div className="bg-[#111115] border border-[#222] rounded-2xl p-6">
                <h2 className="text-sm text-text-secondary flex items-center gap-2 mb-4">
                  <span className="w-4 h-4 text-gray-400 bg-gray-400/20 rounded-full flex items-center justify-center text-[10px]">📄</span> Personal Information
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div><p className="text-[10px] text-text-secondary mb-1 uppercase tracking-wider">Date of Birth</p><p className="text-sm font-medium">{profile.dateOfBirth || 'N/A'}</p></div>
                  <div><p className="text-[10px] text-text-secondary mb-1 uppercase tracking-wider">Mobile</p><p className="text-sm font-medium">{profile.mobile || 'N/A'}</p></div>
                  <div><p className="text-[10px] text-text-secondary mb-1 uppercase tracking-wider">Email</p><p className="text-sm font-medium">{profile.email || 'N/A'}</p></div>
                </div>
              </div>

              <div className="bg-[#111115] border border-[#222] rounded-2xl p-6">
                <h2 className="text-sm text-text-secondary flex items-center gap-2 mb-4">
                  <span className="w-4 h-4 text-pink-400 bg-pink-400/20 rounded-full flex items-center justify-center text-[10px]">💼</span> Professional Details
                </h2>
                <div className="grid grid-cols-2 gap-6">
                  <div><p className="text-[10px] text-text-secondary mb-1 uppercase tracking-wider">Experience</p><p className="text-sm font-medium">{profile.experienceLevel}</p></div>
                  <div><p className="text-[10px] text-text-secondary mb-1 uppercase tracking-wider">Designation</p><p className="text-sm font-medium">{profile.designation}</p></div>
                  <div><p className="text-[10px] text-text-secondary mb-1 uppercase tracking-wider">Current Company</p><p className="text-sm font-medium">{profile.currentCompany}</p></div>
                  <div><p className="text-[10px] text-text-secondary mb-1 uppercase tracking-wider">Total Exp</p><p className="text-sm font-medium">{profile.totalExp}</p></div>
                  <div><p className="text-[10px] text-text-secondary mb-1 uppercase tracking-wider">Relevant Exp</p><p className="text-sm font-medium">{profile.relevantExp}</p></div>
                </div>
              </div>

              <div className="bg-[#111115] border border-[#222] rounded-2xl p-6">
                <h2 className="text-sm text-text-secondary flex items-center gap-2 mb-4">
                  <span className="w-4 h-4 text-blue-400 bg-blue-400/20 rounded-full flex items-center justify-center text-[10px]">🎓</span> Education Details
                </h2>
                {profile.educations && profile.educations.length > 0 ? profile.educations.map((edu, idx) => (
                  <div key={idx} className="mb-4 last:mb-0">
                    <p className="text-[10px] text-text-secondary mb-1 uppercase tracking-wider">Degree</p><p className="text-sm font-medium mb-2">{edu.degree}</p>
                    <p className="text-[10px] text-text-secondary mb-1 uppercase tracking-wider">College/Univ.</p><p className="text-sm font-medium">{edu.institution}</p>
                  </div>
                )) : <p className="text-sm">Not provided</p>}
              </div>

              <div className="bg-[#111115] border border-[#222] rounded-2xl p-6">
                <h2 className="text-sm text-text-secondary flex items-center gap-2 mb-4">
                  <span className="w-4 h-4 text-gray-300 bg-gray-300/20 rounded-full flex items-center justify-center text-[10px]">📄</span> Resume
                </h2>
                <div className="flex items-center justify-between bg-[#1A1A20] border border-[#222] p-4 rounded-xl">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-gray-300" />
                    <div>
                      <p className="text-sm font-medium">Uploaded Resume</p>
                      <p className="text-[10px] text-text-secondary">Document</p>
                    </div>
                  </div>
                  {profile.resumeUrl ? (
                    <a href={profile.resumeUrl} target="_blank" rel="noreferrer" className="border border-[#444] text-primary hover:bg-primary/10 px-4 py-1.5 rounded-full text-[10px] transition-colors">View Resume</a>
                  ) : (
                    <span className="text-xs text-text-secondary">Not uploaded</span>
                  )}
                </div>
              </div>

              <div className="bg-[#111115] border border-[#222] rounded-2xl p-6">
                <h2 className="text-sm text-text-secondary flex items-center gap-2 mb-4">
                  <span className="w-4 h-4 text-pink-400 bg-pink-400/20 rounded-full flex items-center justify-center text-[10px]">🎯</span> Skills
                </h2>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.length > 0 ? profile.skills.map((skill, i) => (
                    <span key={i} className="text-[11px] bg-transparent text-white border border-[#444] px-4 py-1.5 rounded-full">{skill}</span>
                  )) : <span className="text-sm text-text-secondary">No skills added</span>}
                </div>
              </div>

              <div className="bg-[#111115] border border-[#222] rounded-2xl p-6">
                <h2 className="text-sm text-text-secondary flex items-center gap-2 mb-4">
                  <span className="w-4 h-4 text-orange-400 bg-orange-400/20 rounded-full flex items-center justify-center text-[10px]">💰</span> Compensation
                </h2>
                <div className="grid grid-cols-2 gap-6">
                  <div><p className="text-[10px] text-text-secondary mb-1 uppercase tracking-wider">Current CTC</p><p className="text-sm font-medium">{profile.currentCtc}</p></div>
                  <div><p className="text-[10px] text-text-secondary mb-1 uppercase tracking-wider">Expected CTC</p><p className="text-sm font-medium">{profile.expectedCtc}</p></div>
                  <div><p className="text-[10px] text-text-secondary mb-1 uppercase tracking-wider">Notice Period</p><p className="text-sm font-medium">{profile.noticePeriod}</p></div>
                </div>
              </div>
              
              <button onClick={handleSignOut} className="w-full bg-[#1A1A20] hover:bg-[#222] border border-[#333] text-red-400 font-medium py-3 rounded-xl flex items-center justify-center gap-2 transition-colors text-sm">
                Sign Out
              </button>
            </div>
          ) : (
            // EDIT MODE
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="bg-[#111115] border border-[#222] rounded-2xl p-6 space-y-4">
                <h2 className="text-lg font-semibold border-b border-[#222] pb-2 mb-4">About</h2>
                <textarea name="about" value={profile.about} onChange={handleChange} rows="3" className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:border-primary focus:outline-none resize-none" placeholder="Write about yourself..."></textarea>
              </div>

              <div className="bg-[#111115] border border-[#222] rounded-2xl p-6 space-y-4">
                <h2 className="text-lg font-semibold border-b border-[#222] pb-2 mb-4">Personal Information</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="text-xs text-text-secondary">Date of Birth</label><input type="date" name="dateOfBirth" value={profile.dateOfBirth} onChange={handleChange} className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:border-primary focus:outline-none"/></div>
                  <div><label className="text-xs text-text-secondary">Mobile</label><input type="text" name="mobile" value={profile.mobile} onChange={handleChange} className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:border-primary focus:outline-none"/></div>
                </div>
              </div>

              <div className="bg-[#111115] border border-[#222] rounded-2xl p-6 space-y-4">
                <h2 className="text-lg font-semibold border-b border-[#222] pb-2 mb-4">Professional Details</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="text-xs text-text-secondary">Experience Level</label><select name="experienceLevel" value={profile.experienceLevel} onChange={handleChange} className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:border-primary focus:outline-none"><option>Fresher</option><option>Experienced</option></select></div>
                  <div><label className="text-xs text-text-secondary">Designation</label><input type="text" name="designation" value={profile.designation} onChange={handleChange} className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:border-primary focus:outline-none"/></div>
                  <div><label className="text-xs text-text-secondary">Current Company</label><input type="text" name="currentCompany" value={profile.currentCompany} onChange={handleChange} className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:border-primary focus:outline-none"/></div>
                  <div><label className="text-xs text-text-secondary">Total Exp</label><input type="text" name="totalExp" value={profile.totalExp} onChange={handleChange} className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:border-primary focus:outline-none"/></div>
                  <div><label className="text-xs text-text-secondary">Relevant Exp</label><input type="text" name="relevantExp" value={profile.relevantExp} onChange={handleChange} className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:border-primary focus:outline-none"/></div>
                </div>
              </div>

              <div className="bg-[#111115] border border-[#222] rounded-2xl p-6 space-y-4">
                <h2 className="text-lg font-semibold border-b border-[#222] pb-2 mb-4">Resume & Skills</h2>
                <div>
                  <label className="text-xs text-text-secondary block mb-2">Upload Resume (Auto-fills profile)</label>
                  <input type="file" accept=".pdf,.doc,.docx" ref={resumeInputRef} onChange={handleResumeUpload} className="hidden" />
                  <button type="button" onClick={() => resumeInputRef.current?.click()} disabled={uploadingResume} className="bg-primary/20 text-primary hover:bg-primary hover:text-white px-6 py-3 rounded-xl transition-colors text-sm font-medium">
                    {uploadingResume ? 'Parsing...' : 'Upload Resume'}
                  </button>
                  {profile.resumeUrl && <p className="text-success text-xs mt-2">Resume uploaded.</p>}
                </div>
                <div>
                  <label className="text-xs text-text-secondary block mb-2">Skills (Comma separated)</label>
                  <input type="text" value={skillsInput} onChange={handleSkillsChange} placeholder="React, Node, Java" className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:border-primary focus:outline-none" />
                </div>
              </div>

              <div className="bg-[#111115] border border-[#222] rounded-2xl p-6 space-y-4">
                <h2 className="text-lg font-semibold border-b border-[#222] pb-2 mb-4">Compensation</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="text-xs text-text-secondary">Current CTC</label><input type="text" name="currentCtc" value={profile.currentCtc} onChange={handleChange} className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:border-primary focus:outline-none"/></div>
                  <div><label className="text-xs text-text-secondary">Expected CTC</label><input type="text" name="expectedCtc" value={profile.expectedCtc} onChange={handleChange} className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:border-primary focus:outline-none"/></div>
                  <div><label className="text-xs text-text-secondary">Notice Period</label><input type="text" name="noticePeriod" value={profile.noticePeriod} onChange={handleChange} className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:border-primary focus:outline-none"/></div>
                </div>
              </div>
            </form>
          )}

        </div>
      </main>
    </div>
  );
};

export default CandidateProfile;
