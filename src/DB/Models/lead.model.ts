import { LeadSource, LeadStatus } from 'src/Common/Types/Types';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.model';
import { Activity } from './activity.model';
import { Contact } from './contact.model';

@Entity('leads')
export class Lead {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Index()
  @Column({ length: 100 })
  email: string;

  @Index()
  @Column({ length: 20 })
  phone: string;

  @Column({
    type: 'enum',
    enum: LeadSource,
  })
  source: LeadSource;

  @Column({
    type: 'enum',
    enum: LeadStatus,
    default: LeadStatus.New,
  })
  status: LeadStatus;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @ManyToOne(() => User, (user) => user.deletedLead, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'deletedById' })
  deletedBy: User;

  /* many deals to one user */
  @ManyToOne(() => User, (user) => user.leads, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'ownerId' })
  owner: User;

  @OneToMany(() => Activity, (activity) => activity.lead)
  activities: Activity[];

  @OneToOne(() => Contact, (contact) => contact.lead)
  contact: Contact;
}
