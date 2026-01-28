import { Module } from '@nestjs/common';
import { DealService } from './Services/deal.service';
import { DealController } from './Controllers/deal.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Deal } from 'src/DB/Models/deal.model';
import { TokenService } from 'src/Common/Services/token.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/DB/Models/user.model';
import { Lead } from 'src/DB/Models/lead.model';
import { Contact } from 'src/DB/Models/contact.model';

@Module({
  imports: [TypeOrmModule.forFeature([Deal, User, Lead, Contact])],
  controllers: [DealController],
  providers: [DealService, TokenService, JwtService],
})
export class DealModule {}
