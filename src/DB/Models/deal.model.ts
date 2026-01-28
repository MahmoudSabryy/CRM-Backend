import { DealStatus, StageType } from 'src/Common/Types/Types';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Contact } from './contact.model';
import { Activity } from './activity.model';
import { User } from './user.model';

@Entity('deals')
export class Deal {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 60, nullable: false })
  title: string;

  @Column({ type: 'float', nullable: false })
  amount: number;

  @Column({ type: 'enum', enum: StageType, default: StageType.Prospecting })
  stage: StageType;

  @Column({ type: 'enum', enum: DealStatus, default: DealStatus.Open })
  status: DealStatus;

  @Column({ type: 'date' })
  expectedCloseDate: Date;

  @Column({ type: 'float' })
  probability: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.createdDeals)
  createdBy: User;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Contact, (contact) => contact.deals, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'contactId' })
  contact: Contact;

  @OneToMany(() => Activity, (activity) => activity.deal, {
    onDelete: 'CASCADE',
  })
  activities: Activity[];

  @ManyToOne(() => User, (user) => user.ownedDeals, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'userId' })
  owner: User;
}
