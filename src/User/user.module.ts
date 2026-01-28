import { Module } from '@nestjs/common';
import { UserController } from './Controllers/user.controller';
import { UserService } from './Services/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/DB/Models/user.model';
import { TokenService } from 'src/Common/Services/token.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService, TokenService, JwtService],
})
export class UserModule {}
