import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Activity } from 'src/DB/Models/activity.model';
import { TokenService } from 'src/Common/Services/token.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/DB/Models/user.model';
import { Lead } from 'src/DB/Models/lead.model';
import { Contact } from 'src/DB/Models/contact.model';
import { Deal } from 'src/DB/Models/deal.model';
import { ReportController } from './Controllers/report.controller';
import { ReportService } from './Services/report.service';

@Module({
  imports: [TypeOrmModule.forFeature([Activity, User, Lead, Contact, Deal])],
  controllers: [ReportController],
  providers: [ReportService, TokenService, JwtService],
})
export class ReportModule {}
