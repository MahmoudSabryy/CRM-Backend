import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from 'src/DB/Module/database.module';
import { AuthModule } from 'src/Auth/auth.module';
import { UserModule } from 'src/User/user.module';
import { LeadModule } from 'src/Lead/lead.module';
import { ContactModule } from 'src/Contact/contact.module';
import { DealModule } from 'src/Deal/deal.module';
import { ActivityModule } from 'src/Activity/activity.module';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    UserModule,
    LeadModule,
    ContactModule,
    DealModule,
    ActivityModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
