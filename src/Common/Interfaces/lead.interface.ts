import { Lead } from 'src/DB/Models/lead.model';
import { User } from 'src/DB/Models/user.model';

export interface LeadProcessingStrategy {
  process(user: User, lead: Lead): Promise<User | Lead>;
}
