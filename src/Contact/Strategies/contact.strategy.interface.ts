import { UserRole } from 'src/Common/Types/Types';
import { Contact } from 'src/DB/Models/contact.model';
import { User } from 'src/DB/Models/user.model';
import {
  ConvertLeadToContactDTO,
  CreateContactDTO,
  UpdateContactDTO,
} from '../DTO/contact.dto';
import { Lead } from 'src/DB/Models/lead.model';

export interface IContactStrategy {
  role: UserRole;
  getAllContacts(user: User): Promise<Contact[]>;
  getContactById(id: string, user: User): Promise<Contact>;
  getContactByEmail(email: string, user: User): Promise<Contact>;
  getContactByPhone(phone: string, user: User): Promise<Contact>;
  createContact(data: CreateContactDTO, user: User): Promise<Contact>;
  updateContact(
    contact: Contact,
    data: UpdateContactDTO,
    user: User,
  ): Promise<Contact>;

  deleteContact(contact: Contact, user: User): Promise<void>;
}
