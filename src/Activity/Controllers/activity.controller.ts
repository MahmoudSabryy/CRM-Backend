import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ActivityService } from '../Services/activity.service';
import { AuthGuard } from 'src/Common/Guards/Auth.Guard';
import { RoleGuard } from 'src/Common/Guards/Role.Guard';
import { Roles } from 'src/Common/Decorators/roles.decorator';
import { IAuthUser, UserRole } from 'src/Common/Types/Types';
import express from 'express';
import { CreateActivityDTO, UpdateActivityDTO } from '../DTO/activity.dto';
@Controller('activity')
export class ActivityController {
  constructor(private readonly _ActivityService: ActivityService) {}

  @Get('user')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles([`${UserRole.SalesRep}`])
  async getAllUserActivitiesHandler(
    @Req() req: express.Request,
    @Res() res: express.Response,
  ) {
    const authUser: IAuthUser = req['authUser'];

    const results =
      await this._ActivityService.getAllUserActivitiesService(authUser);

    return res
      .status(200)
      .json({ success: true, message: 'All Activities :', data: results });
  }

  @Get('single/:activityId')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles([`${UserRole.Admin}`, `${UserRole.Manager}`, `${UserRole.SalesRep}`])
  async getSingleActivityHandler(
    @Param('activityId') activityId: string,
    @Req() req: express.Request,
    @Res() res: express.Response,
  ) {
    const authUser: IAuthUser = req['authUser'];

    const results = await this._ActivityService.getSingleActivityService(
      activityId,
      authUser,
    );

    return res
      .status(200)
      .json({ success: true, message: 'Activity Found :', data: results });
  }

  @Post('lead/:leadId')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles([`${UserRole.Admin}`, `${UserRole.Manager}`, `${UserRole.SalesRep}`])
  async createLeadActivityHandler(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    body: CreateActivityDTO,
    @Param('leadId') leadId: string,
    @Req() req: express.Request,
    @Res() res: express.Response,
  ) {
    const authUser: IAuthUser = req['authUser'];

    const results = await this._ActivityService.createLeadActivityService(
      body,
      leadId,
      authUser,
    );

    return res.status(201).json({
      success: true,
      message: 'Activity created successully for this lead :',
      data: results,
    });
  }
  @Post('contact/:contactId')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles([`${UserRole.Admin}`, `${UserRole.Manager}`, `${UserRole.SalesRep}`])
  async createContactActivityHandler(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    body: CreateActivityDTO,
    @Param('contactId') contactId: string,
    @Req() req: express.Request,
    @Res() res: express.Response,
  ) {
    const authUser: IAuthUser = req['authUser'];

    const results = await this._ActivityService.createContactActivityService(
      body,
      contactId,
      authUser,
    );

    return res.status(201).json({
      success: true,
      message: 'Activity created successully for this Contact :',
      data: results,
    });
  }

  @Post('deal/:dealId')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles([`${UserRole.Admin}`, `${UserRole.Manager}`, `${UserRole.SalesRep}`])
  async createDealActivityHandler(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    body: CreateActivityDTO,
    @Param('dealId') dealId: string,
    @Req() req: express.Request,
    @Res() res: express.Response,
  ) {
    const authUser: IAuthUser = req['authUser'];

    const results = await this._ActivityService.createDealActivityService(
      body,
      dealId,
      authUser,
    );

    return res.status(201).json({
      success: true,
      message: 'Activity created successully for this Deal :',
      data: results,
    });
  }

  @Put('update/:activityId')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles([`${UserRole.Admin}`, `${UserRole.Manager}`, `${UserRole.SalesRep}`])
  async updateActivityHandler(
    @Body() body: UpdateActivityDTO,
    @Param('activityId') activityId: string,
    @Req() req: express.Request,
    @Res() res: express.Response,
  ) {
    const authUser: IAuthUser = req['authUser'];

    const results = await this._ActivityService.updateActivityService(
      body,
      activityId,
      authUser,
    );

    return res.status(200).json({
      success: true,
      message: 'Activity updated Successfully :',
      data: results,
    });
  }

  @Delete('delete/:activityId')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles([`${UserRole.Admin}`, `${UserRole.Manager}`, `${UserRole.SalesRep}`])
  async softDeleteActivityHandler(
    @Param('activityId') activityId: string,
    @Req() req: express.Request,
    @Res() res: express.Response,
  ) {
    const authUser: IAuthUser = req['authUser'];

    const results = await this._ActivityService.softDeleteActivityService(
      activityId,
      authUser,
    );

    return res.status(200).json({
      success: true,
      message: 'Activity Deleted Successfully :',
      data: results,
    });
  }

  @Patch('restore/:activityId')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles([`${UserRole.Admin}`, `${UserRole.Manager}`])
  async restoreDeletedActivityHandler(
    @Param('activityId') activityId: string,
    @Req() req: express.Request,
    @Res() res: express.Response,
  ) {
    const authUser: IAuthUser = req['authUser'];

    const results = await this._ActivityService.restoreDeletedActivityService(
      activityId,
      authUser,
    );

    return res.status(200).json({
      success: true,
      message: 'Activity updated Successfully :',
      data: results,
    });
  }
}
