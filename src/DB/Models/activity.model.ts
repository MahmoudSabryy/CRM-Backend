import { ActivityType } from 'src/Common/Types/Types';
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.model';
import { Lead } from './lead.model';
import { Deal } from './deal.model';
import { Contact } from './contact.model';

@Entity('activities')
export class Activity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: ActivityType, default: ActivityType.Call })
  type: ActivityType;

  @Column({ type: 'varchar', nullable: true })
  note: string;

  @Column({ type: 'date', nullable: false })
  activityDate: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => User, (user) => user.deletedActivities, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'deletedById' })
  deletedBy?: User;

  @ManyToOne(() => User, (user) => user.activities, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Lead, (lead) => lead.activities, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'leadId' })
  lead: Lead;

  @ManyToOne(() => Deal, (deal) => deal.activities, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'dealId' })
  deal: Deal;

  @ManyToOne(() => Contact, (contact) => contact.activities, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'contactId' })
  contact: Contact;
}
