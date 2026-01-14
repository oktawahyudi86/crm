import { DashboardData, User, SupportTicket, SystemHealth, ActivityLogItem, CrmInteraction } from './types';

const MOCK_USERS: User[] = [
  { id: '1', name: 'Sarah Connor', email: 'sarah@skynet.com', company: 'Cyberdyne Systems', plan: 'Enterprise', status: 'Active', industry: 'SaaS B2B', location: 'Jakarta Selatan', joinDate: '2023-01-15', mrr: 2500 },
  { id: '2', name: 'John Doe', email: 'john@example.com', company: 'TechStart Inc', plan: 'Basic', status: 'Active', industry: 'E-commerce', location: 'Bandung', joinDate: '2023-03-10', mrr: 49 },
  { id: '3', name: 'Alice Smith', email: 'alice@wonderland.co', company: 'Wonderland Retail', plan: 'Premium', status: 'Trial', industry: 'E-commerce', location: 'Surabaya', joinDate: '2024-02-20', mrr: 0 },
  { id: '4', name: 'Bob Martin', email: 'bob@builder.net', company: 'Constructo', plan: 'Free', status: 'Active', industry: 'Construction', location: 'Medan', joinDate: '2024-01-05', mrr: 0 },
  { id: '5', name: 'Emily Chen', email: 'emily@meditech.io', company: 'MediTech Solutions', plan: 'Enterprise', status: 'Active', industry: 'Healthcare', location: 'Jakarta Pusat', joinDate: '2023-06-12', mrr: 3000 },
  { id: '6', name: 'Michael Scott', email: 'mscott@dundermifflin.com', company: 'Dunder Mifflin', plan: 'Basic', status: 'Churned', industry: 'Retail', location: 'Yogyakarta', joinDate: '2022-11-01', mrr: 0 },
  { id: '7', name: 'David Wallace', email: 'dwallace@cfo.com', company: 'Wallace Corp', plan: 'Premium', status: 'Active', industry: 'Fintech', location: 'Jakarta Selatan', joinDate: '2023-09-18', mrr: 199 },
  { id: '8', name: 'Elena Gilbert', email: 'elena@mystic.net', company: 'Mystic Falls', plan: 'Free', status: 'Active', industry: 'Education', location: 'Denpasar', joinDate: '2024-03-01', mrr: 0 },
  { id: '9', name: 'Tony Stark', email: 'tony@stark.com', company: 'Stark Industries', plan: 'Enterprise', status: 'Active', industry: 'SaaS B2B', location: 'Jakarta Utara', joinDate: '2022-05-20', mrr: 5000 },
  { id: '10', name: 'Bruce Wayne', email: 'bruce@wayne.com', company: 'Wayne Enterprises', plan: 'Enterprise', status: 'Active', industry: 'Fintech', location: 'Semarang', joinDate: '2022-04-10', mrr: 4500 },
  { id: '11', name: 'Clark Kent', email: 'clark@dailyplanet.com', company: 'Daily Planet', plan: 'Basic', status: 'Active', industry: 'Media', location: 'Jakarta Barat', joinDate: '2023-12-05', mrr: 49 },
  { id: '12', name: 'Diana Prince', email: 'diana@themyscira.gov', company: 'Amazonia', plan: 'Premium', status: 'Trial', industry: 'Non-profit', location: 'Bogor', joinDate: '2024-03-15', mrr: 0 },
  { id: '13', name: 'Peter Parker', email: 'peter@dailybugle.com', company: 'Freelance', plan: 'Free', status: 'Active', industry: 'Media', location: 'Malang', joinDate: '2024-01-20', mrr: 0 },
  { id: '14', name: 'Natasha Romanoff', email: 'nat@shield.gov', company: 'SHIELD', plan: 'Premium', status: 'Active', industry: 'Government', location: 'Jakarta Pusat', joinDate: '2023-08-30', mrr: 199 },
  { id: '15', name: 'Steve Rogers', email: 'steve@avengers.org', company: 'Avengers Inc', plan: 'Basic', status: 'Churned', industry: 'Non-profit', location: 'Makassar', joinDate: '2023-02-14', mrr: 0 },
  { id: '16', name: 'Wanda Maximoff', email: 'wanda@westview.io', company: 'Hex Reality', plan: 'Premium', status: 'Active', industry: 'Entertainment', location: 'Tangerang', joinDate: '2023-10-31', mrr: 199 },
];

