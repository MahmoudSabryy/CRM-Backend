import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  assignLeadDTO,
  CreateLeadDTO,
  UpdateLeadDTO,
  updateLeadStatusDTO,
} from '../DTO/lead.dto';
import { IAuthUser, UserRole } from 'src/Common/Types/Types';
import { InjectRepository } from '@nestjs/typeorm';
import { Lead } from 'src/DB/Models/lead.model';
import { Not, Repository } from 'typeorm';
import { User } from 'src/DB/Models/user.model';
import { Contact } from 'src/DB/Models/contact.model';
import { LeadStrategyFactory } from '../Strategies/lead-strategy.factory';
import { ILeadStrategy } from '../Strategies/lead.strategy.interface';

@Injectable()
export class LeadService {
  constructor(
    @InjectRepository(Lead) private readonly _LeadRepo: Repository<Lead>,

    @InjectRepository(User) private readonly _UserRepo: Repository<User>,

    @InjectRepository(Contact)
    private readonly _ContactRepo: Repository<Contact>,

    private readonly _LeadStrategyFactory: LeadStrategyFactory,
  ) {}

  async createLeadService(
    body: CreateLeadDTO,
    authUser: IAuthUser,
  ): Promise<Lead> {
    const { email, phone } = body;

    const leadExist = await this._LeadRepo.findOne({
      where: [{ email: email }, { phone: phone }],
    });

    if (leadExist) throw new ConflictException('lead already exist');

    const contactExist = await this._ContactRepo.findOne({
      where: [{ email: email }, { phone: phone }],
    });

    if (contactExist)
      throw new ConflictException(
        'There is a contact with the same email or phone',
      );

    const strategy: ILeadStrategy = this._LeadStrategyFactory.getStrategy(
      authUser.role,
    );

    const lead = await strategy.createLead(body, authUser as User);

    return await this._LeadRepo.save(lead);
  }

  async getAllLeadsService(authUser: IAuthUser): Promise<Lead[]> {
    const strategy: ILeadStrategy = this._LeadStrategyFactory.getStrategy(
      authUser.role,
    );

    return await strategy.getLeads(authUser as User);
  }

  async getSingleLeadService(
    authUser: IAuthUser,
    leadId: string,
  ): Promise<Lead> {
    const strategy: ILeadStrategy = this._LeadStrategyFactory.getStrategy(
      authUser.role,
    );

    return await strategy.getLeadById(leadId, authUser as User);
  }

  async updateLeadService(
    authUser: IAuthUser,
    leadId: string,
    body: UpdateLeadDTO,
  ): Promise<Lead> {
    const { email, name, phone, source } = body;

    if (!email && !name && !phone && !source) {
      throw new BadRequestException(
        'At least one field must be provided for update',
      );
    }

    const strategy = this._LeadStrategyFactory.getStrategy(authUser.role);

    const lead = await strategy.getLeadById(leadId, authUser as User);

    if (email) {
      if (email.toLowerCase() === lead.email.toLowerCase()) {
        throw new BadRequestException('Lead already has this email');
      }
      if (await this._ContactRepo.findOne({ where: { email } })) {
        throw new ConflictException('There is a contact with the same email');
      }
      lead.email = email;
    }

    if (phone) {
      if (phone === lead.phone) {
        throw new BadRequestException('Lead already has this phone');
      }
      if (await this._ContactRepo.findOne({ where: { phone } })) {
        throw new ConflictException('There is a contact with the same phone');
      }
      lead.phone = phone;
    }

    if (name) {
      if (name.toLowerCase() === lead.name.toLowerCase()) {
        throw new BadRequestException('Lead already has this name');
      }
      lead.name = name;
    }

    if (source) {
      if (source === lead.source) {
        throw new BadRequestException('Lead already has this source');
      }
      lead.source = source;
    }

    await strategy.updateLead(lead, body, authUser as User);

    return await this._LeadRepo.save(lead);
  }

  async assignLeadService(
    body: assignLeadDTO,
    leadId: string,
    authUser: IAuthUser,
  ): Promise<Lead> {
    const { owner } = body;

    const strategy = this._LeadStrategyFactory.getStrategy(authUser.role);

    const lead = await strategy.getLeadById(leadId, authUser as User);

    const newOwner = await this._UserRepo.findOne({
      where: { id: owner, role: UserRole.SalesRep },
    });
    if (!newOwner) throw new NotFoundException('New owner not found');

    await strategy.assignLead(lead, newOwner);

    return await this._LeadRepo.save(lead);
  }

  async updateStatusService(
    authUser: IAuthUser,
    leadId: string,
    body: updateLeadStatusDTO,
  ): Promise<Lead> {
    const { status } = body;

    const strategy = this._LeadStrategyFactory.getStrategy(authUser.role);

    const lead = await strategy.getLeadById(leadId, authUser as User);

    if (lead.status === status) {
      throw new BadRequestException(`Lead already has status ${status}`);
    }

    await strategy.updateLeadStatus(lead, status);

    return await this._LeadRepo.save(lead);
  }

  async softDeleteLeadService(
    leadId: string,
    authUser: IAuthUser,
  ): Promise<Lead> {
    const strategy = this._LeadStrategyFactory.getStrategy(authUser.role);

    const lead = await strategy.getLeadById(leadId, authUser as User);

    await strategy.deleteLead(lead, authUser as User);

    return await this._LeadRepo.save(lead);
  }
}
