import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Activity } from 'src/DB/Models/activity.model';
import { Contact } from 'src/DB/Models/contact.model';
import { Deal } from 'src/DB/Models/deal.model';
import { Lead } from 'src/DB/Models/lead.model';
import { Repository } from 'typeorm';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Deal) private dealRepository: Repository<Deal>,
    @InjectRepository(Contact) private contactRepository: Repository<Contact>,
    @InjectRepository(Lead) private leadRepository: Repository<Lead>,
    @InjectRepository(Activity)
    private activityRepository: Repository<Activity>,
  ) {}

  async getDashboardKpiStatsService() {
    const totalDeals = await this.dealRepository.count();
    const totalContacts = await this.contactRepository.count();
    const totalLeads = await this.leadRepository.count();
    const totalActivities = await this.activityRepository.count();

    return {
      deals: totalDeals,
      leads: totalLeads,
      contacts: totalContacts,
      activities: totalActivities,
    };
  }

  async getDealsChartsService(range: '7d' | '30d' | '90d') {
    let startDate = new Date();
    if (range === '7d') {
      startDate.setDate(startDate.getDate() - 7);
    } else if (range === '30d') {
      startDate.setDate(startDate.getDate() - 30);
    } else startDate.setDate(startDate.getDate() - 90);

    const deals = await this.dealRepository
      .createQueryBuilder('deal')
      .select("Date_TRUNC('day', deal.createdAt)", 'day')
      .addSelect('COUNT(deal.id)', 'count')
      .where('deal.createdAt >= :startDate', { startDate })
      .groupBy('day')
      .orderBy('day', 'ASC')
      .getRawMany();

    return deals.map((d) => ({
      name: (d.day as Date).toLocaleDateString('en-CA'),
      count: Number(d.count),
    }));
  }

  async getActivitiesChartsService(range: '7d' | '30d' | '90d') {
    let startDate = new Date();
    if (range === '7d') {
      startDate.setDate(startDate.getDate() - 7);
    } else if (range === '30d') {
      startDate.setDate(startDate.getDate() - 30);
    } else startDate.setDate(startDate.getDate() - 90);

    const activities = await this.activityRepository
      .createQueryBuilder('activity')
      .select("Date_TRUNC('day', activity.createdAt)", 'day')
      .addSelect('COUNT(activity.id)', 'count')
      .where('activity.createdAt >= :startDate', { startDate })
      .groupBy('day')
      .orderBy('day', 'ASC')
      .getRawMany();

    return activities.map((d) => ({
      name: (d.day as Date).toLocaleDateString('en-CA'),
      count: Number(d.count),
    }));
  }

  async getRecentActivitiesService(limit: number = 5) {
    const activities = await this.activityRepository.find({
      relations: ['user'],
      order: { createdAt: 'DESC' },
      take: limit,
    });

    return activities.map((act) => ({
      id: act.id,
      type: act.type,
      note: act.note,
      createdAt: act.createdAt,
      userName: act.user?.name || 'Unknown',
    }));
  }
}
