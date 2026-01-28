import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { UserService } from '../Services/user.service';
import express from 'express';
import { AuthGuard } from 'src/Common/Guards/Auth.Guard';
@Controller('user')
export class UserController {
  constructor(private readonly _UserService: UserService) {}

  @Get('profile')
  @UseGuards(AuthGuard)
  async getUserProfileHandler(
    @Req() req: express.Request,
    @Res() res: express.Response,
  ) {
    const authUser = req['authUser'];
    const results = await this._UserService.getUserProfileService(authUser);

    return res
      .status(200)
      .json({ success: true, message: 'User Profile :', data: results });
  }
}
