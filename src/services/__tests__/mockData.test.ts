import { mockDataService } from '../mockData';

describe('MockDataService', () => {
  test('generates AWS cost data', () => {
    const awsData = mockDataService.generateAWSCostData();
    expect(awsData).toHaveLength(8);
    expect(awsData[0].platform).toBe('aws');
    expect(awsData[0].cost).toBeGreaterThan(0);
  });

  test('generates Azure cost data', () => {
    const azureData = mockDataService.generateAzureCostData();
    expect(azureData).toHaveLength(8);
    expect(azureData[0].platform).toBe('azure');
    expect(azureData[0].cost).toBeGreaterThan(0);
  });

  test('generates cloud resources', () => {
    const resources = mockDataService.generateCloudResources();
    expect(resources).toHaveLength(16); // 8 AWS + 8 Azure
    expect(resources.some(r => r.platform === 'aws')).toBe(true);
    expect(resources.some(r => r.platform === 'azure')).toBe(true);
  });

  test('generates optimization recommendations', () => {
    const recommendations = mockDataService.generateOptimizationRecommendations();
    expect(recommendations).toHaveLength(4);
    expect(recommendations[0].potentialSavings).toBeGreaterThan(0);
  });

  test('generates cost summary', () => {
    const summary = mockDataService.getCostSummary();
    expect(summary.totalCost).toBeGreaterThan(0);
    expect(summary.platformBreakdown.total).toBe(summary.totalCost);
    expect(summary.topCostDrivers).toHaveLength(5);
  });

  test('transforms data for charts', () => {
    const awsData = mockDataService.generateAWSCostData();
    const chartData = mockDataService.transformForChart(awsData);
    expect(chartData[0]).toHaveProperty('name');
    expect(chartData[0]).toHaveProperty('value');
    expect(chartData[0]).toHaveProperty('platform');
  });
});