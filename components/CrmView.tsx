import React, { useState, useEffect } from 'react';
import { 
  Search, Mail, MessageCircle, Send, User, CheckCircle2, 
  History, AlertCircle, Sparkles, Filter 
} from 'lucide-react';
import { User as UserType, CrmInteraction } from '../types';
import { MOCK_CRM_HISTORY } from '../constants';

interface CrmViewProps {
  users: UserType[];
}

const CrmView: React.FC<CrmViewProps> = ({ users }) => {
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [channel, setChannel] = useState<'email' | 'whatsapp'>('email');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [history, setHistory] = useState<CrmInteraction[]>(MOCK_CRM_HISTORY);
  const [showHistory, setShowHistory] = useState(true);

  // Templates
  const templates = {
    email: [
      { name: 'Welcome', subject: 'Welcome to NexusAI!', body: 'Hi {name},\n\nWelcome to NexusAI! We are thrilled to have you onboard. Let me know if you need help setting up your first agent.' },
      { name: 'Upsell Enterprise', subject: 'Unlock Enterprise Features', body: 'Hi {name},\n\nI noticed your team is growing. Our Enterprise plan offers dedicated support and custom model fine-tuning. Interested in a demo?' },
      { name: 'Churn Risk', subject: 'Checking in', body: 'Hi {name},\n\nI noticed you haven\'t logged in for a while. Is there anything we can do to help you get more value from NexusAI?' }
    ],
    whatsapp: [
      { name: 'Quick Check-in', body: 'Hi {name}, just checking if everything is running smoothly with your AI agents today? - NexusAI Team' },
      { name: 'Urgent Alert', body: 'Hi {name}, we detected unusual activity on your account. Please check your dashboard.' },
      { name: 'Promo', body: 'Hi {name}, flash sale! Upgrade to Premium today for 20% off.' }
    ]
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const applyTemplate = (tmpl: any) => {
    if (selectedUser) {
      setMessage(tmpl.body.replace('{name}', selectedUser.name.split(' ')[0]));
      if (channel === 'email' && tmpl.subject) {
        setSubject(tmpl.subject);
      }
    }
  };

  const handleSend = () => {
    if (!selectedUser || !message) return;
    
    setIsSending(true);
    
    // Simulate API call
    setTimeout(() => {
      const newInteraction: CrmInteraction = {
        id: Date.now().toString(),
        userId: selectedUser.id,
        type: channel,
        subject: channel === 'email' ? subject : undefined,
        content: message,
        timestamp: 'Just now',
        status: 'sent',
        adminName: 'You'
      };
      
      setHistory([newInteraction, ...history]);
      setIsSending(false);
      setMessage('');
      setSubject('');
      // Show success toast (simulated)
      alert(`Message sent to ${selectedUser.name} via ${channel === 'email' ? 'Email' : 'WhatsApp'}!`);
    }, 1000);
  };

  const userHistory = history.filter(h => h.userId === selectedUser?.id);

  return (
    <div className="flex h-[calc(100vh-140px)] gap-6 animate-in fade-in duration-500">
      
      {/* Left Panel: User Selection */}
      <div className="w-1/3 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50">
          <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <User className="w-4 h-4 text-indigo-600" /> Select User
          </h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search user or company..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {filteredUsers.map(user => (
            <div 
              key={user.id}
              onClick={() => setSelectedUser(user)}
              className={`p-4 border-b border-slate-100 cursor-pointer transition-colors hover:bg-slate-50 ${selectedUser?.id === user.id ? 'bg-indigo-50 border-l-4 border-l-indigo-600' : ''}`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className={`font-medium ${selectedUser?.id === user.id ? 'text-indigo-900' : 'text-slate-800'}`}>{user.name}</div>
                  <div className="text-xs text-slate-500">{user.company}</div>
                </div>
                <div className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                  user.plan === 'Enterprise' ? 'bg-purple-100 text-purple-700' : 
                  user.plan === 'Free' ? 'bg-slate-100 text-slate-500' : 'bg-blue-100 text-blue-700'
                }`}>
                  {user.plan}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel: CRM Action */}
      <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
        {selectedUser ? (
          <>
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <h2 className="text-lg font-bold text-slate-800">{selectedUser.name}</h2>
                <div className="flex items-center gap-4 text-sm text-slate-500 mt-1">
                  <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {selectedUser.email}</span>
                  <span className="flex items-center gap-1"><span className={`w-2 h-2 rounded-full ${selectedUser.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-300'}`}></span> {selectedUser.status}</span>
                </div>
              </div>
              
              <div className="flex gap-2">
                 <button 
                  onClick={() => setChannel('email')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${channel === 'email' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                >
                  <Mail className="w-4 h-4" /> Email
                </button>
                <button 
                  onClick={() => setChannel('whatsapp')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${channel === 'whatsapp' ? 'bg-emerald-600 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                >
                  <MessageCircle className="w-4 h-4" /> WhatsApp
                </button>
              </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
               {/* Composition Area */}
               <div className="flex-1 p-6 flex flex-col overflow-y-auto">
                 
                 {/* Templates */}
                 <div className="mb-6">
                   <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                     <Sparkles className="w-3 h-3" /> Quick Templates
                   </div>
                   <div className="flex flex-wrap gap-2">
                     {templates[channel].map((t, idx) => (
                       <button 
                        key={idx}
                        onClick={() => applyTemplate(t)}
                        className="text-xs px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-full text-slate-600 hover:border-indigo-300 hover:text-indigo-600 transition-colors"
                       >
                         {t.name}
                       </button>
                     ))}
                   </div>
                 </div>

                 {/* Form */}
                 <div className="space-y-4 flex-1">
                    {channel === 'email' && (
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
                        <input 
                          type="text" 
                          value={subject}
                          onChange={e => setSubject(e.target.value)}
                          className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                          placeholder="Email subject..."
                        />
                      </div>
                    )}
                    <div className="h-full flex flex-col">
                       <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
                       <textarea 
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        className="flex-1 w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none text-sm"
                        placeholder={`Type your ${channel === 'email' ? 'email' : 'WhatsApp message'} here...`}
                       />
                    </div>
                 </div>
                 
                 <div className="mt-4 flex justify-end">
                   <button 
                    onClick={handleSend}
                    disabled={isSending || !message || (channel === 'email' && !subject)}
                    className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 shadow-sm"
                   >
                     {isSending ? 'Sending...' : 'Send Message'}
                     {!isSending && <Send className="w-4 h-4" />}
                   </button>
                 </div>
               </div>

               {/* Interaction History Sidebar (Right side of right panel) */}
               <div className="w-80 border-l border-slate-100 bg-slate-50 flex flex-col">
                 <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-semibold text-slate-700 text-sm flex items-center gap-2">
                      <History className="w-4 h-4" /> Activity Log
                    </h3>
                 </div>
                 <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {userHistory.length > 0 ? (
                      userHistory.map(interaction => (
                        <div key={interaction.id} className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm text-sm">
                           <div className="flex justify-between items-start mb-1">
                              <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                interaction.type === 'whatsapp' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                              }`}>
                                {interaction.type}
                              </div>
                              <div className="text-xs text-slate-400">{interaction.timestamp}</div>
                           </div>
                           {interaction.subject && <div className="font-medium text-slate-800 mb-1 truncate">{interaction.subject}</div>}
                           <p className="text-slate-600 text-xs line-clamp-3">{interaction.content}</p>
                           <div className="mt-2 pt-2 border-t border-slate-100 flex justify-between items-center text-xs">
                             <span className="text-slate-400">by {interaction.adminName}</span>
                             {interaction.status === 'sent' && <span className="text-blue-500 flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> Sent</span>}
                             {interaction.status === 'read' && <span className="text-emerald-500 flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> Read</span>}
                             {interaction.status === 'failed' && <span className="text-rose-500 flex items-center gap-1"><AlertCircle className="w-3 h-3"/> Failed</span>}
                           </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-slate-400 text-sm">
                        No previous interactions found.
                      </div>
                    )}
                 </div>
               </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
              <User className="w-8 h-8 text-slate-300" />
            </div>
            <p className="font-medium">Select a user to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CrmView;