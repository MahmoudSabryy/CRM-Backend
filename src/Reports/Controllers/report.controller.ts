import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { ReportService } from '../Services/report.service';
import { IAuthUser, UserRole } from 'src/Common/Types/Types';
import express from 'express';
import { AuthGuard } from 'src/Common/Guards/Auth.Guard';
import { RoleGuard } from 'src/Common/Guards/Role.Guard';
import { Roles } from 'src/Common/Decorators/roles.decorator';
@Controller('report')
export class ReportController {
  constructor(private readonly _ReportService: ReportService) {}

  @Get('dashboard')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles([`${UserRole.Admin}`, `${UserRole.Manager}`, `${UserRole.SalesRep}`])
  async getDashboardReports(
    @Req() req: express.Request,
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('userId') userId?: string,
  ) {
    const authUser: IAuthUser = req['authUser'];

    return this._ReportService.getDashboardReports(authUser, {
      from,
      to,
      userId,
    });
  }
}