export const MOCK_TICKETS: SupportTicket[] = [
  { id: 'T-101', user: 'Sarah Connor', issue: 'API Rate Limit Exceeded', priority: 'High', status: 'Open', time: '10 mins ago' },
  { id: 'T-102', user: 'John Doe', issue: 'Billing Invoice Error', priority: 'Medium', status: 'In Progress', time: '45 mins ago' },
  { id: 'T-103', user: 'Peter Parker', issue: 'Login Failure', priority: 'Low', status: 'Resolved', time: '2 hours ago' },
  { id: 'T-104', user: 'Tony Stark', issue: 'Feature Request: Custom Model', priority: 'Low', status: 'Open', time: '3 hours ago' },
];

const MOCK_HEALTH: SystemHealth = {
  apiLatency: 124, // ms
  errorRate: 0.05, // %
  uptime: 99.98, // %
  activeSessions: 843
};

export const MOCK_CRM_HISTORY: CrmInteraction[] = [
  { id: '1', userId: '1', type: 'email', subject: 'Enterprise Plan Review', content: 'Hi Sarah, checking in on your Q3 usage metrics.', timestamp: '2 days ago', status: 'read', adminName: 'Admin' },
  { id: '2', userId: '1', type: 'whatsapp', content: 'Urgent: API key rotation needed for security.', timestamp: '2 days ago', status: 'read', adminName: 'Support Bot' },
  { id: '3', userId: '3', type: 'email', subject: 'Trial Ending Soon', content: 'Hi Alice, your trial ends in 3 days. Need help extending?', timestamp: 'Yesterday', status: 'sent', adminName: 'Admin' },
  { id: '4', userId: '6', type: 'whatsapp', content: 'We miss you! Special 20% off if you reactivate.', timestamp: '1 week ago', status: 'failed', adminName: 'Growth Team' },
];

