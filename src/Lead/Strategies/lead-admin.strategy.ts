import { LeadStatus, UserRole } from 'src/Common/Types/Types';
import { ILeadStrategy } from './lead.strategy.interface';
import { Lead } from 'src/DB/Models/lead.model';
import { User } from 'src/DB/Models/user.model';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLeadDTO, UpdateLeadDTO } from '../DTO/lead.dto';

@Injectable()
export class LeadAdminStrategy implements ILeadStrategy {
  constructor(
    @InjectRepository(Lead) private readonly _LeadRepo: Repository<Lead>,
  ) {}
  role: UserRole = UserRole.Admin;

  async createLead(data: CreateLeadDTO, user: User): Promise<Lead> {
    const lead = new Lead();
    Object.assign(lead, data);
    lead.owner = user;
    return lead;
  }
  async getLeads(user: User): Promise<Lead[]> {
    return await this._LeadRepo.find({
      relations: { owner: true, contact: true, activities: true },
    });
  }

  async getLeadById(id: string, user: User): Promise<Lead> {
    const lead = await this._LeadRepo.findOne({
      where: { id },
      relations: { owner: true, contact: true, activities: true },
    });

    if (!lead) throw new NotFoundException('Lead not found');
    return lead;
  }

  async getLeadByEmail(email: string, user: User): Promise<Lead> {
    const lead = await this._LeadRepo.findOne({
      where: { email },
      relations: { owner: true, contact: true, activities: true },
    });

    if (!lead) throw new NotFoundException('Lead not found');
    return lead;
  }

  async getLeadByPhone(phone: string, user: User): Promise<Lead> {
    const lead = await this._LeadRepo.findOne({
      where: { phone },
      relations: { owner: true, contact: true, activities: true },
    });

    if (!lead) throw new NotFoundException('Lead not found');
    return lead;
  }

  async updateLead(lead: Lead, data: UpdateLeadDTO): Promise<Lead> {
    Object.assign(lead, data);
    return lead;
  }

  async deleteLead(lead: Lead, user: User): Promise<void> {
    lead.deletedAt = new Date();
    lead.deletedBy = user;
  }

  async assignLead(lead: Lead, user: User): Promise<Lead> {
    lead.owner = user;
    return lead;
  }

  async updateLeadStatus(lead: Lead, status: string): Promise<Lead> {
    lead.status = status as LeadStatus;
    return lead;
  }
}
