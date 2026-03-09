import { Module } from '@nestjs/common';
import { ContactController } from './Controllers/contact.controller';
import { ContactService } from './Services/contact.service';
import { TokenService } from 'src/Common/Services/token.service';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/DB/Models/user.model';
import { Lead } from 'src/DB/Models/lead.model';
import { Contact } from 'src/DB/Models/contact.model';
import { ContactAdminStrategy } from './Strategies/contact-admin.strategy';
import { ContactSalestrategy } from './Strategies/contact-sales.strategy';
import { ContactStrategyFactory } from './Strategies/contact-strategy.factory';
import { LeadModule } from 'src/Lead/lead.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, Lead, Contact]), LeadModule],
  controllers: [ContactController],
  providers: [
    ContactService,
    TokenService,
    JwtService,
    ContactAdminStrategy,
    ContactSalestrategy,
    {
      provide: 'CONTACT_STRATEGIES',
      useFactory: (admin: ContactAdminStrategy, sales: ContactSalestrategy) => [
        admin,
        sales,
      ],
      inject: [ContactAdminStrategy, ContactSalestrategy],
    },

    {
      provide: ContactStrategyFactory,
      useFactory: (straregies) => new ContactStrategyFactory(straregies),
      inject: ['CONTACT_STRATEGIES'],
    },
  ],
})
export class ContactModule {}
