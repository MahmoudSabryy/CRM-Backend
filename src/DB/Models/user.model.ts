import { UserRole } from 'src/Common/Types/Types';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Lead } from './lead.model';
import { Activity } from './activity.model';
import { Contact } from './contact.model';
import { Deal } from './deal.model';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 25, nullable: false })
  name: string;

  @Index()
  @Column({ type: 'varchar', length: 40, nullable: false, unique: true })
  email: string;

  @Column({ type: 'varchar', nullable: false })
  password: string;

  @Index()
  @Column({ type: 'varchar', nullable: false, unique: true })
  phone: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.SalesRep })
  role: UserRole;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @DeleteDateColumn()
  deletedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'text', nullable: true })
  address: string;

  /* one user to many leads */
  @OneToMany(() => Lead, (lead) => lead.owner)
  leads: Lead[];

  /* one user to many contacts */
  @OneToMany(() => Contact, (contact) => contact.owner)
  contacts: Contact[];

  /* one user to many activities */
  @OneToMany(() => Activity, (activity) => activity.user)
  activities: Activity[];

  /* one user to many deals */
  @OneToMany(() => Deal, (deal) => deal.owner)
  ownedDeals: Deal[];

  @OneToMany(() => Deal, (deal) => deal.createdBy)
  createdDeals: Deal[];

  @OneToMany(() => Activity, (activity) => activity.deletedBy)
  deletedActivities: Activity[];

  @OneToMany(() => Lead, (lead) => lead.deletedBy)
  deletedLead: Lead;
}
