export interface Segment {
  id: string;
  name: string;
  description?: string;
  type: 'automatic' | 'manual' | 'smart';
  rules: SegmentRule[];
  memberCount: number;
  status: 'active' | 'inactive' | 'archived';
  createdAt: string;
  updatedAt: string;
  lastRefreshed?: string;
  createdBy: string;
}

export interface SegmentRule {
  id: string;
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'greater_than' | 'less_than' | 'between' | 'in' | 'not_in';
  value: any;
  logicalOperator?: 'AND' | 'OR';
}

export interface SmartList {
  id: string;
  name: string;
  description?: string;
  segmentId?: string;
  memberCount: number;
  refreshFrequency: 'realtime' | 'hourly' | 'daily' | 'weekly' | 'manual';
  lastRefreshed: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
  members: ListMember[];
}

export interface ListMember {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  joinedAt: string;
  metadata?: Record<string, any>;
}

export interface BehaviorPattern {
  id: string;
  clientId: string;
  clientName: string;
  patternType: 'attendance' | 'purchase' | 'engagement' | 'risk';
  score: number;
  details: Record<string, any>;
  detectedAt: string;
}

export interface PredictiveSegment {
  id: string;
  name: string;
  modelType: 'churn' | 'upsell' | 'engagement' | 'conversion';
  confidence: number;
  memberCount: number;
  criteria: Record<string, any>;
  createdAt: string;
}

export interface SegmentAnalytics {
  segmentId: string;
  segmentName: string;
  totalMembers: number;
  engagementRate: number;
  conversionRate: number;
  revenue: number;
  avgLifetimeValue: number;
  churnRate: number;
  period: {
    start: string;
    end: string;
  };
  trends: {
    memberCount: TrendData[];
    engagement: TrendData[];
    revenue: TrendData[];
  };
}

export interface TrendData {
  date: string;
  value: number;
}

export interface AutomationRule {
  id: string;
  name: string;
  segmentId: string;
  trigger: 'member_added' | 'member_removed' | 'segment_updated' | 'schedule';
  action: 'send_email' | 'send_sms' | 'add_to_campaign' | 'assign_tag' | 'webhook';
  actionConfig: Record<string, any>;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SegmentComparison {
  segments: string[];
  metrics: {
    memberCount: number[];
    engagementRate: number[];
    conversionRate: number[];
    revenue: number[];
  };
  period: {
    start: string;
    end: string;
  };
}

export interface SegmentFilters {
  type?: 'automatic' | 'manual' | 'smart';
  status?: 'active' | 'inactive' | 'archived';
  search?: string;
}

