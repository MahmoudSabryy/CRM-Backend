import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IAuthUser } from 'src/Common/Types/Types';
import { Activity } from 'src/DB/Models/activity.model';
import { Deal } from 'src/DB/Models/deal.model';
import { Lead } from 'src/DB/Models/lead.model';
import { Repository } from 'typeorm';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(Deal) private readonly _DealRepo: Repository<Deal>,
    @InjectRepository(Activity)
    private readonly _ActivityRepo: Repository<Activity>,
    @InjectRepository(Lead) private readonly _LeadRepo: Repository<Lead>,
  ) {}

  async getDashboardReports(
    authUser: IAuthUser,
    filters: { from?: string; to?: string; userId?: string },
  ) {
    const { from, to, userId } = filters;

    /* ================== BASE CONDITION ================== */

    const dealQB = this._DealRepo
      .createQueryBuilder('deal')
      .leftJoin('deal.owner', 'owner');

    const activityQB = this._ActivityRepo
      .createQueryBuilder('activity')
      .leftJoin('activity.user', 'user');

    const leadQB = this._LeadRepo
      .createQueryBuilder('lead')
      .leftJoin('lead.owner', 'owner');

    /* ================= ROLE FILTER ================= */

    /* ================= ROLE FILTER ================= */

    if (authUser.role !== 'admin') {
      dealQB.andWhere('owner.id = :id', { id: authUser.id });
      activityQB.andWhere('user.id = :id', { id: authUser.id });
      leadQB.andWhere('owner.id = :id', { id: authUser.id });
    } else if (userId && userId !== 'all') {
      dealQB.andWhere('owner.id = :userId', { userId });
      activityQB.andWhere('user.id = :userId', { userId });
      leadQB.andWhere('owner.id = :userId', { userId });
    }

    if (from) {
      dealQB.andWhere('deal.createdAt >= :from', { from });
      activityQB.andWhere('activity.createdAt >= :from', { from });
      leadQB.andWhere('lead.createdAt >= :from', { from });
    }

    if (to) {
      dealQB.andWhere('deal.createdAt <= :to', { to });
      activityQB.andWhere('activity.createdAt <= :to', { to });
      leadQB.andWhere('lead.createdAt <= :to', { to });
    }

    /* ================= SALES SUMMARY ================= */

    const salesSummary = await dealQB
      .select([
        `COUNT(deal.id) as totalDeals`,
        `SUM(CASE WHEN deal.status = 'closed' AND deal.stage = 'won' THEN deal.amount ELSE 0 END) as totalRevenue`,
        `SUM(CASE WHEN deal.status = 'closed' AND deal.stage = 'lost' THEN deal.amount ELSE 0 END) as lostRevenue`,
        `SUM(CASE WHEN deal.status = 'open' THEN deal.amount ELSE 0 END) as openPipeline`,
        `AVG(deal.amount) as avgDealSize`,
      ])
      .getRawOne();

    /* ================= PIPELINE ================= */

    const pipelineSummary = await dealQB
      .select([
        'deal.stage as stage',
        'COUNT(deal.id) as count',
        'SUM(deal.amount) as totalAmount',
      ])
      .groupBy('deal.stage')
      .getRawMany();

    /* ================= LEADS ================= */

    const leadsSummary = await leadQB
      .select([
        `COUNT(lead.id) as totalLeads`,
        `SUM(CASE WHEN lead.status = 'converted' THEN 1 ELSE 0 END) as convertedLeads`,
      ])
      .getRawOne();

    /* ================= ACTIVITIES ================= */

    const activitySummary = await activityQB
      .select([
        `COUNT(activity.id) as totalActivities`,
        `COUNT(CASE WHEN activity.type = 'call' THEN 1 END) as totalCalls`,
        `COUNT(CASE WHEN activity.type = 'meeting' THEN 1 END) as totalMeetings`,
        `COUNT(CASE WHEN activity.type = 'email' THEN 1 END) as totalEmails`,
      ])
      .getRawOne();

    /* ================= PERFORMANCE ================= */

    const performanceSummary = await this._DealRepo
      .createQueryBuilder('deal')
      .leftJoin('deal.owner', 'owner')
      .select([
        'owner.name as name',
        `SUM(CASE WHEN deal.status = 'closed' AND deal.stage = 'won' THEN deal.amount ELSE 0 END) as revenue`,
        `COUNT(deal.id) as totalDeals`,
      ])
      .groupBy('owner.name')
      .getRawMany();

    /* ================= BUSINESS HEALTH ================= */

    const businessHealthSummary = await dealQB
      .select([
        `SUM(deal.amount * deal.probability / 100) as weightedForecast`,
        `COUNT(CASE WHEN deal.status = 'open' THEN 1 END) as activeDeals`,
        `COUNT(CASE WHEN deal.status = 'closed' THEN 1 END) as closedDeals`,
      ])
      .getRawOne();

    return {
      activitySummary,
      salesSummary,
      pipelineSummary,
      leadsSummary,
      performanceSummary,
      businessHealthSummary,
    };
  }
}
