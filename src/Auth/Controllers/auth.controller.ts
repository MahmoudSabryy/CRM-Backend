import {
  Body,
  Controller,
  Post,
  Req,
  Res,
  ValidationPipe,
} from '@nestjs/common';

import express from 'express';
import { CreateUserDTO, LoginUserDTO } from 'src/Auth/DTO/auth.dto';
import { AuthService } from '../Services/auth.service';
@Controller('auth')
export class AuthController {
  constructor(private readonly _AuthService: AuthService) {}

  @Post('register')
  async createUserHandler(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    body: CreateUserDTO,
    @Req() req: express.Request,
    @Res() res: express.Response,
  ) {
    const results = await this._AuthService.RegisterService(body);

    return res.status(201).json({
      success: true,
      message: 'User Created Successfully',
      data: results,
    });
  }

  @Post('login')
  async loginHandler(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    body: LoginUserDTO,
    @Req() req: express.Request,
    @Res() res: express.Response,
  ) {
    const results = await this._AuthService.loginService(body);

    return res.status(200).json({
      success: true,
      message: 'Logged in Successfully',
      token: results,
    });
  }
}
