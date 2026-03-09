import { Injectable, NotFoundException } from '@nestjs/common';
import { IContactStrategy } from './contact.strategy.interface';
import { Contact } from 'src/DB/Models/contact.model';
import { User } from 'src/DB/Models/user.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  ConvertLeadToContactDTO,
  CreateContactDTO,
  UpdateContactDTO,
} from '../DTO/contact.dto';
import { Lead } from 'src/DB/Models/lead.model';
import { UserRole } from 'src/Common/Types/Types';

@Injectable()
export class ContactAdminStrategy implements IContactStrategy {
  constructor(
    @InjectRepository(Contact)
    private readonly _ContactRepo: Repository<Contact>,
  ) {}

  role: UserRole = UserRole.Admin;

  async getAllContacts(user: User): Promise<Contact[]> {
    return await this._ContactRepo.find({
      relations: { activities: true, owner: true, deals: true, lead: true },
    });
  }

  async getContactById(id: string, user: User): Promise<Contact> {
    const contact = await this._ContactRepo.findOne({
      where: { id },
      relations: { activities: true, owner: true, deals: true, lead: true },
    });

    if (!contact) throw new NotFoundException('Contact Not Found');
    return contact;
  }

  async getContactByEmail(email: string, user: User): Promise<Contact> {
    const contact = await this._ContactRepo.findOne({
      where: { email },
      relations: { activities: true, owner: true, deals: true, lead: true },
    });

    if (!contact) throw new NotFoundException('Contact Not Found');
    return contact;
  }

  async getContactByPhone(phone: string, user: User): Promise<Contact> {
    const contact = await this._ContactRepo.findOne({
      where: { phone },
      relations: { activities: true, owner: true, deals: true, lead: true },
    });

    if (!contact) throw new NotFoundException('Contact Not Found');
    return contact;
  }

  async createContact(data: CreateContactDTO, user: User): Promise<Contact> {
    const contact = new Contact();
    Object.assign(contact, data);
    contact.owner = user;
    return contact;
  }

  async updateContact(
    contact: Contact,
    data: UpdateContactDTO,
    user: User,
  ): Promise<Contact> {
    Object.assign(contact, data);
    contact.updatedBy = user;
    contact.updatedAt = new Date();
    return contact;
  }

  async deleteContact(contact: Contact, user: User): Promise<void> {
    contact.deletedBy = user;
    contact.deletedAt = new Date();
  }
}
