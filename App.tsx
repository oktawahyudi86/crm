import React, { useState, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Settings, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Activity,
  Bot,
  PieChart as PieChartIcon,
  ArrowUpRight,
  ShieldAlert,
  UsersRound,
  Server,
  Zap,
  AlertCircle,
  Clock,
  CreditCard,
  Lock,
  UserPlus,
  CalendarDays,
  Target,
  Menu,
  MousePointerClick,
  Timer,
  Layers,
  Smartphone,
  Brain, // AI Icon
  Cpu,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  MessageSquare,
  ListTree,
  CheckCircle2,
  XCircle,
  Send,
  Radio,
  Tablet,
  Monitor,
  ScrollText, // For Activity Log
  Filter,
  Shield,
  ArrowUpCircle,
  LogIn,
  MessageCircle, // For CRM
  MapPin,
  Search // Added Search
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, LineChart, Line, PieChart, Pie, Cell, ComposedChart
} from 'recharts';
import MetricCard from './components/MetricCard';
import UserList from './components/UserList';
import UserDetailModal from './components/UserDetailModal';
import CrmView from './components/CrmView'; // Import CRM
import { MOCK_DATA, MOCK_ACTIVITIES } from './constants';
import { ViewType, User } from './types';

function App() {
  const [currentView, setCurrentView] = useState<ViewType>(ViewType.EXECUTIVE);
  const [users, setUsers] = useState<User[]>(MOCK_DATA.users);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  // Date Filter State
  const [dateRange, setDateRange] = useState('30d');

  // Colors for Demographics Pie Chart
  const DEMO_COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ec4899', '#6366f1'];
  const PLAN_COLORS = {
    'Enterprise': '#a855f7', // Purple
    'Premium': '#4f46e5',    // Indigo
    'Basic': '#0ea5e9',      // Sky
    'Free': '#cbd5e1'        // Slate
  };
  const SENTIMENT_COLORS = ['#10b981', '#94a3b8', '#f43f5e']; // Green, Slate, Red

  // --- Dynamic Metrics based on `users` state ---
  const activeUsersCount = users.length;
  const freeUsersCount = users.filter(u => u.plan === 'Free').length;
  const paidUsersCount = users.filter(u => u.plan !== 'Free').length;
  
  // Recalculate Subscription Metrics based on current users
  const subscriptionMetrics = useMemo(() => {
    const plans = ['Free', 'Basic', 'Premium', 'Enterprise'];
    return plans.map(plan => {
      const planUsers = users.filter(u => u.plan === plan);
      const count = planUsers.length;
      const mrr = planUsers.reduce((sum, u) => sum + u.mrr, 0);
      // Use growth rate from mock data as a baseline, or static 0 for new simplicity
      const mockMetric = MOCK_DATA.subscriptionMetrics.find(m => m.plan === plan);
      return {
        plan,
        userCount: count,
        mrrContribution: mrr,
        growthRate: mockMetric?.growthRate || 0
      };
    });
  }, [users]);

  // Handle Add User
  const handleAddUser = (userData: Partial<User>) => {
    const newUser: User = {
      id: (users.length + 1).toString(),
      name: userData.name || 'New User',
      email: userData.email || 'email@example.com',
      company: userData.company || 'Company',
      plan: 'Free',
      status: 'Active',
      industry: userData.industry || 'Technology',
      location: userData.location || 'Jakarta',
      joinDate: new Date().toISOString(),
      mrr: 0,
      ...userData
    } as User;
    
    setUsers(prev => [newUser, ...prev]);
  };

  // --- Helper for Activity Icons ---
  const getIconForType = (type: string) => {
    switch (type) {
      case 'payment': return CheckCircle2;
      case 'login': return LogIn;
      case 'feature': return Zap;
      case 'upgrade': return ArrowUpCircle;
      case 'support': return AlertCircle;
      case 'security': return Shield;
      case 'system': return Server;
      default: return Activity;
    }
  };

  const getColorForStatus = (status: string | undefined) => {
    switch (status) {
      case 'success': return 'text-emerald-600 bg-emerald-100 border-emerald-200';
      case 'warning': return 'text-amber-600 bg-amber-100 border-amber-200';
      case 'error': return 'text-rose-600 bg-rose-100 border-rose-200';
      default: return 'text-blue-600 bg-blue-100 border-blue-200';
    }
  };

  // --- Views Components ---

  const ExecutiveView = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* 1. HIGH LEVEL METRICS (Problem Solution Fit Focus) */}
      <section>
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Problem Solution Fit Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard 
            title="Total Users" 
            value={activeUsersCount.toLocaleString()} 
            change="15.2%" 
            positive={true} 
            icon={<Users className="w-6 h-6" />}
            description="Total registered accounts"
          />
          <MetricCard 
            title="Free Users" 
            value={freeUsersCount.toLocaleString()} 
            change="18.5%" 
            positive={true} 
            icon={<UsersRound className="w-6 h-6" />}
            description="Exploratory user base"
          />
          <MetricCard 
            title="Paid Users" 
            value={paidUsersCount.toLocaleString()}
            change="8.4%"
            positive={true} 
            icon={<CreditCard className="w-6 h-6" />}
            description="Validated value proposition"
          />
           <MetricCard 
            title="Activation Rate" 
            value="28.5%"
            change="2.1%"
            positive={true}
            icon={<Zap className="w-6 h-6" />}
            description="Signup to First Aha! Moment"
          />
        </div>
      </section>

      {/* 2. SUBSCRIPTION & REVENUE MIX (NEW SECTION) */}
      <section>
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Subscription & Revenue Mix</h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          
          {/* Pie Chart: User Distribution by Plan */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
            <h3 className="text-lg font-semibold text-slate-800 mb-2">User Distribution</h3>
            <p className="text-sm text-slate-400 mb-4">Active Users per Pricing Plan</p>
            <div className="flex-1 min-h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={subscriptionMetrics}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="userCount"
                    nameKey="plan"
                  >
                    {subscriptionMetrics.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PLAN_COLORS[entry.plan as keyof typeof PLAN_COLORS] || '#cbd5e1'} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px' }} />
                  <Legend 
                    layout="vertical" 
                    verticalAlign="middle" 
                    align="center" 
                    wrapperStyle={{ fontSize: '12px' }} 
                    formatter={(value, entry: any) => (
                      <span className="text-slate-600 font-medium">
                        {value} ({entry.payload.userCount.toLocaleString()})
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bar Chart: Revenue Contribution */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
             <div className="flex justify-between items-start mb-4">
                <div>
                   <h3 className="text-lg font-semibold text-slate-800 mb-1">Revenue Contribution</h3>
                   <p className="text-sm text-slate-400">MRR Share vs User Count</p>
                </div>
                <div className="bg-slate-100 p-2 rounded-lg">
                   <DollarSign className="w-5 h-5 text-emerald-600" />
                </div>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
               {subscriptionMetrics.map((item) => (
                 <div key={item.plan} className="bg-slate-50 p-4 rounded-xl border border-slate-100 relative overflow-hidden group hover:border-indigo-200 transition-all">
                    <div className={`absolute top-0 left-0 w-1 h-full ${
                       item.plan === 'Enterprise' ? 'bg-purple-500' : 
                       item.plan === 'Premium' ? 'bg-indigo-500' : 
                       item.plan === 'Basic' ? 'bg-sky-500' : 'bg-slate-300'
                    }`}></div>
                    <div className="flex justify-between items-center mb-2">
                       <span className="font-semibold text-slate-700">{item.plan}</span>
                       <span className={`text-xs px-1.5 py-0.5 rounded ${item.growthRate > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                         {item.growthRate > 0 ? '+' : ''}{item.growthRate}%
                       </span>
                    </div>
                    <div className="text-2xl font-bold text-slate-900 mb-1">
                       ${(item.mrrContribution / 1000).toFixed(1)}k
                    </div>
                    <div className="text-xs text-slate-400">
                       {item.userCount.toLocaleString()} users
                    </div>
                 </div>
               ))}
             </div>
          </div>
        </div>
      </section>

      {/* 3. PRODUCT USAGE & BEHAVIOR ANALYTICS */}
      <section>
        <div className="flex justify-between items-center mb-4">
           <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Product Usage & Behavior Analytics</h3>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Main Usage Chart: Feature Adoption */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Feature Adoption Trends</h3>
            <p className="text-sm text-slate-400 mb-4">Daily Active Users (DAU) by Feature</p>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={MOCK_DATA.featureUsageTrends}>
                  <defs>
                    <linearGradient id="colorChat" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorWorkflows" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px' }} />
                  <Legend />
                  <Area type="monotone" dataKey="chat" name="AI Chat" stroke="#4f46e5" fillOpacity={1} fill="url(#colorChat)" />
                  <Area type="monotone" dataKey="workflows" name="Workflows" stroke="#10b981" fillOpacity={1} fill="url(#colorWorkflows)" />
                  <Area type="monotone" dataKey="analytics" name="Analytics" stroke="#f59e0b" fillOpacity={0.1} fill="#f59e0b" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Behavior KPI Cards */}
          <div className="space-y-6">
             <MetricCard 
              title="Stickiness (DAU/MAU)" 
              value="18.5%" 
              change="2.4%" 
              positive={true} 
              icon={<Target className="w-6 h-6" />}
              description="Retention Indicator"
            />
             <MetricCard 
              title="Avg Session Duration" 
              value="14m 20s" 
              change="1m 05s" 
              positive={true} 
              icon={<Timer className="w-6 h-6" />}
              description="Time spent per login"
            />
            <MetricCard 
              title="Avg Pages/Session" 
              value="5.4"
              change="0.2" 
              positive={false} 
              icon={<Layers className="w-6 h-6" />}
              description="Navigation Depth"
            />
          </div>
        </div>

        {/* Page Engagement Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
           <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Page Engagement Analysis</h3>
            <p className="text-sm text-slate-400 mb-4">Total Views vs. Avg Time on Page (Seconds)</p>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart layout="vertical" data={MOCK_DATA.pageEngagement}>
                  <CartesianGrid stroke="#f5f5f5" />
                  <XAxis type="number" />
                  <YAxis dataKey="pageName" type="category" width={100} tick={{fontSize: 12}} />
                  <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{ backgroundColor: '#fff', borderRadius: '8px' }} />
                  <Legend />
                  <Bar dataKey="views" name="Total Views" barSize={20} fill="#4f46e5" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="avgTimeOnPage" name="Avg Time (sec)" barSize={20} fill="#f59e0b" radius={[0, 4, 4, 0]} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
          
           {/* Device/Platform Breakdown (Reusing Demographics slot but for Tech) */}
           <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
            <h3 className="text-lg font-semibold text-slate-800 mb-2">User Access Points</h3>
            <p className="text-sm text-slate-400 mb-4">Platform & Device Usage</p>
            <div className="flex-1 min-h-[200px] flex items-center justify-center">
               <div className="w-full h-full grid grid-cols-2 gap-4">
                  <div className="flex flex-col items-center justify-center bg-slate-50 rounded-lg p-4">
                     <Smartphone className="w-8 h-8 text-indigo-600 mb-2" />
                     <span className="text-2xl font-bold text-slate-800">42%</span>
                     <span className="text-xs text-slate-500">Mobile Web</span>
                  </div>
                  <div className="flex flex-col items-center justify-center bg-slate-50 rounded-lg p-4">
                     <LayoutDashboard className="w-8 h-8 text-emerald-600 mb-2" />
                     <span className="text-2xl font-bold text-slate-800">58%</span>
                     <span className="text-xs text-slate-500">Desktop</span>
                  </div>
                  <div className="col-span-2 bg-indigo-50 rounded-lg p-4 flex items-center justify-between">
                     <div>
                       <div className="text-indigo-900 font-semibold text-sm">Most Used Browser</div>
                       <div className="text-indigo-600 text-xs">Google Chrome (78%)</div>
                     </div>
                     <div className="h-8 w-8 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-700 font-bold">C</div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. OPERATIONS & SYSTEM HEALTH (Keeping this as is) */}
      <section>
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Operations & System Health</h3>
         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
               <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg"><Server className="w-5 h-5"/></div>
               <div><div className="text-sm text-slate-500">Uptime</div><div className="font-bold text-lg">{MOCK_DATA.systemHealth.uptime}%</div></div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
               <div className={`p-3 rounded-lg ${MOCK_DATA.systemHealth.apiLatency > 100 ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}><Zap className="w-5 h-5"/></div>
               <div><div className="text-sm text-slate-500">Latency</div><div className="font-bold text-lg">{MOCK_DATA.systemHealth.apiLatency}ms</div></div>
            </div>
             <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
               <div className="p-3 bg-indigo-100 text-indigo-600 rounded-lg"><UsersRound className="w-5 h-5"/></div>
               <div><div className="text-sm text-slate-500">Active Sessions</div><div className="font-bold text-lg">{MOCK_DATA.systemHealth.activeSessions}</div></div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
               <div className="p-3 bg-rose-100 text-rose-600 rounded-lg"><AlertCircle className="w-5 h-5"/></div>
               <div><div className="text-sm text-slate-500">Open Tickets</div><div className="font-bold text-lg">{MOCK_DATA.recentTickets.filter(t => t.status === 'Open').length}</div></div>
            </div>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           {/* Cohort Analysis */}
           <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
             <h3 className="text-lg font-semibold text-slate-800 mb-4">Cohort Retention Analysis</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={MOCK_DATA.cohortRetention}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} domain={[50, 100]} />
                    <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px' }} />
                    <Legend />
                    <Line type="monotone" dataKey="cohort2023" name="2023 Vintage" stroke="#cbd5e1" strokeWidth={2} dot={{r: 4}} />
                    <Line type="monotone" dataKey="cohort2024" name="2024 Vintage" stroke="#4f46e5" strokeWidth={3} dot={{r: 4}} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
           </div>

           {/* Support Tickets */}
           <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Recent Tickets</h3>
             <div className="flex-1 overflow-y-auto pr-2 space-y-3">
              {MOCK_DATA.recentTickets.map((ticket) => (
                <div key={ticket.id} className="p-3 bg-slate-50 rounded-lg border border-slate-100 hover:border-slate-300 transition-colors">
                  <div className="flex justify-between items-start mb-1">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      ticket.priority === 'High' ? 'bg-rose-100 text-rose-700' :
                      ticket.priority === 'Medium' ? 'bg-orange-100 text-orange-700' :
                      'bg-slate-200 text-slate-600'
                    }`}>{ticket.priority}</span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock size={10} /> {ticket.time}
                    </span>
                  </div>
                  <div className="text-sm font-semibold text-slate-800 mb-1">{ticket.issue}</div>
                   <div className="text-xs text-slate-500">By {ticket.user}</div>
                </div>
              ))}
            </div>
           </div>
         </div>
      </section>
    </div>
  );

  const ActivityLogView = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Activity Filter Header */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex gap-4">
           <button className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium">
             <Filter className="w-4 h-4"/> All Activities
           </button>
           <button className="flex items-center gap-2 px-3 py-1.5 text-slate-600 hover:bg-slate-50 rounded-lg text-sm font-medium transition-colors">
             <Shield className="w-4 h-4"/> Security
           </button>
           <button className="flex items-center gap-2 px-3 py-1.5 text-slate-600 hover:bg-slate-50 rounded-lg text-sm font-medium transition-colors">
             <DollarSign className="w-4 h-4"/> Payments
           </button>
        </div>
        <div className="relative w-full md:w-64">
           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
           <input
             type="text"
             placeholder="Search logs..."
             className="w-full pl-10 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
           />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
         <div className="overflow-x-auto">
           <table className="w-full text-left border-collapse">
             <thead>
               <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
                 <th className="px-6 py-4 font-semibold">User</th>
                 <th className="px-6 py-4 font-semibold">Action</th>
                 <th className="px-6 py-4 font-semibold">Type</th>
                 <th className="px-6 py-4 font-semibold">Details</th>
                 <th className="px-6 py-4 font-semibold">Status</th>
                 <th className="px-6 py-4 font-semibold text-right">Time</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-slate-100">
               {MOCK_ACTIVITIES.map((event) => {
                 const Icon = getIconForType(event.type);
                 return (
                   <tr key={event.id} className="hover:bg-slate-50 transition-colors group">
                     <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs">
                             {event.userName.charAt(0)}
                           </div>
                           <span className="text-sm font-medium text-slate-900">{event.userName}</span>
                        </div>
                     </td>
                     <td className="px-6 py-4 text-sm font-medium text-slate-800">
                       {event.title}
                     </td>
                     <td className="px-6 py-4">
                       <span className={`px-2 py-1 rounded text-xs font-bold uppercase flex w-fit items-center gap-1 ${
                          event.type === 'security' ? 'bg-rose-100 text-rose-700' :
                          event.type === 'payment' ? 'bg-emerald-100 text-emerald-700' :
                          event.type === 'login' ? 'bg-blue-100 text-blue-700' :
                          'bg-slate-100 text-slate-600'
                       }`}>
                          <Icon className="w-3 h-3" />
                          {event.type}
                       </span>
                     </td>
                     <td className="px-6 py-4 text-sm text-slate-600 max-w-xs truncate">
                       {event.description}
                       {event.amount && <span className="ml-2 font-bold text-slate-900">{event.amount}</span>}
                     </td>
                     <td className="px-6 py-4">
                       <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                          event.status === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                          event.status === 'warning' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                          event.status === 'error' ? 'bg-rose-50 text-rose-700 border-rose-100' :
                          'bg-slate-50 text-slate-600 border-slate-100'
                       }`}>
                         {event.status === 'success' && <CheckCircle2 className="w-3 h-3" />}
                         {event.status === 'warning' && <AlertCircle className="w-3 h-3" />}
                         {event.status === 'error' && <XCircle className="w-3 h-3" />}
                         <span className="capitalize">{event.status || 'Neutral'}</span>
                       </span>
                     </td>
                     <td className="px-6 py-4 text-sm text-slate-500 text-right whitespace-nowrap">
                       {event.time}
                     </td>
                   </tr>
                 );
               })}
             </tbody>
           </table>
         </div>
         
         <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-between items-center text-sm text-slate-500">
            <span>Showing {MOCK_ACTIVITIES.length} entries</span>
            <div className="flex gap-2">
              <button disabled className="px-3 py-1 border border-slate-200 rounded hover:bg-white disabled:opacity-50">Previous</button>
              <button disabled className="px-3 py-1 border border-slate-200 rounded hover:bg-white disabled:opacity-50">Next</button>
            </div>
         </div>
      </div>
    </div>
  );

  const AiPerformanceView = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* 1. Infrastructure Metrics */}
      <section>
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Infrastructure & Cost</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard 
            title="Total Tokens" 
            value={(MOCK_DATA.aiMetrics.totalTokens / 1000000).toFixed(1) + 'M'}
            change="12.5%" 
            positive={true} 
            icon={<Cpu className="w-6 h-6" />}
            description="Input + Output tokens"
          />
          <MetricCard 
            title="Avg Response" 
            value={`${MOCK_DATA.aiMetrics.avgResponseTime}s`}
            change="-0.2s" 
            positive={true} 
            icon={<Timer className="w-6 h-6" />}
            description="P95 Latency"
          />
          <MetricCard 
            title="Est. Cost" 
            value={`$${MOCK_DATA.aiMetrics.totalCost.toLocaleString()}`}
            change="5.4%"
            positive={false} 
            icon={<DollarSign className="w-6 h-6" />}
            description="Monthly API Burn Rate"
          />
          <MetricCard 
            title="Est. Savings" 
            value={`$${(MOCK_DATA.aiMetrics.costSaved / 1000).toFixed(0)}k`}
            positive={true}
            icon={<Sparkles className="w-6 h-6" />}
            description="Vs Human Agents"
          />
        </div>
      </section>

      {/* 2. Chat Dynamics Metrics (NEW) */}
      <section>
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Chat Dynamics & Quality</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard 
            title="Total Chats" 
            value={MOCK_DATA.aiMetrics.totalChats.toLocaleString()}
            change="14.2%" 
            positive={true} 
            icon={<MessageSquare className="w-6 h-6" />}
            description="Completed Sessions"
          />
          <MetricCard 
            title="Avg Turns" 
            value={MOCK_DATA.aiMetrics.avgTurnsPerSession.toString()}
            change="+0.4" 
            positive={true} 
            icon={<ListTree className="w-6 h-6" />}
            description="Depth of conversation"
          />
          <MetricCard 
            title="Resolution Rate" 
            value={`${MOCK_DATA.aiMetrics.resolutionRate}%`}
            change="2.1%"
            positive={true} 
            icon={<CheckCircle2 className="w-6 h-6" />}
            description="No escalation needed"
          />
          <MetricCard 
            title="Fallback Rate" 
            value={`${MOCK_DATA.aiMetrics.fallbackRate}%`}
            change="-0.5%"
            positive={true} 
            icon={<XCircle className="w-6 h-6" />}
            description="Failed/Unknown responses"
          />
        </div>
      </section>

      {/* 3. Cost vs Usage Chart */}
      <section>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Daily Chat Volume & Resolution</h3>
            <p className="text-sm text-slate-400 mb-4">Total sessions vs. Successful resolution %</p>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={MOCK_DATA.aiMetrics.dailyMetrics}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} />
                  <YAxis yAxisId="left" axisLine={false} tickLine={false} />
                  <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} domain={[0, 100]} />
                  <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px' }} />
                  <Legend />
                  <Bar yAxisId="left" dataKey="totalChats" name="Total Chats" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={32} />
                  <Line yAxisId="right" type="monotone" dataKey="resolutionRate" name="Resolution Rate (%)" stroke="#10b981" strokeWidth={3} dot={{r: 4}} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Model Distribution */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Model Preference</h3>
            <p className="text-sm text-slate-400 mb-4">Traffic distribution by Model ID</p>
            <div className="flex-1 min-h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={MOCK_DATA.aiMetrics.modelUsage as any[]}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="percentage"
                    nameKey="modelName"
                  >
                    {MOCK_DATA.aiMetrics.modelUsage.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={DEMO_COLORS[index % DEMO_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px' }} />
                  <Legend 
                    layout="vertical" 
                    verticalAlign="middle" 
                    align="center" 
                    wrapperStyle={{ fontSize: '12px' }} 
                    formatter={(value, entry: any) => (
                      <span className="text-slate-600 font-medium">
                        {value} ({entry.payload.percentage}%)
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Sentiment & Latency */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
           <h3 className="text-lg font-semibold text-slate-800 mb-4">User Feedback Sentiment</h3>
           <div className="space-y-4">
             {MOCK_DATA.aiMetrics.sentiment.map((item, idx) => (
               <div key={idx} className="space-y-1">
                 <div className="flex justify-between text-sm font-medium">
                   <span className="flex items-center gap-2">
                     {item.category === 'Positive' && <ThumbsUp className="w-4 h-4 text-emerald-500" />}
                     {item.category === 'Neutral' && <Activity className="w-4 h-4 text-slate-400" />}
                     {item.category === 'Negative' && <ThumbsDown className="w-4 h-4 text-rose-500" />}
                     {item.category}
                   </span>
                   <span>{item.count}%</span>
                 </div>
                 <div className="w-full bg-slate-100 rounded-full h-2">
                   <div 
                    className="h-2 rounded-full transition-all duration-500" 
                    style={{ 
                      width: `${item.count}%`, 
                      backgroundColor: SENTIMENT_COLORS[idx] 
                    }} 
                   />
                 </div>
               </div>
             ))}
           </div>
           <div className="mt-6 pt-6 border-t border-slate-100">
             <div className="text-xs text-slate-500 mb-2 font-medium uppercase">Quality Insight</div>
             <p className="text-sm text-slate-600 italic">"Users are loving the new Reasoning model (Positive +5% WoW), but flash-lite latency spikes on Tuesday caused some negative feedback."</p>
           </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
           <h3 className="text-lg font-semibold text-slate-800 mb-2">Token Usage Heatmap</h3>
           <p className="text-sm text-slate-400 mb-4">Daily Token Consumption (Input + Output)</p>
           <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={MOCK_DATA.aiMetrics.dailyMetrics}>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                   <XAxis dataKey="date" axisLine={false} tickLine={false} />
                   <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{ backgroundColor: '#fff', borderRadius: '8px' }} />
                   <Bar dataKey="inputTokens" name="Input Tokens" stackId="a" fill="#6366f1" />
                   <Bar dataKey="outputTokens" name="Output Tokens" stackId="a" fill="#818cf8" />
                 </BarChart>
              </ResponsiveContainer>
           </div>
        </div>
      </section>

    </div>
  );

  const UserPerformanceView = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* 1. Header Metrics (Devices, Contacts, Broadcasts) */}
      <section>
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Engagement & Reach</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard 
            title="Active Devices" 
            value={MOCK_DATA.userPerformance.totalConnectedDevices.toLocaleString()} 
            change="5.2%" 
            positive={true} 
            icon={<Smartphone className="w-6 h-6" />}
            description="Currently connected sessions"
          />
          <MetricCard 
            title="Total Contacts" 
            value={(MOCK_DATA.userPerformance.totalContactsManaged / 1000000).toFixed(1) + 'M'} 
            change="12.1%" 
            positive={true} 
            icon={<Users className="w-6 h-6" />}
            description="Audience reach size"
          />
          <MetricCard 
            title="Broadcasts Sent" 
            value={(MOCK_DATA.userPerformance.totalBroadcastsSent / 1000).toFixed(0) + 'k'}
            change="8.4%"
            positive={true} 
            icon={<Send className="w-6 h-6" />}
            description="Outbound messages this month"
          />
           <MetricCard 
            title="Delivery Rate" 
            value={`${MOCK_DATA.userPerformance.avgDeliveryRate}%`}
            change="0.5%"
            positive={true}
            icon={<Radio className="w-6 h-6" />}
            description="Avg. successful delivery"
          />
        </div>
      </section>

      {/* 2. Broadcast Performance Chart */}
      <section>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Broadcast Volume & Reliability</h3>
            <p className="text-sm text-slate-400 mb-4">Daily outbound volume vs. failed delivery count</p>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={MOCK_DATA.userPerformance.broadcastHistory}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} />
                  <YAxis yAxisId="left" axisLine={false} tickLine={false} />
                  <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px' }} />
                  <Legend />
                  <Bar yAxisId="left" dataKey="sent" name="Total Sent" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={24} />
                  <Area yAxisId="right" type="monotone" dataKey="failed" name="Failed Delivery" stroke="#ef4444" fill="#ef4444" fillOpacity={0.1} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Device Distribution */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Device Ecosystem</h3>
            <p className="text-sm text-slate-400 mb-4">Platform connectivity share</p>
            <div className="flex-1 min-h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={MOCK_DATA.userPerformance.deviceDistribution as any[]}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="count"
                    nameKey="type"
                  >
                    {MOCK_DATA.userPerformance.deviceDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={DEMO_COLORS[index % DEMO_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px' }} />
                  <Legend 
                    layout="vertical" 
                    verticalAlign="middle" 
                    align="center" 
                    wrapperStyle={{ fontSize: '12px' }} 
                    formatter={(value, entry: any) => (
                      <span className="text-slate-600 font-medium">
                        {value} ({((entry.payload.count / MOCK_DATA.userPerformance.totalConnectedDevices) * 100).toFixed(0)}%)
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-4 text-slate-500">
               <div className="flex items-center gap-1 text-xs"><Tablet className="w-3 h-3"/> Mobile</div>
               <div className="flex items-center gap-1 text-xs"><Monitor className="w-3 h-3"/> Desktop</div>
            </div>
          </div>
        </div>
      </section>
      
      {/* 3. Geographic Distribution (NEW SECTION) */}
      <section>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
           <div className="flex items-center gap-2 mb-2">
             <MapPin className="w-5 h-5 text-indigo-600" />
             <h3 className="text-lg font-semibold text-slate-800">Geographic Distribution</h3>
           </div>
           <p className="text-sm text-slate-400 mb-6">Top user locations across Indonesia</p>
           
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Chart */}
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    layout="vertical" 
                    data={MOCK_DATA.userPerformance.locationMetrics} 
                    margin={{ left: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                    <XAxis type="number" hide />
                    <YAxis dataKey="city" type="category" width={100} tick={{fontSize: 12, fontWeight: 500}} axisLine={false} tickLine={false} />
                    <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{ backgroundColor: '#fff', borderRadius: '8px' }} />
                    <Bar dataKey="count" name="Users" fill="#4f46e5" radius={[0, 4, 4, 0]} barSize={20}>
                      {MOCK_DATA.userPerformance.locationMetrics.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? '#4f46e5' : '#818cf8'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* List Details */}
              <div className="overflow-hidden">
                <div className="grid grid-cols-2 gap-4">
                  {MOCK_DATA.userPerformance.locationMetrics.slice(0, 6).map((loc, idx) => (
                    <div key={idx} className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-500">
                            {idx + 1}
                          </span>
                          <span className="font-medium text-slate-700">{loc.city}</span>
                       </div>
                       <div className="text-right">
                          <div className="font-bold text-slate-900">{loc.count.toLocaleString()}</div>
                          <div className="text-xs text-slate-500">{loc.percentage}%</div>
                       </div>
                    </div>
                  ))}
                </div>
              </div>
           </div>
        </div>
      </section>

      {/* 4. Contact Growth Analysis */}
      <section>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
           <h3 className="text-lg font-semibold text-slate-800 mb-2">Audience Growth</h3>
           <p className="text-sm text-slate-400 mb-4">Cumulative contact list size over time</p>
           <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={MOCK_DATA.userPerformance.contactGrowth}>
                   <defs>
                    <linearGradient id="colorContacts" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                   </defs>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                   <XAxis dataKey="month" axisLine={false} tickLine={false} />
                   <YAxis axisLine={false} tickLine={false} />
                   <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{ backgroundColor: '#fff', borderRadius: '8px' }} />
                   <Area type="monotone" dataKey="totalContacts" name="Total Contacts" stroke="#10b981" fillOpacity={1} fill="url(#colorContacts)" />
                 </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>
      </section>
    </div>
  );

  const SettingsView = () => (
    <div className="space-y-6">
       <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
         <div className="grid grid-cols-1 md:grid-cols-4">
           {/* Settings Sidebar */}
           <div className="p-6 bg-slate-50 border-r border-slate-200 space-y-1">
             <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Configuration</h3>
             <button className="w-full text-left px-3 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium flex items-center gap-2">
               <Settings className="w-4 h-4" /> General
             </button>
             <button className="w-full text-left px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-medium flex items-center gap-2">
               <UserPlus className="w-4 h-4" /> Team Members
             </button>
             <button className="w-full text-left px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-medium flex items-center gap-2">
               <CreditCard className="w-4 h-4" /> Billing & Invoices
             </button>
             <button className="w-full text-left px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-medium flex items-center gap-2">
               <Lock className="w-4 h-4" /> Security & APIs
             </button>
           </div>
           
           {/* Settings Content */}
           <div className="p-8 md:col-span-3">
             <h2 className="text-xl font-bold text-slate-900 mb-6">General Settings</h2>
             
             <div className="space-y-6 max-w-lg">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Organization Name</label>
                  <input type="text" defaultValue="NexusAI Inc." className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                
                 <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Support Email</label>
                  <input type="email" defaultValue="support@nexusai.com" className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>

                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-2">Timezone</label>
                   <select className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm">
                     <option>UTC (GMT+0)</option>
                     <option>EST (GMT-5)</option>
                     <option>PST (GMT-8)</option>
                   </select>
                </div>

                <div className="pt-4 flex gap-3">
                  <button className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700">Save Changes</button>
                  <button className="px-4 py-2 bg-white border border-slate-300 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50">Cancel</button>
                </div>
             </div>
           </div>
         </div>
       </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-slate-900 text-white flex-shrink-0 flex flex-col hidden md:flex">
        <div className="p-6">
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Bot className="text-indigo-400" />
            Nexus<span className="text-indigo-400">AI</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">Admin Dashboard</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <button 
            onClick={() => setCurrentView(ViewType.EXECUTIVE)}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${currentView === ViewType.EXECUTIVE ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
          >
            <LayoutDashboard className="w-5 h-5" />
            Executive Overview
          </button>
          
          <button 
             onClick={() => setCurrentView(ViewType.AI_PERFORMANCE)}
             className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${currentView === ViewType.AI_PERFORMANCE ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
           >
            <Brain className="w-5 h-5" />
            AI Performance
          </button>

          <button 
             onClick={() => setCurrentView(ViewType.USER_PERFORMANCE)}
             className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${currentView === ViewType.USER_PERFORMANCE ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
           >
            <Smartphone className="w-5 h-5" />
            User Performance
          </button>

          <div className="pt-4 mt-4 border-t border-slate-800">
             <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Management</p>
             <button 
               onClick={() => setCurrentView(ViewType.USERS)}
               className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${currentView === ViewType.USERS ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
             >
              <UsersRound className="w-5 h-5" />
              User List
            </button>
            <button 
               onClick={() => setCurrentView(ViewType.CRM)}
               className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${currentView === ViewType.CRM ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
             >
              <MessageCircle className="w-5 h-5" />
              CRM & Outreach
            </button>
            <button 
               onClick={() => setCurrentView(ViewType.ACTIVITY_LOG)}
               className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${currentView === ViewType.ACTIVITY_LOG ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
             >
              <ScrollText className="w-5 h-5" />
              Activity Log
            </button>
          </div>
        </nav>

        <div className="p-4 border-t border-slate-800 mt-auto">
           <button 
              onClick={() => setCurrentView(ViewType.SETTINGS)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors mb-2 ${currentView === ViewType.SETTINGS ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
            >
              <Settings className="w-5 h-5" />
              Settings
            </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-8 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm">
          <div>
             <h2 className="text-2xl font-bold text-slate-800 capitalize">
               {currentView === ViewType.EXECUTIVE && "Executive Overview"}
               {currentView === ViewType.USERS && "User Management"}
               {currentView === ViewType.CRM && "CRM & Outreach"}
               {currentView === ViewType.SETTINGS && "Platform Settings"}
               {currentView === ViewType.AI_PERFORMANCE && "AI Performance Metrics"}
               {currentView === ViewType.USER_PERFORMANCE && "User Usage Performance"}
               {currentView === ViewType.ACTIVITY_LOG && "Global Activity Feed"}
             </h2>
             <p className="text-sm text-slate-500 mt-1">Real-time data monitoring</p>
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
             {/* Global Date Filter */}
             {(currentView === ViewType.EXECUTIVE || currentView === ViewType.AI_PERFORMANCE || currentView === ViewType.USER_PERFORMANCE || currentView === ViewType.ACTIVITY_LOG) && (
               <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-lg p-1 w-full md:w-auto">
                  <CalendarDays className="w-4 h-4 text-slate-500 absolute left-3" />
                  <select 
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="bg-transparent pl-9 pr-8 py-1.5 text-sm font-medium text-slate-700 focus:outline-none cursor-pointer w-full md:w-48 appearance-none"
                  >
                    <option value="today">Today</option>
                    <option value="yesterday">Yesterday</option>
                    <option value="7d">Last 7 Days</option>
                    <option value="30d">Last 30 Days</option>
                    <option value="qtd">This Quarter</option>
                    <option value="ytd">Year to Date</option>
                  </select>
               </div>
             )}

             <div className="hidden md:flex items-center gap-2 text-sm text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full whitespace-nowrap">
               <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
               System Stable
             </div>
          </div>
        </header>

        <div className="p-8">
           {currentView === ViewType.EXECUTIVE && <ExecutiveView />}
           {currentView === ViewType.USERS && <UserList users={users} onUserClick={setSelectedUser} onAddUser={handleAddUser} />}
           {currentView === ViewType.CRM && <CrmView users={users} />}
           {currentView === ViewType.SETTINGS && <SettingsView />}
           {currentView === ViewType.AI_PERFORMANCE && <AiPerformanceView />}
           {currentView === ViewType.USER_PERFORMANCE && <UserPerformanceView />}
           {currentView === ViewType.ACTIVITY_LOG && <ActivityLogView />}
        </div>
      </main>

      {/* Overlays */}
      <UserDetailModal user={selectedUser} onClose={() => setSelectedUser(null)} />
    </div>
  );
}

export default App;