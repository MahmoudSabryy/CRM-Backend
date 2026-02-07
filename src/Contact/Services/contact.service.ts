import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IAuthUser, LeadStatus, UserRole } from 'src/Common/Types/Types';
import { Contact } from 'src/DB/Models/contact.model';
import { Lead } from 'src/DB/Models/lead.model';
import { LeadService } from 'src/Lead/Services/lead.service';
import { Repository } from 'typeorm';
import {
  ConvertLeadToContactDTO,
  CreateContactDTO,
  UpdateContactDTO,
} from '../DTO/contact.dto';
import { User } from 'src/DB/Models/user.model';

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(Lead) private readonly _LeadRepo: Repository<Lead>,
    @InjectRepository(Contact)
    private readonly _ContactRepo: Repository<Contact>,

    private readonly _LeadService: LeadService,
  ) {}

  async convertLeadTOContactService(
    body: ConvertLeadToContactDTO,
    leadId: string,
    authUser: IAuthUser,
  ) {
    const { company } = body;
    const lead = await this._LeadService.getSingleLeadService(authUser, leadId);
    if (lead.status !== LeadStatus.Qualified)
      throw new BadRequestException('Lead must be qualified before conversion');

    const contact = await this._ContactRepo.findOne({
      where: [
        { lead: { id: lead.id } },
        { phone: lead.phone },
        { email: lead.email },
      ],
    });

    if (contact) throw new ConflictException('contact already exist');

    return await this._LeadRepo.manager.transaction(async (manager) => {
      const contact = manager.create(Contact, {
        email: lead.email,
        name: lead.name,
        phone: lead.phone,
        lead: lead,
        company: company ?? 'Unknown',
        owner: authUser as any,
      });

      await manager.save(contact);
      lead.contact = contact;
      lead.status = LeadStatus.Converted;

      await manager.save(lead);

      return contact;
    });
  }

  async getSingleContactService(contactId: string, authUser: IAuthUser) {
    if (authUser.role === UserRole.SalesRep) {
      const contact = await this._ContactRepo.findOne({
        where: { id: contactId, owner: { id: authUser.id } },
      });

      if (!contact) throw new NotFoundException('contact not found');

      return contact;
    } else {
      const contact = await this._ContactRepo.findOne({
        where: { id: contactId },
      });

      if (!contact) throw new NotFoundException('contact not found');

      return contact;
    }
  }

  async getAllContactsService(authUser: IAuthUser) {
    if (authUser.role === UserRole.SalesRep) {
      return await this._ContactRepo.find({
        relations: { owner: true, activities: { user: true }, deals: true },
        where: { owner: { id: authUser.id } },
      });
    } else {
      return await this._ContactRepo.find({
        relations: { owner: true, activities: true, deals: true },
      });
    }
  }

  async createContactService(authUser: IAuthUser, body: CreateContactDTO) {
    const { name, email, phone, company } = body;

    const lead = await this._LeadRepo.findOne({
      where: [{ phone }, { email }],
    });

    if (lead) {
      return await this.convertLeadTOContactService(
        { company },
        lead.id,
        authUser,
      );
    }

    const contactExist = await this._ContactRepo.findOne({
      where: [{ phone }, { email }],
    });
    if (contactExist) throw new ConflictException('contact already exist');
    const contact = this._ContactRepo.create({
      name,
      email,
      phone,
      company,
      owner: authUser as User,
    });

    return await this._ContactRepo.save(contact);
  }

  async updateContactService(
    body: UpdateContactDTO,
    contactId: string,
    authUser: IAuthUser,
  ) {
    const { email, name, company, phone } = body;

    const contact = await this.getSingleContactService(contactId, authUser);

    if (email) {
      const emailMatch = email.toLowerCase() === contact.email.toLowerCase();
      const emailExist = await this._ContactRepo.findOne({ where: { email } });

      if (emailMatch || emailExist)
        throw new ConflictException('this email already exist');

      contact.email = email;
    }

    if (name) {
      if (name.toLowerCase() === contact.name.toLowerCase())
        throw new BadRequestException(
          "can't update the name with the same name",
        );

      contact.name = name;
    }

    if (phone) {
      const phoneMatch = phone === contact.phone;
      const phoneExist = await this._ContactRepo.findOne({ where: { phone } });

      if (phoneMatch || phoneExist)
        throw new BadRequestException('phone already exist');

      contact.phone = phone;
    }

    if (company) {
      if (company.toLowerCase() === contact.company.toLowerCase())
        throw new BadRequestException(
          "can't update the name of the company with the same name",
        );

      contact.company = company;
    }
    contact.updatedBy = authUser as any;
    return await this._ContactRepo.save(contact);
  }

  async getAllContactDealsService(contactId: string, authUser: IAuthUser) {
    const contact = await this._ContactRepo.findOne({
      relations: { deals: true },
      where: { id: contactId },
      select: { id: true, name: true, phone: true, deals: true },
    });

    if (!contact) throw new NotFoundException('contact not found');
    return contact;
  }

  async softDeleteContactService(contactId: string, authUser: IAuthUser) {
    const contact = await this.getSingleContactService(contactId, authUser);

    await this._ContactRepo.update(contact.id, { deletedBy: authUser as any });

    return await this._ContactRepo.softDelete(contact.id);
  }
}
