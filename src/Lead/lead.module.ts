import { Module } from '@nestjs/common';
import { LeadController } from './Controllers/lead.controller';
import { LeadService } from './Services/lead.service';
import { TokenService } from 'src/Common/Services/token.service';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/DB/Models/user.model';
import { Lead } from 'src/DB/Models/lead.model';
import { Contact } from 'src/DB/Models/contact.model';
import { LeadSalesStrategy } from './Strategies/lead-sales.strategy';
import { LeadAdminStrategy } from './Strategies/lead-admin.strategy';
import { LeadStrategyFactory } from './Strategies/lead-strategy.factory';

@Module({
  imports: [TypeOrmModule.forFeature([User, Lead, Contact])],
  controllers: [LeadController],
  providers: [
    LeadService,
    TokenService,
    JwtService,

    // 👇 نسجل الاستراتيجيات
    LeadAdminStrategy,
    LeadSalesStrategy,

    // 👇 نجمعهم في array injection
    {
      provide: 'LEAD_STRATEGIES',
      useFactory: (admin: LeadAdminStrategy, sales: LeadSalesStrategy) => [
        admin,
        sales,
      ],
      inject: [LeadAdminStrategy, LeadSalesStrategy],
    },

    // 👇 نسجل الفاكتوري
    {
      provide: LeadStrategyFactory,
      useFactory: (strategies) => new LeadStrategyFactory(strategies),
      inject: ['LEAD_STRATEGIES'],
    },
  ],
  exports: [LeadStrategyFactory],
})
export class LeadModule {}
