import { Module } from '@nestjs/common';
import { DashboardService } from './Services/dashboard.service';
import { DashboardController } from './Controllers/dashboard.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/DB/Models/user.model';
import { Lead } from 'src/DB/Models/lead.model';
import { Contact } from 'src/DB/Models/contact.model';
import { Deal } from 'src/DB/Models/deal.model';
import { Activity } from 'src/DB/Models/activity.model';
import { TokenService } from 'src/Common/Services/token.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([User, Lead, Contact, Deal, Activity])],
  controllers: [DashboardController],
  providers: [DashboardService, TokenService, JwtService],
})
export class DashboardModule {}
