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
import { IAuthUser, LeadStatus, UserRole } from 'src/Common/Types/Types';
import { InjectRepository } from '@nestjs/typeorm';
import { Lead } from 'src/DB/Models/lead.model';
import { Not, Repository } from 'typeorm';
import { User } from 'src/DB/Models/user.model';
import { Contact } from 'src/DB/Models/contact.model';

@Injectable()
export class LeadService {
  constructor(
    @InjectRepository(Lead) private readonly _LeadRepo: Repository<Lead>,
    @InjectRepository(User) private readonly _UserRepo: Repository<User>,
    @InjectRepository(Contact)
    private readonly _ContactRepo: Repository<Contact>,
  ) {}

  async createLeadService(body: CreateLeadDTO, authUser: IAuthUser) {
    const { email, name, phone, source } = body;

    const lead = await this._LeadRepo.findOne({
      where: [{ email }, { phone }],
    });

    if (lead) throw new ConflictException('Lead already exist');

    const contact = await this._ContactRepo.findOne({
      where: [{ email }, { phone }],
    });
    if (contact)
      throw new ConflictException(
        'There is a contact with this email or phone',
      );

    const newLead = this._LeadRepo.create({
      email,
      name,
      phone,
      source,
      owner: { id: authUser.id },
    });

    return await this._LeadRepo.save(newLead);
  }

  async getAllLeadsService(authUser: IAuthUser) {
    const role = authUser.role;

    if (role === UserRole.Admin || role === UserRole.Manager) {
      return await this._LeadRepo.find({
        relations: { activities: true },
        where: { status: Not(LeadStatus.Converted) },
      });
    }
    if (role === UserRole.SalesRep) {
      return await this._LeadRepo.find({
        relations: { activities: true },
        where: {
          owner: { id: authUser.id },
          status: Not(LeadStatus.Converted),
        },
      });
    }
  }

  async getSingleLeadService(authUser: IAuthUser, leadId: string) {
    if (authUser.role === UserRole.SalesRep) {
      const lead = await this._LeadRepo.findOne({
        where: { id: leadId, owner: { id: authUser.id } },
        relations: { owner: true, contact: true },
      });

      if (!lead) throw new NotFoundException('lead not found');
      return lead;
    } else {
      const lead = await this._LeadRepo.findOne({
        where: { id: leadId },
        relations: { owner: true, contact: true },
      });

      if (!lead) throw new NotFoundException('lead not found');
      return lead;
    }
  }

  async updateLeadService(
    authUser: IAuthUser,
    leadId: string,
    body: UpdateLeadDTO,
  ) {
    const lead = await this.getSingleLeadService(authUser, leadId);

    const { email, name, phone, source } = body;

    if (!email && !name && !phone && !source)
      throw new BadRequestException('Nothing to update');

    if (email) {
      if (await this._LeadRepo.findOne({ where: { email } }))
        throw new ConflictException('email already exist');

      if (email.toLowerCase() === lead.email.toLowerCase())
        throw new BadRequestException("can't update lead with the same email");
      lead.email = email;
    }
    if (name) {
      if (name.toLowerCase() === lead.name.toLowerCase())
        throw new BadRequestException("can't update lead with the same name");
      lead.name = name;
    }
    if (phone) {
      if (await this._LeadRepo.findOne({ where: { phone } }))
        throw new ConflictException('phone number already exist');

      if (phone === lead.phone)
        throw new BadRequestException("can't update lead with the same phone");
      lead.phone = phone;
    }
    if (source) {
      if (source.toLowerCase() === lead.source)
        throw new BadRequestException("can't update lead with the same source");
      lead.source = source;
    }

    return await this._LeadRepo.save(lead);
  }

  async assignLeadService(
    body: assignLeadDTO,
    leadId: string,
    authUser: IAuthUser,
  ) {
    const { owner } = body;
    const lead = await this.getSingleLeadService(authUser, leadId);

    const user = await this._UserRepo.findOne({ where: { id: owner } });

    if (!user) {
      throw new NotFoundException('User not found');
    }
    lead.owner = user;

    return await this._LeadRepo.save(lead);
  }

  async updateStatusService(
    authUser: IAuthUser,
    leadId: string,
    body: updateLeadStatusDTO,
  ) {
    const lead = await this.getSingleLeadService(authUser, leadId);
    const { status } = body;

    if (lead.status === status)
      throw new BadRequestException('Lead already has this status');

    lead.status = status;

    return this._LeadRepo.save(lead);
  }

  async softDeleteLeadService(leadId: string, authUser: IAuthUser) {
    const lead = await this.getSingleLeadService(authUser, leadId);

    await this._LeadRepo.update(lead.id, {
      deletedBy: authUser as any,
    });

    return await this._LeadRepo.softDelete(lead.id);
  }
}