export const MOCK_ACTIVITIES: ActivityLogItem[] = [
  { id: 1, userId: '1', userName: 'Sarah Connor', type: 'payment', title: 'Invoice #INV-2024-001 Paid', time: 'Today, 09:41 AM', description: 'Payment processed successfully via Stripe.', amount: '$2,500.00', status: 'success' },
  { id: 2, userId: '2', userName: 'John Doe', type: 'login', title: 'Login from New Device', time: 'Today, 09:30 AM', description: 'Logged in from MacBook Pro (Chrome) in Seattle, WA.', status: 'neutral' },
  { id: 3, userId: '5', userName: 'Emily Chen', type: 'feature', title: 'AI Model Fine-tuning Started', time: 'Today, 09:15 AM', description: 'Started fine-tuning job on "Healthcare-Bot-v2".', status: 'warning' },
  { id: 4, userId: '9', userName: 'Tony Stark', type: 'upgrade', title: 'Plan Upgraded', time: 'Today, 08:45 AM', description: 'Upgraded from Premium to Enterprise plan.', status: 'success' },
  { id: 5, userId: '3', userName: 'Alice Smith', type: 'support', title: 'Ticket #T-105 Created', time: 'Today, 08:20 AM', description: 'Issue: "Workflow automation failing on step 3".', status: 'warning' },
  { id: 6, userId: 'system', userName: 'System', type: 'system', title: 'Daily Backup Completed', time: 'Today, 04:00 AM', description: 'Full database backup successfully stored in S3.', status: 'success' },
  { id: 7, userId: '10', userName: 'Bruce Wayne', type: 'security', title: 'Failed Login Attempt', time: 'Yesterday, 11:20 PM', description: '3 failed login attempts from IP 192.168.1.1.', status: 'error' },
  { id: 8, userId: '13', userName: 'Peter Parker', type: 'feature', title: 'New Project Created', time: 'Yesterday, 04:05 PM', description: 'Created project "Spider-Bot" using the Creative Writing template.', status: 'neutral' },
  { id: 9, userId: '7', userName: 'David Wallace', type: 'payment', title: 'Subscription Renewed', time: 'Yesterday, 10:00 AM', description: 'Monthly subscription renewal successful.', amount: '$199.00', status: 'success' },
  { id: 10, userId: '11', userName: 'Clark Kent', type: 'login', title: 'User Login', time: 'Yesterday, 09:00 AM', description: 'Logged in from Metropolis Daily Planet Office.', status: 'neutral' },
  { id: 11, userId: '1', userName: 'Sarah Connor', type: 'security', title: 'API Key Rotated', time: '2 days ago', description: 'Production API Key was rotated by user.', status: 'warning' },
  { id: 12, userId: '5', userName: 'Emily Chen', type: 'feature', title: 'Integration Connected', time: '2 days ago', description: 'Connected Salesforce integration successfully.', status: 'success' },
  { id: 13, userId: '4', userName: 'Bob Martin', type: 'support', title: 'Ticket Resolved', time: '3 days ago', description: 'Ticket #T-99 "Login Issue" marked as resolved.', status: 'success' },
];

