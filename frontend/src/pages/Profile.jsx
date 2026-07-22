import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../components/Sidebar';
import { Save, User, Briefcase, GraduationCap, Link as LinkIcon, Plus, Trash2, Upload, FileText, CheckCircle } from 'lucide-react';
import api from '../api';

const Profile = () => {
  const [profile, setProfile] = useState({
    about: '',
    linkedinUrl: '',
    githubUrl: '',
    portfolioUrl: '',
    skills: [],
    educations: [],
    experiences: []
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const fileInputRef = useRef(null);
  const actualResumeInputRef = useRef(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/candidate/profile');
      if (res.data) setProfile(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/candidate/profile', profile);
      alert('Profile saved successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      alert('Please upload a PDF file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setParsing(true);
    try {
      const res = await api.post('/profile/parse-resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data) {
        setProfile(prev => ({
          ...prev,
          about: res.data.about || prev.about,
          linkedinUrl: res.data.linkedinUrl || prev.linkedinUrl,
          githubUrl: res.data.githubUrl || prev.githubUrl,
          skills: res.data.skills?.length > 0 ? Array.from(new Set([...prev.skills, ...res.data.skills])) : prev.skills
        }));
        alert('Resume parsed successfully! Review the autofilled details.');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to parse resume');
    } finally {
      setParsing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleActualResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.pdf') && !file.name.toLowerCase().endsWith('.doc') && !file.name.toLowerCase().endsWith('.docx')) {
      alert('Please upload a PDF or Word document.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setUploadingResume(true);
    try {
      const res = await api.post('/profile/upload-resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data) {
        setProfile(prev => ({ ...prev, resumeUrl: res.data }));
        alert('Resume uploaded successfully!');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to upload resume');
    } finally {
      setUploadingResume(false);
      if (actualResumeInputRef.current) actualResumeInputRef.current.value = '';
    }
  };

  const addSkill = () => {
    if (newSkill && !profile.skills.includes(newSkill)) {
      setProfile({ ...profile, skills: [...profile.skills, newSkill] });
      setNewSkill('');
    }
  };

  const removeSkill = (skill) => {
    setProfile({ ...profile, skills: profile.skills.filter(s => s !== skill) });
  };

  if (loading) return <div className="min-h-screen bg-background text-white flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <main className="flex-1 flex flex-col h-screen overflow-y-auto p-4 sm:p-8">
        <div className="max-w-4xl mx-auto w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
              <User className="text-primary w-8 h-8" />
              Candidate Profile
            </h1>
            <div className="flex gap-4">
              <input 
                type="file" 
                accept=".pdf" 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
                className="hidden" 
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={parsing}
                className="bg-surface border border-primary text-primary hover:bg-primary/10 px-6 py-2 rounded-xl font-medium flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                <Upload className="w-4 h-4" />
                {parsing ? 'Parsing...' : 'Autofill from Resume'}
              </button>
              <button 
                onClick={handleSave}
                disabled={saving}
                className="bg-primary hover:bg-secondary text-white px-6 py-2 rounded-xl font-medium flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {/* Resume File Upload Section */}
            <div className="bg-surface border border-border rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" /> Resume File
              </h2>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <input 
                  type="file" 
                  accept=".pdf,.doc,.docx" 
                  ref={actualResumeInputRef} 
                  onChange={handleActualResumeUpload} 
                  className="hidden" 
                />
                <button 
                  onClick={() => actualResumeInputRef.current?.click()}
                  disabled={uploadingResume}
                  className="bg-background border border-primary text-primary hover:bg-primary/10 px-6 py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                >
                  <Upload className="w-4 h-4" />
                  {uploadingResume ? 'Uploading...' : 'Upload Resume Document'}
                </button>
                {profile.resumeUrl && (
                  <div className="flex items-center gap-2 text-success text-sm bg-success/10 px-4 py-2 rounded-xl">
                    <CheckCircle className="w-4 h-4" />
                    <span>Resume attached: </span>
                    <a href={profile.resumeUrl} target="_blank" rel="noreferrer" className="underline hover:text-white transition-colors">
                      View File
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* About Section */}
            <div className="bg-surface border border-border rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">About Me</h2>
              <textarea 
                value={profile.about || ''}
                onChange={(e) => setProfile({ ...profile, about: e.target.value })}
                placeholder="Write a short bio about yourself..."
                className="w-full bg-background border border-border rounded-xl p-4 text-white focus:outline-none focus:border-primary h-32 resize-none"
              ></textarea>
            </div>

            {/* Links Section */}
            <div className="bg-surface border border-border rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <LinkIcon className="w-5 h-5 text-primary" /> Social Links
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input 
                  type="text" placeholder="LinkedIn URL"
                  value={profile.linkedinUrl || ''} onChange={(e) => setProfile({ ...profile, linkedinUrl: e.target.value })}
                  className="bg-background border border-border rounded-xl p-3 text-white focus:outline-none focus:border-primary"
                />
                <input 
                  type="text" placeholder="GitHub URL"
                  value={profile.githubUrl || ''} onChange={(e) => setProfile({ ...profile, githubUrl: e.target.value })}
                  className="bg-background border border-border rounded-xl p-3 text-white focus:outline-none focus:border-primary"
                />
                <input 
                  type="text" placeholder="Portfolio URL"
                  value={profile.portfolioUrl || ''} onChange={(e) => setProfile({ ...profile, portfolioUrl: e.target.value })}
                  className="bg-background border border-border rounded-xl p-3 text-white focus:outline-none focus:border-primary sm:col-span-2"
                />
              </div>
            </div>

            {/* Skills Section */}
            <div className="bg-surface border border-border rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Skills</h2>
              <div className="flex gap-2 mb-4">
                <input 
                  type="text" placeholder="Add a skill (e.g. React, Java, AWS)"
                  value={newSkill} onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addSkill()}
                  className="flex-1 bg-background border border-border rounded-xl p-3 text-white focus:outline-none focus:border-primary"
                />
                <button onClick={addSkill} className="bg-border hover:bg-primary text-white px-4 rounded-xl transition-colors">
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.skills?.map((skill, index) => (
                  <div key={index} className="bg-primary/20 border border-primary/50 text-primary px-3 py-1.5 rounded-full flex items-center gap-2 text-sm font-medium">
                    {skill}
                    <button onClick={() => removeSkill(skill)} className="hover:text-white transition-colors">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Education Section */}
            <div className="bg-surface border border-border rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-primary" /> Education
                </h2>
                <button 
                  onClick={() => setProfile({ ...profile, educations: [...(profile.educations || []), { degree: '', institution: '', fieldOfStudy: '', startDate: '', endDate: '', grade: '' }] })}
                  className="bg-primary/20 text-primary hover:bg-primary hover:text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" /> Add Education
                </button>
              </div>
              <div className="space-y-4">
                {profile.educations?.map((edu, index) => (
                  <div key={index} className="bg-background border border-border rounded-xl p-4 relative">
                    <button 
                      onClick={() => setProfile({ ...profile, educations: profile.educations.filter((_, i) => i !== index) })}
                      className="absolute top-4 right-4 text-danger hover:bg-danger/20 p-1.5 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mr-10">
                      <input type="text" placeholder="Degree (e.g. B.Tech)" value={edu.degree || ''} onChange={(e) => { const newEdu = [...profile.educations]; newEdu[index].degree = e.target.value; setProfile({ ...profile, educations: newEdu }); }} className="bg-surface border border-border rounded-xl p-3 text-white focus:outline-none focus:border-primary" />
                      <input type="text" placeholder="Institution" value={edu.institution || ''} onChange={(e) => { const newEdu = [...profile.educations]; newEdu[index].institution = e.target.value; setProfile({ ...profile, educations: newEdu }); }} className="bg-surface border border-border rounded-xl p-3 text-white focus:outline-none focus:border-primary" />
                      <input type="text" placeholder="Field of Study" value={edu.fieldOfStudy || ''} onChange={(e) => { const newEdu = [...profile.educations]; newEdu[index].fieldOfStudy = e.target.value; setProfile({ ...profile, educations: newEdu }); }} className="bg-surface border border-border rounded-xl p-3 text-white focus:outline-none focus:border-primary" />
                      <input type="text" placeholder="Grade/CGPA" value={edu.grade || ''} onChange={(e) => { const newEdu = [...profile.educations]; newEdu[index].grade = e.target.value; setProfile({ ...profile, educations: newEdu }); }} className="bg-surface border border-border rounded-xl p-3 text-white focus:outline-none focus:border-primary" />
                      <input type="text" placeholder="Start Date (e.g. 2018)" value={edu.startDate || ''} onChange={(e) => { const newEdu = [...profile.educations]; newEdu[index].startDate = e.target.value; setProfile({ ...profile, educations: newEdu }); }} className="bg-surface border border-border rounded-xl p-3 text-white focus:outline-none focus:border-primary" />
                      <input type="text" placeholder="End Date (e.g. 2022)" value={edu.endDate || ''} onChange={(e) => { const newEdu = [...profile.educations]; newEdu[index].endDate = e.target.value; setProfile({ ...profile, educations: newEdu }); }} className="bg-surface border border-border rounded-xl p-3 text-white focus:outline-none focus:border-primary" />
                    </div>
                  </div>
                ))}
                {(!profile.educations || profile.educations.length === 0) && (
                  <div className="text-text-secondary text-sm text-center py-4 border border-dashed border-border rounded-xl">No education history added yet.</div>
                )}
              </div>
            </div>

            {/* Experience Section */}
            <div className="bg-surface border border-border rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-primary" /> Experience
                </h2>
                <button 
                  onClick={() => setProfile({ ...profile, experiences: [...(profile.experiences || []), { jobTitle: '', company: '', location: '', startDate: '', endDate: '', description: '' }] })}
                  className="bg-primary/20 text-primary hover:bg-primary hover:text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" /> Add Experience
                </button>
              </div>
              <div className="space-y-4">
                {profile.experiences?.map((exp, index) => (
                  <div key={index} className="bg-background border border-border rounded-xl p-4 relative">
                    <button 
                      onClick={() => setProfile({ ...profile, experiences: profile.experiences.filter((_, i) => i !== index) })}
                      className="absolute top-4 right-4 text-danger hover:bg-danger/20 p-1.5 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mr-10">
                      <input type="text" placeholder="Job Title" value={exp.jobTitle || ''} onChange={(e) => { const newExp = [...profile.experiences]; newExp[index].jobTitle = e.target.value; setProfile({ ...profile, experiences: newExp }); }} className="bg-surface border border-border rounded-xl p-3 text-white focus:outline-none focus:border-primary" />
                      <input type="text" placeholder="Company" value={exp.company || ''} onChange={(e) => { const newExp = [...profile.experiences]; newExp[index].company = e.target.value; setProfile({ ...profile, experiences: newExp }); }} className="bg-surface border border-border rounded-xl p-3 text-white focus:outline-none focus:border-primary" />
                      <input type="text" placeholder="Location" value={exp.location || ''} onChange={(e) => { const newExp = [...profile.experiences]; newExp[index].location = e.target.value; setProfile({ ...profile, experiences: newExp }); }} className="bg-surface border border-border rounded-xl p-3 text-white focus:outline-none focus:border-primary sm:col-span-2" />
                      <input type="text" placeholder="Start Date" value={exp.startDate || ''} onChange={(e) => { const newExp = [...profile.experiences]; newExp[index].startDate = e.target.value; setProfile({ ...profile, experiences: newExp }); }} className="bg-surface border border-border rounded-xl p-3 text-white focus:outline-none focus:border-primary" />
                      <input type="text" placeholder="End Date (or Present)" value={exp.endDate || ''} onChange={(e) => { const newExp = [...profile.experiences]; newExp[index].endDate = e.target.value; setProfile({ ...profile, experiences: newExp }); }} className="bg-surface border border-border rounded-xl p-3 text-white focus:outline-none focus:border-primary" />
                      <textarea placeholder="Description of responsibilities..." value={exp.description || ''} onChange={(e) => { const newExp = [...profile.experiences]; newExp[index].description = e.target.value; setProfile({ ...profile, experiences: newExp }); }} className="bg-surface border border-border rounded-xl p-3 text-white focus:outline-none focus:border-primary sm:col-span-2 h-24 resize-none"></textarea>
                    </div>
                  </div>
                ))}
                {(!profile.experiences || profile.experiences.length === 0) && (
                  <div className="text-text-secondary text-sm text-center py-4 border border-dashed border-border rounded-xl">No experience history added yet.</div>
                )}
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
