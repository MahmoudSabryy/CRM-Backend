import { Module } from '@nestjs/common';
import { ContactController } from './Controllers/contact.controller';
import { ContactService } from './Services/contact.service';
import { TokenService } from 'src/Common/Services/token.service';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/DB/Models/user.model';
import { Lead } from 'src/DB/Models/lead.model';
import { Contact } from 'src/DB/Models/contact.model';
import { LeadService } from 'src/Lead/Services/lead.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Lead, Contact])],
  controllers: [ContactController],
  providers: [ContactService, TokenService, JwtService, LeadService],
})
export class ContactModule {}
