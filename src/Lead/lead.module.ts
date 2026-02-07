import { Module } from '@nestjs/common';
import { LeadController } from './Controllers/lead.controller';
import { LeadService } from './Services/lead.service';
import { TokenService } from 'src/Common/Services/token.service';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/DB/Models/user.model';
import { Lead } from 'src/DB/Models/lead.model';
import { Contact } from 'src/DB/Models/contact.model';

@Module({
  imports: [TypeOrmModule.forFeature([User, Lead, Contact])],
  controllers: [LeadController],
  providers: [LeadService, TokenService, JwtService],
})
export class LeadModule {}
