import React, { useState } from 'react';
import { X, UserPlus, Mail, Building, Briefcase, User as UserIcon, Loader2, MapPin } from 'lucide-react';
import { User } from '../types';

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddUser: (user: Partial<User>) => void;
}

const AddUserModal: React.FC<AddUserModalProps> = ({ isOpen, onClose, onAddUser }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    industry: 'Technology',
    location: 'Jakarta'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate network delay for a realistic feel
    setTimeout(() => {
      onAddUser({
        name: formData.name,
        email: formData.email,
        company: formData.company,
        industry: formData.industry,
        location: formData.location,
        plan: 'Free',
        status: 'Active',
        mrr: 0,
        joinDate: new Date().toISOString()
      });
      setIsSubmitting(false);
      setFormData({ name: '', email: '', company: '', industry: 'Technology', location: 'Jakarta' });
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-indigo-600" />
            New User Registration
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
              <UserIcon className="w-4 h-4 text-slate-400" /> Full Name
            </label>
            <input 
              required
              type="text" 
              placeholder="e.g. John Smith"
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
              <Mail className="w-4 h-4 text-slate-400" /> Email Address
            </label>
            <input 
              required
              type="email" 
              placeholder="e.g. john@company.com"
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
              <Building className="w-4 h-4 text-slate-400" /> Company Name
            </label>
            <input 
              required
              type="text" 
              placeholder="e.g. Acme Corp"
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              value={formData.company}
              onChange={e => setFormData({...formData, company: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-slate-400" /> Industry
              </label>
              <select 
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all bg-white"
                value={formData.industry}
                onChange={e => setFormData({...formData, industry: e.target.value})}
              >
                <option value="Technology">Technology</option>
                <option value="E-commerce">E-commerce</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Finance">Finance</option>
                <option value="Education">Education</option>
                <option value="Other">Other</option>
              </select>
            </div>
             <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-400" /> Location
              </label>
              <input 
                required
                type="text" 
                placeholder="e.g. Jakarta"
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                value={formData.location}
                onChange={e => setFormData({...formData, location: e.target.value})}
              />
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center justify-center gap-2"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Free Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserModal;