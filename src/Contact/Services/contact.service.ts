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
import { Repository } from 'typeorm';
import {
  ConvertLeadToContactDTO,
  CreateContactDTO,
  UpdateContactDTO,
} from '../DTO/contact.dto';
import { User } from 'src/DB/Models/user.model';
import { ContactStrategyFactory } from '../Strategies/contact-strategy.factory';
import { LeadStrategyFactory } from 'src/Lead/Strategies/lead-strategy.factory';

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(Lead) private readonly _LeadRepo: Repository<Lead>,
    @InjectRepository(Contact)
    private readonly _ContactRepo: Repository<Contact>,
    private readonly _ContactStrategyFactory: ContactStrategyFactory,
    private readonly _LeadStrategyFactory: LeadStrategyFactory,
  ) {}

  async convertLeadTOContactService(
    body: ConvertLeadToContactDTO,
    leadId: string,
    authUser: IAuthUser,
  ) {
    const { lead, company } = body;

    if (lead.status !== LeadStatus.Qualified)
      throw new BadRequestException('Lead must be qualified before conversion');

    const Contact = this._ContactRepo.create({
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      lead: lead as Lead,
      owner: authUser as User,
    });
    lead.status = LeadStatus.Converted;

    await this._LeadRepo.save(lead);

    return await this._ContactRepo.save(Contact);
  }

  async getSingleContactService(
    contactId: string,
    authUser: IAuthUser,
  ): Promise<Contact> {
    const strategy = this._ContactStrategyFactory.getStrategy(authUser.role);

    return await strategy.getContactById(contactId, authUser as User);
  }

  async getAllContactsService(authUser: IAuthUser): Promise<Contact[]> {
    const strategy = this._ContactStrategyFactory.getStrategy(authUser.role);

    return await strategy.getAllContacts(authUser as User);
  }

  async createContactService(authUser: IAuthUser, body: CreateContactDTO) {
    const { email, phone } = body;

    const leadStrategy = this._LeadStrategyFactory.getStrategy(authUser.role);
    const ContactStrategy = this._ContactStrategyFactory.getStrategy(
      authUser.role,
    );

    const lead = await this._LeadRepo.findOne({
      where: [{ email }, { phone }],
    });

    if (lead)
      throw new ConflictException(
        'There is a lead with the same email or phone',
      );

    const contactExist = await this._ContactRepo.findOne({
      where: [{ phone }, { email }],
    });

    if (contactExist)
      throw new ConflictException(
        'There is a contact with the same email or phone',
      );

    const contact = await ContactStrategy.createContact(body, authUser as User);

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

    contact.updatedAt = new Date();
    contact.updatedBy = authUser as User;

    return await this._ContactRepo.save(contact);
  }

  async softDeleteContactService(contactId: string, authUser: IAuthUser) {
    const contact = await this.getSingleContactService(contactId, authUser);

    const strategy = this._ContactStrategyFactory.getStrategy(authUser.role);

    await strategy.deleteContact(contact, authUser as User);

    return await this._ContactRepo.save(contact);
  }
}
