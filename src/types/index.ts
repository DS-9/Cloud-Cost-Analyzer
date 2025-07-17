export interface DateRange {
  start: Date;
  end: Date;
}

export interface CostData {
  id: string;
  platform: 'aws' | 'azure';
  resourceType: string;
  resourceName: string;
  cost: number;
  currency: string;
  period: DateRange;
  tags: Record<string, string>;
}

export interface PlatformCosts {
  aws: number;
  azure: number;
  total: number;
}

export interface CostSummary {
  totalCost: number;
  monthlyTrend: number;
  topCostDrivers: CostData[];
  platformBreakdown: PlatformCosts;
}

export interface CloudResource {
  id: string;
  name: string;
  type: string;
  platform: 'aws' | 'azure';
  region: string;
  status: 'running' | 'stopped' | 'terminated';
  utilization: number;
  cost: number;
  lastUpdated: Date;
}

export interface OptimizationRecommendation {
  id: string;
  type: 'rightsizing' | 'scheduling' | 'reserved-instances' | 'storage-optimization';
  title: string;
  description: string;
  potentialSavings: number;
  effort: 'low' | 'medium' | 'high';
  resources: string[];
  priority: number;
}

export interface TrendData {
  date: string;
  aws: number;
  azure: number;
  total: number;
}

export interface UserRole {
  type: 'admin' | 'executive';
  name: string;
}