export const MOCK_DATA: DashboardData = {
  mrr: 84500,
  arr: 1014000,
  activeUsers: 12450,
  churnRate: 2.4,
  ltv: 2150,
  cac: 340,
  nps: 72,
  burnRate: 45000,
  runway: 18,
  weeklyPaidUsers: 185,
  revenueGrowth: [
    { name: 'Jan', revenue: 45000, expenses: 38000 },
    { name: 'Feb', revenue: 52000, expenses: 40000 },
    { name: 'Mar', revenue: 58000, expenses: 41000 },
    { name: 'Apr', revenue: 64000, expenses: 42000 },
    { name: 'May', revenue: 72000, expenses: 44000 },
    { name: 'Jun', revenue: 84500, expenses: 45000 },
  ],
  featureUsageTrends: [
    { name: 'Mon', chat: 4000, workflows: 2400, analytics: 2400 },
    { name: 'Tue', chat: 3000, workflows: 1398, analytics: 2210 },
    { name: 'Wed', chat: 2000, workflows: 9800, analytics: 2290 },
    { name: 'Thu', chat: 2780, workflows: 3908, analytics: 2000 },
    { name: 'Fri', chat: 1890, workflows: 4800, analytics: 2181 },
    { name: 'Sat', chat: 2390, workflows: 3800, analytics: 2500 },
    { name: 'Sun', chat: 3490, workflows: 4300, analytics: 2100 },
  ],
  pageEngagement: [
    { pageName: 'Dashboard', views: 15400, avgTimeOnPage: 45, bounceRate: 25 },
    { pageName: 'AI Chat Interface', views: 12300, avgTimeOnPage: 320, bounceRate: 15 },
    { pageName: 'Template Library', views: 8200, avgTimeOnPage: 180, bounceRate: 35 },
    { pageName: 'Settings/API', views: 4100, avgTimeOnPage: 120, bounceRate: 40 },
    { pageName: 'Billing', views: 2100, avgTimeOnPage: 60, bounceRate: 10 },
  ],
  cohortRetention: [
    { name: 'Month 1', cohort2023: 100, cohort2024: 100 },
    { name: 'Month 2', cohort2023: 88, cohort2024: 92 },
    { name: 'Month 3', cohort2023: 82, cohort2024: 89 },
    { name: 'Month 6', cohort2023: 75, cohort2024: 85 },
    { name: 'Month 12', cohort2023: 60, cohort2024: 78 },
  ],
  userDemographics: [
    { name: 'E-commerce', value: 35 },
    { name: 'SaaS B2B', value: 25 },
    { name: 'Healthcare', value: 15 },
    { name: 'Fintech', value: 10 },
    { name: 'Education', value: 15 },
  ],
  users: MOCK_USERS,
  recentTickets: MOCK_TICKETS,
  systemHealth: MOCK_HEALTH,
  systemTraffic: [
    { name: '00:00', traffic: 2400 },
    { name: '04:00', traffic: 1398 },
    { name: '08:00', traffic: 5800 },
    { name: '12:00', traffic: 8908 },
    { name: '16:00', traffic: 9800 },
    { name: '20:00', traffic: 4800 },
    { name: '23:59', traffic: 3800 },
  ],
  aiMetrics: {
    totalTokens: 45200000,
    avgResponseTime: 1.8, // seconds
    totalCost: 12500, // $
    costSaved: 145000, // $ estimated vs human agents
    // NEW METRICS DATA
    totalChats: 24500,
    avgTurnsPerSession: 5.4,
    resolutionRate: 88.5,
    fallbackRate: 3.2,
    dailyMetrics: [
      { date: 'Mon', inputTokens: 450000, outputTokens: 250000, totalCost: 450, avgLatency: 1.5, totalChats: 3200, resolutionRate: 87 },
      { date: 'Tue', inputTokens: 480000, outputTokens: 280000, totalCost: 490, avgLatency: 1.6, totalChats: 3500, resolutionRate: 88 },
      { date: 'Wed', inputTokens: 520000, outputTokens: 310000, totalCost: 550, avgLatency: 1.9, totalChats: 3900, resolutionRate: 85 },
      { date: 'Thu', inputTokens: 490000, outputTokens: 290000, totalCost: 510, avgLatency: 1.7, totalChats: 3600, resolutionRate: 90 },
      { date: 'Fri', inputTokens: 550000, outputTokens: 340000, totalCost: 600, avgLatency: 2.1, totalChats: 4100, resolutionRate: 89 },
      { date: 'Sat', inputTokens: 300000, outputTokens: 150000, totalCost: 310, avgLatency: 1.4, totalChats: 2200, resolutionRate: 92 },
      { date: 'Sun', inputTokens: 320000, outputTokens: 160000, totalCost: 330, avgLatency: 1.4, totalChats: 2400, resolutionRate: 93 },
    ],
    modelUsage: [
      { modelName: 'Nexus-GPT-4o', percentage: 45, costPer1k: 0.03 },
      { modelName: 'Nexus-Flash-Lite', percentage: 35, costPer1k: 0.005 },
      { modelName: 'Nexus-Reasoning', percentage: 20, costPer1k: 0.06 },
    ],
    sentiment: [
      { category: 'Positive', count: 85 },
      { category: 'Neutral', count: 10 },
      { category: 'Negative', count: 5 },
    ]
  },
  userPerformance: {
    totalConnectedDevices: 18450,
    totalContactsManaged: 2500000,
    totalBroadcastsSent: 850000,
    avgDeliveryRate: 94.2,
    broadcastHistory: [
      { date: 'Mon', sent: 120000, delivered: 115000, failed: 5000 },
      { date: 'Tue', sent: 135000, delivered: 128000, failed: 7000 },
      { date: 'Wed', sent: 150000, delivered: 142000, failed: 8000 },
      { date: 'Thu', sent: 110000, delivered: 105000, failed: 5000 },
      { date: 'Fri', sent: 180000, delivered: 165000, failed: 15000 },
      { date: 'Sat', sent: 90000, delivered: 88000, failed: 2000 },
      { date: 'Sun', sent: 65000, delivered: 64000, failed: 1000 },
    ],
    deviceDistribution: [
      { type: 'Android', count: 11500 },
      { type: 'iOS', count: 5500 },
      { type: 'Web/Desktop', count: 1450 },
    ],
    contactGrowth: [
      { month: 'Jan', totalContacts: 1200000, newContacts: 150000 },
      { month: 'Feb', totalContacts: 1450000, newContacts: 250000 },
      { month: 'Mar', totalContacts: 1800000, newContacts: 350000 },
      { month: 'Apr', totalContacts: 2100000, newContacts: 300000 },
      { month: 'May', totalContacts: 2500000, newContacts: 400000 },
    ],
    locationMetrics: [
      { city: 'Jakarta (All)', count: 5200, percentage: 41.7 },
      { city: 'Surabaya', count: 1850, percentage: 14.8 },
      { city: 'Bandung', count: 1420, percentage: 11.4 },
      { city: 'Medan', count: 980, percentage: 7.8 },
      { city: 'Bali', count: 850, percentage: 6.8 },
      { city: 'Yogyakarta', count: 720, percentage: 5.7 },
      { city: 'Semarang', count: 640, percentage: 5.1 },
      { city: 'Other', count: 790, percentage: 6.3 },
    ]
  },
  subscriptionMetrics: [
    { plan: 'Free', userCount: 8500, mrrContribution: 0, growthRate: 15 },
    { plan: 'Basic', userCount: 2800, mrrContribution: 137200, growthRate: 8 },
    { plan: 'Premium', userCount: 1000, mrrContribution: 199000, growthRate: 12 },
    { plan: 'Enterprise', userCount: 150, mrrContribution: 508800, growthRate: 5 },
  ]
};

