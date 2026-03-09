import { LeadStatus, UserRole } from 'src/Common/Types/Types';
import { ILeadStrategy } from './lead.strategy.interface';
import { Lead } from 'src/DB/Models/lead.model';
import { User } from 'src/DB/Models/user.model';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateLeadDTO } from '../DTO/lead.dto';

@Injectable()
export class LeadSalesStrategy implements ILeadStrategy {
  constructor(
    @InjectRepository(Lead) private readonly _LeadRepo: Repository<Lead>,
  ) {}

  role: UserRole = UserRole.SalesRep;

  async createLead(data: CreateLeadDTO, user: User): Promise<Lead> {
    const lead = new Lead();
    Object.assign(lead, data);
    lead.owner = user;
    return lead;
  }

  async getLeads(user: User): Promise<Lead[]> {
    return await this._LeadRepo.find({
      relations: { owner: true, contact: true, activities: true },
      where: { owner: { id: user.id }, status: Not(LeadStatus.Converted) },
    });
  }

  async getLeadById(id: string, user: User): Promise<Lead> {
    const lead = await this._LeadRepo.findOne({
      where: { id, owner: { id: user.id } },
      relations: { owner: true, contact: true, activities: true },
    });

    if (!lead) throw new NotFoundException('Lead not found');
    return lead;
  }

  async getLeadByEmail(email: string, user: User): Promise<Lead> {
    const lead = await this._LeadRepo.findOne({
      where: { email, owner: { id: user.id } },
      relations: { owner: true, contact: true, activities: true },
    });

    if (!lead) throw new NotFoundException('Lead not found');
    return lead;
  }

  async getLeadByPhone(phone: string, user: User): Promise<Lead> {
    const lead = await this._LeadRepo.findOne({
      where: { phone, owner: { id: user.id } },
      relations: { owner: true, contact: true, activities: true },
    });

    if (!lead) throw new NotFoundException('Lead not found');
    return lead;
  }

  async updateLead(lead: Lead, data: any, user: User): Promise<Lead> {
    if (!lead.owner || lead.owner.id !== user.id) {
      throw new ForbiddenException('You can only update leads assigned to you');
    }

    lead.status = data.status;
    return lead;
  }

  async deleteLead(): Promise<void> {
    throw new ForbiddenException(
      'Sales representatives are not allowed to delete leads',
    );
  }

  async assignLead(): Promise<Lead> {
    throw new ForbiddenException(
      'Sales representatives are not allowed to assign leads',
    );
  }

  async updateLeadStatus(lead: Lead, status: string): Promise<Lead> {
    lead.status = status as LeadStatus;

    return lead;
  }
}
