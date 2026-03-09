import { UserRole } from 'src/Common/Types/Types';
import { Lead } from 'src/DB/Models/lead.model';
import { User } from 'src/DB/Models/user.model';
import { CreateLeadDTO } from '../DTO/lead.dto';

export interface ILeadStrategy {
  role: UserRole;
  createLead(data: CreateLeadDTO, user: User): Promise<Lead>;
  getLeads(user: User): Promise<Lead[]>;
  getLeadById(id: string, user: User): Promise<Lead>;
  getLeadByEmail(email: string, user: User): Promise<Lead>;
  getLeadByPhone(phone: string, user: User): Promise<Lead>;
  updateLead(lead: Lead, data: any, user: User): Promise<Lead>;
  deleteLead(lead: Lead, user: User): Promise<void>;
  assignLead(lead: Lead, user: User): Promise<Lead>;
  updateLeadStatus(lead: Lead, status: string): Promise<Lead>;
}
