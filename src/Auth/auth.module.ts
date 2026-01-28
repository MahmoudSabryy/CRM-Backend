import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/DB/Models/user.model';
import { AuthController } from './Controllers/auth.controller';
import { AuthService } from './Services/auth.service';
import { TokenService } from 'src/Common/Services/token.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [AuthController],
  providers: [AuthService, TokenService, JwtService],
})
export class AuthModule {}
