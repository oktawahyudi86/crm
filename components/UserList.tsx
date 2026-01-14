import React, { useState, useMemo } from 'react';
import { Search, Filter, Download, MoreHorizontal, Eye, Calendar, UserPlus } from 'lucide-react';
import { User } from '../types';
import AddUserModal from './AddUserModal';

interface UserListProps {
  users: User[];
  onUserClick: (user: User) => void;
  onAddUser?: (user: Partial<User>) => void;
}

const UserList: React.FC<UserListProps> = ({ users, onUserClick, onAddUser }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [planFilter, setPlanFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      // 1. Text Search
      const matchesSearch = 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.location && user.location.toLowerCase().includes(searchTerm.toLowerCase()));
      
      // 2. Dropdown Filters
      const matchesPlan = planFilter === 'All' || user.plan === planFilter;
      const matchesStatus = statusFilter === 'All' || user.status === statusFilter;

      // 3. Date Range Filter
      let matchesDate = true;
      if (startDate || endDate) {
        const userDate = new Date(user.joinDate);
        userDate.setHours(0, 0, 0, 0); // Normalize time

        if (startDate) {
          const start = new Date(startDate);
          if (userDate < start) matchesDate = false;
        }
        if (endDate && matchesDate) { // Only check end if start didn't fail already
          const end = new Date(endDate);
          if (userDate > end) matchesDate = false;
        }
      }

      return matchesSearch && matchesPlan && matchesStatus && matchesDate;
    });
  }, [users, searchTerm, planFilter, statusFilter, startDate, endDate]);

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "ID,Name,Email,Company,Location,Plan,Status,Industry,JoinDate,MRR\n"
      + filteredUsers.map(u => `${u.id},${u.name},${u.email},${u.company},${u.location || ''},${u.plan},${u.status},${u.industry},${u.joinDate},${u.mrr}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "nexus_users.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAddUserSubmit = (newUser: Partial<User>) => {
    if (onAddUser) {
      onAddUser(newUser);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-emerald-100 text-emerald-700';
      case 'Trial': return 'bg-blue-100 text-blue-700';
      case 'Churned': return 'bg-slate-100 text-slate-500';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'Enterprise': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Premium': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'Basic': return 'bg-sky-100 text-sky-700 border-sky-200';
      default: return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters Header */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col xl:flex-row gap-4 justify-between items-start xl:items-center">
        
        {/* Search */}
        <div className="relative w-full xl:w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search users, company, city..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap gap-3 w-full xl:w-auto items-center">
          
          {/* Date Range Inputs */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg p-1">
            <div className="relative">
               <input 
                type="date" 
                className="bg-transparent text-sm text-slate-600 px-2 py-1 outline-none w-32 cursor-pointer"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                title="Start Date"
              />
            </div>
            <span className="text-slate-400 text-xs">to</span>
            <div className="relative">
               <input 
                type="date" 
                className="bg-transparent text-sm text-slate-600 px-2 py-1 outline-none w-32 cursor-pointer"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                title="End Date"
              />
            </div>
            {(startDate || endDate) && (
              <button 
                onClick={() => { setStartDate(''); setEndDate(''); }}
                className="text-xs text-slate-400 hover:text-rose-500 px-2 font-medium"
              >
                Clear
              </button>
            )}
          </div>

          {/* Plan Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 w-4 h-4" />
            <select
              className="pl-9 pr-8 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer"
              value={planFilter}
              onChange={(e) => setPlanFilter(e.target.value)}
            >
              <option value="All">All Plans</option>
              <option value="Free">Free</option>
              <option value="Basic">Basic</option>
              <option value="Premium">Premium</option>
              <option value="Enterprise">Enterprise</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 w-4 h-4" />
            <select
              className="pl-9 pr-8 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Trial">Trial</option>
              <option value="Churned">Churned</option>
            </select>
          </div>
          
          <button 
            onClick={() => setIsAddUserModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white border border-indigo-600 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm ml-auto xl:ml-0"
          >
            <UserPlus className="w-4 h-4" />
            Add User
          </button>

          <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-lg text-sm font-medium text-indigo-700 hover:bg-indigo-100 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs text-slate-500 uppercase font-semibold">Total Users</p>
          <p className="text-2xl font-bold text-slate-800">{filteredUsers.length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs text-slate-500 uppercase font-semibold">Active Paid</p>
          <p className="text-2xl font-bold text-emerald-600">
            {filteredUsers.filter(u => u.status === 'Active' && u.plan !== 'Free').length}
          </p>
        </div>
         <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs text-slate-500 uppercase font-semibold">On Trial</p>
          <p className="text-2xl font-bold text-blue-600">
            {filteredUsers.filter(u => u.status === 'Trial').length}
          </p>
        </div>
         <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs text-slate-500 uppercase font-semibold">Total MRR (Visible)</p>
          <p className="text-2xl font-bold text-indigo-600">
            ${filteredUsers.reduce((sum, u) => sum + (u.status === 'Active' ? u.mrr : 0), 0).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
                <th className="px-6 py-4 font-semibold">User</th>
                <th className="px-6 py-4 font-semibold">Location</th>
                <th className="px-6 py-4 font-semibold">Plan</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Industry</th>
                <th className="px-6 py-4 font-semibold">Joined</th>
                <th className="px-6 py-4 font-semibold text-right">MRR</th>
                <th className="px-6 py-4 font-semibold"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr 
                    key={user.id} 
                    onClick={() => onUserClick(user)}
                    className="hover:bg-slate-50 transition-colors cursor-pointer group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm group-hover:bg-indigo-200 transition-colors">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium text-slate-900">{user.name}</div>
                          <div className="text-sm text-slate-500">{user.email}</div>
                          <div className="text-xs text-slate-400">{user.company}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {user.location || '-'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getPlanColor(user.plan)}`}>
                        {user.plan}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {user.industry}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {new Date(user.joinDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-900 font-medium text-right">
                      ${user.mrr.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                       <button className="text-slate-400 hover:text-indigo-600 p-1 rounded-full hover:bg-slate-100 transition-colors">
                        <Eye className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-slate-500">
                    No users found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-between items-center text-sm text-slate-500">
          <span>Showing {filteredUsers.length} of {users.length} users</span>
          <div className="flex gap-2">
            <button disabled className="px-3 py-1 border border-slate-200 rounded hover:bg-white disabled:opacity-50">Previous</button>
            <button disabled className="px-3 py-1 border border-slate-200 rounded hover:bg-white disabled:opacity-50">Next</button>
          </div>
        </div>
      </div>

      <AddUserModal 
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
        onAddUser={handleAddUserSubmit}
      />
    </div>
  );
};

export default UserList;