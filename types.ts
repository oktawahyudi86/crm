import React from 'react';

export enum ViewType {
  EXECUTIVE = 'EXECUTIVE',
  USERS = 'USERS',
  SETTINGS = 'SETTINGS',
  AI_PERFORMANCE = 'AI_PERFORMANCE',
  USER_PERFORMANCE = 'USER_PERFORMANCE',
  ACTIVITY_LOG = 'ACTIVITY_LOG',
  CRM = 'CRM' // New View
}

export interface MetricCardProps {
  title: string;
  value: string;
  change?: string;
  positive?: boolean;
  icon: React.ReactNode;
  description?: string;
}

export interface ChartDataPoint {
  name: string;
  [key: string]: string | number;
}

export interface PageMetric {
  pageName: string;
  views: number;
  avgTimeOnPage: number; // in seconds
  bounceRate: number; // percentage
}

// New AI Metric Interfaces
export interface AiDailyMetric {
  date: string;
  inputTokens: number;
  outputTokens: number;
  totalCost: number;
  avgLatency: number; // ms
  totalChats: number; 
  resolutionRate: number; 
}

export interface AiModelUsage {
  modelName: string;
  percentage: number;
  costPer1k: number;
}

export interface AiSentiment {
  category: 'Positive' | 'Neutral' | 'Negative';
  count: number;
}

// New User Performance Interfaces
export interface BroadcastMetric {
  date: string;
  sent: number;
  delivered: number;
  failed: number;
}

export interface DeviceMetric {
  type: string;
  count: number;
}

export interface ContactGrowthMetric {
  month: string;
  totalContacts: number;
  newContacts: number;
}

// Subscription Metrics
export interface SubscriptionMetric {
  plan: string;
  userCount: number;
  mrrContribution: number; // In dollars
  growthRate: number; // percentage
}

// Activity Log Interface
export interface ActivityLogItem {
  id: number;
  userId?: string;
  userName: string;
  userAvatar?: string;
  type: 'payment' | 'login' | 'feature' | 'upgrade' | 'support' | 'security' | 'system';
  title: string;
  time: string;
  description: string;
  amount?: string; // For payments
  status?: 'success' | 'warning' | 'error' | 'neutral';
}

export interface User {
  id: string;
  name: string;
  email: string;
  company: string;
  plan: 'Free' | 'Basic' | 'Premium' | 'Enterprise';
  status: 'Active' | 'Churned' | 'Trial';
  industry: string;
  location: string; // New Field
  joinDate: string;
  mrr: number;
}

export interface SupportTicket {
  id: string;
  user: string;
  issue: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Open' | 'Resolved' | 'In Progress';
  time: string;
}

export interface SystemHealth {
  apiLatency: number;
  errorRate: number;
  uptime: number;
  activeSessions: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

// CRM Interaction History
export interface CrmInteraction {
  id: string;
  userId: string;
  type: 'email' | 'whatsapp';
  subject?: string;
  content: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read' | 'failed';
  adminName: string;
}

export interface LocationMetric {
  city: string;
  count: number;
  percentage: number;
}

export interface DashboardData {
  mrr: number;
  arr: number;
  activeUsers: number;
  churnRate: number;
  ltv: number;
  cac: number;
  nps: number;
  burnRate: number;
  runway: number;
  revenueGrowth: ChartDataPoint[]; 
  featureUsageTrends: ChartDataPoint[]; 
  pageEngagement: PageMetric[]; 
  cohortRetention: ChartDataPoint[];
  weeklyPaidUsers: number;
  userDemographics: ChartDataPoint[];
  users: User[];
  recentTickets: SupportTicket[];
  systemHealth: SystemHealth;
  systemTraffic: ChartDataPoint[];
  // AI Specific Data
  aiMetrics: {
    totalTokens: number;
    avgResponseTime: number;
    totalCost: number;
    costSaved: number; // vs human agents
    totalChats: number;
    avgTurnsPerSession: number;
    resolutionRate: number;
    fallbackRate: number;
    dailyMetrics: AiDailyMetric[];
    modelUsage: AiModelUsage[];
    sentiment: AiSentiment[];
  };
  // User Performance Data (New)
  userPerformance: {
    totalConnectedDevices: number;
    totalContactsManaged: number;
    totalBroadcastsSent: number;
    avgDeliveryRate: number;
    broadcastHistory: BroadcastMetric[];
    deviceDistribution: DeviceMetric[];
    contactGrowth: ContactGrowthMetric[];
    locationMetrics: LocationMetric[]; // New Metric
  };
  // Subscription Data
  subscriptionMetrics: SubscriptionMetric[];
}