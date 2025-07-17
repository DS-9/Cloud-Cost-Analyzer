import { 
  CostData, 
  CloudResource, 
  OptimizationRecommendation, 
  CostSummary, 
  TrendData,
  PlatformCosts 
} from '../types';

class MockDataService {
  private generateRandomCost(min: number = 50, max: number = 5000): number {
    return Math.floor(Math.random() * (max - min) + min);
  }

  private generateDateRange(daysAgo: number = 30): { start: Date; end: Date } {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - daysAgo);
    return { start, end };
  }

  generateAWSCostData(): CostData[] {
    const awsServices = [
      'EC2', 'S3', 'RDS', 'Lambda', 'CloudFront', 'ELB', 'VPC', 'Route53'
    ];
    
    return awsServices.map((service, index) => ({
      id: `aws-${index + 1}`,
      platform: 'aws' as const,
      resourceType: service,
      resourceName: `${service}-prod-${index + 1}`,
      cost: this.generateRandomCost(),
      currency: 'USD',
      period: this.generateDateRange(),
      tags: {
        environment: 'production',
        team: index % 2 === 0 ? 'backend' : 'frontend',
        project: 'cloud-cost-analyzer'
      }
    }));
  }

  generateAzureCostData(): CostData[] {
    const azureServices = [
      'Virtual Machines', 'Storage Account', 'SQL Database', 'App Service', 
      'CDN', 'Load Balancer', 'Virtual Network', 'DNS Zone'
    ];
    
    return azureServices.map((service, index) => ({
      id: `azure-${index + 1}`,
      platform: 'azure' as const,
      resourceType: service,
      resourceName: `${service.replace(' ', '-').toLowerCase()}-prod-${index + 1}`,
      cost: this.generateRandomCost(),
      currency: 'USD',
      period: this.generateDateRange(),
      tags: {
        environment: 'production',
        team: index % 2 === 0 ? 'devops' : 'data',
        project: 'cloud-cost-analyzer'
      }
    }));
  }

  generateCloudResources(): CloudResource[] {
    const awsResources = this.generateAWSCostData().map(cost => ({
      id: cost.id,
      name: cost.resourceName,
      type: cost.resourceType,
      platform: cost.platform,
      region: 'us-east-1',
      status: Math.random() > 0.8 ? 'stopped' : 'running' as const,
      utilization: Math.floor(Math.random() * 100),
      cost: cost.cost,
      lastUpdated: new Date()
    }));

    const azureResources = this.generateAzureCostData().map(cost => ({
      id: cost.id,
      name: cost.resourceName,
      type: cost.resourceType,
      platform: cost.platform,
      region: 'East US',
      status: Math.random() > 0.8 ? 'stopped' : 'running' as const,
      utilization: Math.floor(Math.random() * 100),
      cost: cost.cost,
      lastUpdated: new Date()
    }));

    return [...awsResources, ...azureResources];
  }

  generateOptimizationRecommendations(): OptimizationRecommendation[] {
    return [
      {
        id: 'opt-1',
        type: 'rightsizing',
        title: 'Rightsize EC2 instances',
        description: 'Several EC2 instances are running at low utilization. Consider downsizing to save costs.',
        potentialSavings: 1200,
        effort: 'medium',
        resources: ['aws-1', 'aws-2'],
        priority: 1
      },
      {
        id: 'opt-2',
        type: 'scheduling',
        title: 'Schedule non-production resources',
        description: 'Development and staging environments can be scheduled to run only during business hours.',
        potentialSavings: 800,
        effort: 'low',
        resources: ['azure-1', 'azure-3'],
        priority: 2
      },
      {
        id: 'opt-3',
        type: 'reserved-instances',
        title: 'Purchase Reserved Instances',
        description: 'High-utilization resources would benefit from Reserved Instance pricing.',
        potentialSavings: 2500,
        effort: 'low',
        resources: ['aws-3', 'aws-4', 'azure-2'],
        priority: 1
      },
      {
        id: 'opt-4',
        type: 'storage-optimization',
        title: 'Optimize storage classes',
        description: 'Move infrequently accessed data to cheaper storage tiers.',
        potentialSavings: 600,
        effort: 'medium',
        resources: ['aws-2', 'azure-1'],
        priority: 3
      }
    ];
  }

  generateTrendData(): TrendData[] {
    const trends: TrendData[] = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      const awsCost = this.generateRandomCost(800, 1500);
      const azureCost = this.generateRandomCost(600, 1200);
      
      trends.push({
        date: date.toISOString().split('T')[0],
        aws: awsCost,
        azure: azureCost,
        total: awsCost + azureCost
      });
    }
    
    return trends;
  }

  getCostSummary(): CostSummary {
    const awsCosts = this.generateAWSCostData();
    const azureCosts = this.generateAzureCostData();
    const allCosts = [...awsCosts, ...azureCosts];
    
    const awsTotal = awsCosts.reduce((sum, cost) => sum + cost.cost, 0);
    const azureTotal = azureCosts.reduce((sum, cost) => sum + cost.cost, 0);
    const totalCost = awsTotal + azureTotal;
    
    const platformBreakdown: PlatformCosts = {
      aws: awsTotal,
      azure: azureTotal,
      total: totalCost
    };
    
    // Sort by cost and get top 5 cost drivers
    const topCostDrivers = allCosts
      .sort((a, b) => b.cost - a.cost)
      .slice(0, 5);
    
    return {
      totalCost,
      monthlyTrend: Math.random() > 0.5 ? 5.2 : -3.1, // Random trend percentage
      topCostDrivers,
      platformBreakdown
    };
  }

  // Utility methods for data transformation
  transformForChart(data: CostData[]): Array<{ name: string; value: number; platform: string }> {
    return data.map(item => ({
      name: item.resourceName,
      value: item.cost,
      platform: item.platform
    }));
  }

  aggregateByPlatform(data: CostData[]): Array<{ platform: string; cost: number }> {
    const aggregated = data.reduce((acc, item) => {
      acc[item.platform] = (acc[item.platform] || 0) + item.cost;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(aggregated).map(([platform, cost]) => ({
      platform: platform.toUpperCase(),
      cost
    }));
  }
}

export const mockDataService = new MockDataService();