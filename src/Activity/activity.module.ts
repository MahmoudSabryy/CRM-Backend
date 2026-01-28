import { Module } from '@nestjs/common';
import { ActivityController } from './Controllers/activity.controller';
import { ActivityService } from './Services/activity.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Activity } from 'src/DB/Models/activity.model';
import { TokenService } from 'src/Common/Services/token.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/DB/Models/user.model';
import { LeadService } from 'src/Lead/Services/lead.service';
import { Lead } from 'src/DB/Models/lead.model';
import { ContactService } from 'src/Contact/Services/contact.service';
import { Contact } from 'src/DB/Models/contact.model';
import { DealService } from 'src/Deal/Services/deal.service';
import { Deal } from 'src/DB/Models/deal.model';

@Module({
  imports: [TypeOrmModule.forFeature([Activity, User, Lead, Contact, Deal])],
  controllers: [ActivityController],
  providers: [
    ActivityService,
    TokenService,
    JwtService,
    LeadService,
    ContactService,
    DealService,
  ],
})
export class ActivityModule {}
