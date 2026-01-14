import React from 'react';
import { 
  X, Mail, Building, Calendar, DollarSign, Activity, MessageSquare,
  CheckCircle2, LogIn, ArrowUpCircle, AlertCircle, Zap, FileText, Shield, MapPin
} from 'lucide-react';
import { User, ActivityLogItem } from '../types';
import { MOCK_ACTIVITIES } from '../constants';

interface UserDetailModalProps {
  user: User | null;
  onClose: () => void;
}

const UserDetailModal: React.FC<UserDetailModalProps> = ({ user, onClose }) => {
  if (!user) return null;

  // Filter activities for this user. If none found (because of mock data limitations), show generic ones for demo.
  let userActivities = MOCK_ACTIVITIES.filter(act => act.userName === user.name);
  if (userActivities.length === 0) {
     // Fallback to show some activities for demo purposes if exact name match fails in mock
     userActivities = MOCK_ACTIVITIES.slice(0, 4); 
  }

  const getIconForType = (type: string) => {
    switch (type) {
      case 'payment': return CheckCircle2;
      case 'login': return LogIn;
      case 'feature': return Zap;
      case 'upgrade': return ArrowUpCircle;
      case 'support': return AlertCircle;
      case 'security': return Shield;
      default: return Activity;
    }
  };

  const getColorForStatus = (status: string | undefined) => {
    switch (status) {
      case 'success': return 'text-emerald-600 bg-emerald-100';
      case 'warning': return 'text-amber-600 bg-amber-100';
      case 'error': return 'text-rose-600 bg-rose-100';
      default: return 'text-blue-600 bg-blue-100';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 bg-slate-50 border-b border-slate-200 flex justify-between items-start">
          <div className="flex gap-4">
            <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-2xl">
              {user.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">{user.name}</h2>
              <div className="flex items-center gap-2 text-slate-500 text-sm mt-1">
                <Building className="w-4 h-4" />
                {user.company}
                <span className="w-1 h-1 rounded-full bg-slate-300 mx-1"></span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  user.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 
                  user.status === 'Trial' ? 'bg-blue-100 text-blue-700' : 
                  'bg-slate-100 text-slate-500'
                }`}>
                  {user.status}
                </span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-8">
          
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50">
              <div className="text-xs text-slate-500 font-semibold uppercase flex items-center gap-2 mb-1">
                <DollarSign className="w-4 h-4" /> Monthly Revenue
              </div>
              <div className="text-2xl font-bold text-slate-900">${user.mrr.toLocaleString()}</div>
            </div>
            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50">
              <div className="text-xs text-slate-500 font-semibold uppercase flex items-center gap-2 mb-1">
                <Calendar className="w-4 h-4" /> Customer Since
              </div>
              <div className="text-lg font-semibold text-slate-900">{new Date(user.joinDate).toLocaleDateString()}</div>
            </div>
            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50">
              <div className="text-xs text-slate-500 font-semibold uppercase flex items-center gap-2 mb-1">
                <Activity className="w-4 h-4" /> Current Plan
              </div>
              <div className="text-lg font-semibold text-indigo-600">{user.plan}</div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">Contact Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-100 rounded-lg text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-slate-500 text-xs">Email Address</div>
                  <div className="text-slate-900 font-medium">{user.email}</div>
                </div>
              </div>
               <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-100 rounded-lg text-slate-500">
                  <Building className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-slate-500 text-xs">Industry</div>
                  <div className="text-slate-900 font-medium">{user.industry}</div>
                </div>
              </div>
               <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-100 rounded-lg text-slate-500">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-slate-500 text-xs">Location</div>
                  <div className="text-slate-900 font-medium">{user.location || 'N/A'}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Log / Timeline */}
           <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">User Activity Timeline</h3>
              <button className="text-xs text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1">
                <FileText className="w-3 h-3" /> View Full Logs
              </button>
            </div>
            
            <div className="relative pl-4 border-l border-slate-200 space-y-6">
               {userActivities.map((event) => {
                 const Icon = getIconForType(event.type);
                 return (
                   <div key={event.id} className="relative group">
                     <div className={`absolute -left-[25px] top-1 p-1 rounded-full border-2 border-white shadow-sm ${getColorForStatus(event.status)}`}>
                        <Icon className="w-3 h-3" />
                     </div>
                     <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                        <div>
                          <div className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                            {event.title}
                          </div>
                          <div className="text-sm text-slate-600 mt-0.5">
                            {event.description}
                          </div>
                          {event.amount && (
                            <div className="text-xs font-semibold text-emerald-600 mt-1">
                              {event.amount}
                            </div>
                          )}
                        </div>
                        <div className="text-xs text-slate-400 whitespace-nowrap bg-slate-50 px-2 py-0.5 rounded-full self-start">
                          {event.time}
                        </div>
                     </div>
                   </div>
                 );
               })}
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">
            Close
          </button>
          <button className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Send Message
          </button>
        </div>

      </div>
    </div>
  );
};

export default UserDetailModal;