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
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.model';
import { Deal } from './deal.model';
import { Lead } from './lead.model';
import { Activity } from './activity.model';

@Entity('contacts')
export class Contact {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 25, nullable: false })
  name: string;

  @Index()
  @Column({ type: 'varchar', length: 50, nullable: false })
  email: string;

  @Index()
  @Column({ type: 'varchar', nullable: false })
  phone: string;

  @Column({ type: 'varchar' })
  company: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => User, (user) => user.id)
  updatedBy: User;

  @ManyToOne(() => User, (user) => user.deletedContact, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'deletedById' })
  deletedBy: User;

  @ManyToOne(() => User, (user) => user.contacts)
  owner: User;

  @OneToMany(() => Deal, (deal) => deal.contact)
  deals: Deal[];

  @OneToOne(() => Lead, (lead) => lead.contact, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'leadId' })
  lead: Lead;

  @OneToMany(() => Activity, (activity) => activity.contact)
  activities: Activity[];
}
