import React, { useState } from 'react';
import { 
  Search, Filter, Inbox, AlertCircle, CheckCircle2, 
  Clock, MessageSquare, Send, MoreHorizontal, User,
  FileText, Tag, ChevronRight, ArrowLeft
} from 'lucide-react';
import { SupportTicket } from '../types';
import { MOCK_DATA, MOCK_TICKETS } from '../constants';
import MetricCard from './MetricCard';

const SupportView: React.FC = () => {
  // Use local state initialized from MOCK data, reverting to safe mode
  const [tickets, setTickets] = useState<SupportTicket[]>(MOCK_TICKETS);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [replyText, setReplyText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const selectedTicket = tickets.find(t => t.id === selectedTicketId);

  // --- Logic ---

  const handleSendMessage = () => {
    if (!replyText.trim() || !selectedTicketId) return;

    // In this view-only rollback, we just simulate a UI update
    setTickets(prev => prev.map(t => {
      if (t.id === selectedTicketId) {
        return {
          ...t,
          status: 'In Progress', 
          // We aren't adding messages strictly to types in the simple version, so just updating status
        };
      }
      return t;
    }));

    setReplyText('');
    alert('Reply sent! (Simulation)');
  };

  const filteredTickets = tickets.filter(t => {
    const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
    const matchesPriority = priorityFilter === 'All' || t.priority === priorityFilter;
    const matchesSearch = t.issue.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          t.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesPriority && matchesSearch;
  });

  // --- UI Helpers ---

  const getPriorityColor = (p: string) => {
    switch (p) {
      case 'High': return 'text-rose-600 bg-rose-100 border-rose-200';
      case 'Medium': return 'text-amber-600 bg-amber-100 border-amber-200';
      case 'Low': return 'text-slate-600 bg-slate-100 border-slate-200';
      default: return 'text-slate-600 bg-slate-100';
    }
  };

  const getStatusColor = (s: string) => {
    switch (s) {
      case 'Open': return 'text-rose-600 bg-white border-rose-200';
      case 'In Progress': return 'text-blue-600 bg-white border-blue-200';
      case 'Resolved': return 'text-emerald-600 bg-white border-emerald-200';
      default: return 'text-slate-600';
    }
  };

  // --- Render ---

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] animate-in fade-in duration-500 gap-6">
      
      {/* 1. Stats Header */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-shrink-0">
        <MetricCard 
          title="Open Tickets" 
          value={tickets.filter(t => t.status === 'Open').length.toString()} 
          icon={<Inbox className="w-5 h-5"/>} 
          positive={false} 
          change="+2" 
        />
        <MetricCard 
          title="High Priority" 
          value={tickets.filter(t => t.priority === 'High' && t.status !== 'Resolved').length.toString()} 
          icon={<AlertCircle className="w-5 h-5"/>} 
          positive={false} 
          description="Needs immediate attention"
        />
        <MetricCard 
          title="Avg Resolution" 
          value="4h 12m" 
          icon={<Clock className="w-5 h-5"/>} 
          positive={true} 
          change="-15m" 
        />
        <MetricCard 
          title="Resolved Today" 
          value="12" 
          icon={<CheckCircle2 className="w-5 h-5"/>} 
          positive={true} 
        />
      </div>

      {/* 2. Main Content Split View */}
      <div className="flex flex-1 gap-6 overflow-hidden">
        
        {/* LEFT: Ticket List */}
        <div className={`bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden w-full ${selectedTicket ? 'hidden md:flex md:w-1/3' : 'w-full'}`}>
          
          {/* List Header & Filters */}
          <div className="p-4 border-b border-slate-100 space-y-3 bg-slate-50">
             <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input 
                  type="text" 
                  placeholder="Search tickets..."
                  className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
             </div>
             <div className="flex gap-2">
                <select 
                  className="flex-1 bg-white border border-slate-200 text-slate-700 text-xs rounded-lg px-2 py-1.5 focus:outline-none"
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                >
                  <option value="All">All Status</option>
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
                <select 
                  className="flex-1 bg-white border border-slate-200 text-slate-700 text-xs rounded-lg px-2 py-1.5 focus:outline-none"
                  value={priorityFilter}
                  onChange={e => setPriorityFilter(e.target.value)}
                >
                  <option value="All">All Priorities</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
             </div>
          </div>

          {/* List Items */}
          <div className="flex-1 overflow-y-auto">
             {filteredTickets.map(ticket => (
               <div 
                key={ticket.id}
                onClick={() => setSelectedTicketId(ticket.id)}
                className={`p-4 border-b border-slate-100 cursor-pointer transition-colors hover:bg-slate-50 ${selectedTicketId === ticket.id ? 'bg-indigo-50 border-l-4 border-l-indigo-600' : ''}`}
               >
                  <div className="flex justify-between items-start mb-1">
                     <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wide border ${getPriorityColor(ticket.priority)}`}>
                       {ticket.priority}
                     </span>
                     <span className="text-xs text-slate-400">{ticket.time}</span>
                  </div>
                  <h4 className={`text-sm font-semibold mb-1 line-clamp-1 ${selectedTicketId === ticket.id ? 'text-indigo-900' : 'text-slate-800'}`}>
                    {ticket.issue}
                  </h4>
                  <div className="flex justify-between items-end">
                     <div>
                       <div className="text-xs text-slate-500 flex items-center gap-1">
                         <User className="w-3 h-3" /> {ticket.user}
                       </div>
                       <div className="text-[10px] text-slate-400 mt-0.5">{ticket.id}</div>
                     </div>
                     <span className={`text-[10px] px-2 py-0.5 rounded-full border ${getStatusColor(ticket.status)}`}>
                        {ticket.status}
                     </span>
                  </div>
               </div>
             ))}
             {filteredTickets.length === 0 && (
               <div className="p-8 text-center text-slate-400 text-sm">No tickets found.</div>
             )}
          </div>
        </div>

        {/* RIGHT: Ticket Detail */}
        <div className={`flex-1 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden ${!selectedTicket ? 'hidden md:flex items-center justify-center bg-slate-50' : ''}`}>
           {selectedTicket ? (
             <>
               {/* Detail Header */}
               <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-start">
                  <div>
                     <button onClick={() => setSelectedTicketId(null)} className="md:hidden mb-2 text-slate-500 flex items-center gap-1 text-sm"><ArrowLeft className="w-4 h-4"/> Back</button>
                     <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs text-slate-400">ID: {selectedTicket.id}</span>
                     </div>
                     <h2 className="text-xl font-bold text-slate-900">{selectedTicket.issue}</h2>
                     <div className="text-sm text-slate-500 mt-1 flex items-center gap-2">
                        <span>{selectedTicket.user}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                        <span className="text-xs">{selectedTicket.time}</span>
                     </div>
                  </div>
                  <div className="flex gap-2">
                     <button className="p-2 hover:bg-slate-200 rounded-lg transition-colors text-slate-500">
                        <MoreHorizontal className="w-4 h-4" />
                     </button>
                  </div>
               </div>

               {/* Messages Placeholder (Simplified View) */}
               <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50 flex flex-col items-center justify-center text-slate-400">
                  <MessageSquare className="w-12 h-12 mb-2 opacity-20" />
                  <p>Message history not available in this preview.</p>
               </div>

               {/* Reply Box */}
               <div className="p-4 bg-white border-t border-slate-200">
                  <div className="relative">
                     <textarea
                       className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none pr-12"
                       rows={3}
                       placeholder="Type your reply here..."
                       value={replyText}
                       onChange={e => setReplyText(e.target.value)}
                     />
                     <button 
                       onClick={handleSendMessage}
                       disabled={!replyText.trim()}
                       className="absolute right-3 bottom-3 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                     >
                        <Send className="w-4 h-4" />
                     </button>
                  </div>
               </div>
             </>
           ) : (
             <div className="text-center text-slate-400">
               <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                  <Inbox className="w-8 h-8 text-slate-300" />
               </div>
               <p className="font-medium">Select a ticket to view details</p>
             </div>
           )}
        </div>

      </div>
    </div>
  );
};

export default SupportView;