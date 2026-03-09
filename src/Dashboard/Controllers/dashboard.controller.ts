import { Controller, Get, Query } from '@nestjs/common';
import { DashboardService } from '../Services/dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  /** KPI Cards */
  @Get('kpi')
  async getKpiStats() {
    const stats = await this.dashboardService.getDashboardKpiStatsService();
    return stats;
  }

  /** Deals Chart */
  @Get('deals-chart')
  async getDealsChart(@Query('range') range: '7d' | '30d' | '90d' = '7d') {
    const data = await this.dashboardService.getDealsChartsService(range);
    return data;
  }

  /** Activities Chart */
  @Get('activities-chart')
  async getActivitiesChart(@Query('range') range: '7d' | '30d' | '90d' = '7d') {
    const data = await this.dashboardService.getActivitiesChartsService(range);
    return data;
  }

  /** Recent Activities */
  @Get('recent-activities')
  async getRecentActivities(@Query('limit') limit: string) {
    const activities = await this.dashboardService.getRecentActivitiesService(
      Number(limit) || 5,
    );
    return activities;
  }
}
