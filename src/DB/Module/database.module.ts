import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../Models/user.model';
import { Lead } from '../Models/lead.model';
import { Activity } from '../Models/activity.model';
import { Contact } from '../Models/contact.model';
import { Deal } from '../Models/deal.model';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      database: 'crm',
      port: 5432,
      username: 'postgres',
      password: '123456',
      entities: [User, Lead, Activity, Contact, Deal],
      synchronize: true, // هقفله وقت البرودكشن
    }),
  ],
  providers: [],
})
export class DatabaseModule {}