export const SYSTEM_INSTRUCTION = `
You are the Strategic AI Advisor for NexusAI, a SaaS AI Chat Agent platform.

Current Operational Metrics:
- MRR: $${MOCK_DATA.mrr.toLocaleString()}
- Active Users: ${MOCK_DATA.activeUsers.toLocaleString()}
- Churn Rate: ${MOCK_DATA.churnRate}%
- CAC: $${MOCK_DATA.cac} | LTV: $${MOCK_DATA.ltv} | Ratio: ${(MOCK_DATA.ltv/MOCK_DATA.cac).toFixed(1)}x
- NPS: ${MOCK_DATA.nps}
- Weekly New Paid Users: ${MOCK_DATA.weeklyPaidUsers}

Demographics Top Industries:
${MOCK_DATA.userDemographics.map(d => `- ${d.name}: ${d.value}%`).join('\n')}

Plan Distribution:
${MOCK_DATA.subscriptionMetrics.map(p => `- ${p.plan}: ${p.userCount.toLocaleString()} users ($${(p.mrrContribution/1000).toFixed(1)}k MRR)`).join('\n')}

Role & Perspective:
1. **Marketing Team:** Focus on CAC efficiency, LTV per industry, conversion from Free to Paid, and identifying which demographics yield the highest ROI. Use terms like "Funnel velocity", "Acquisition cost", and "Stickiness".
2. **Executive/CEO:** Focus on Burn Rate ($${MOCK_DATA.burnRate.toLocaleString()}), Runway (${MOCK_DATA.runway} months), and Rule of 40.
3. **Operations:** Focus on Support efficiency (Open Tickets: ${MOCK_TICKETS.filter(t => t.status === 'Open').length}), System Uptime (${MOCK_DATA.systemHealth.uptime}%), and AI Token Costs.

Behavior:
- Be concise, analytical, and data-driven.
- If asked about specific trends, correlate the data (e.g., "High churn in Retail might be due to...").
- Do not just list numbers; provide *strategic insight*.
`;

export const SUGGESTED_QUESTIONS = [
  "Analyze our LTV:CAC ratio by Industry.",
  "Which pricing plan has the highest churn risk?",
  "How effectively are we converting Free users to Paid?",
  "Draft a strategy to increase Enterprise adoption.",
];