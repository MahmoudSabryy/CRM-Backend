import {
  Body,
  Controller,
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
import { DealService } from '../Services/deal.service';
import { AuthGuard } from 'src/Common/Guards/Auth.Guard';
import { RoleGuard } from 'src/Common/Guards/Role.Guard';
import { Roles } from 'src/Common/Decorators/roles.decorator';
import { IAuthUser, UserRole } from 'src/Common/Types/Types';
import express from 'express';
import {
  CloseDealDTO,
  CreateDealDTO,
  GetAllUserDealsDTO,
  UpdateDealDTO,
} from '../DTO/deal.dto';

@Controller('deal')
export class DealController {
  constructor(private readonly _DealService: DealService) {}

  @Post('create/:contactId')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles([`${UserRole.Admin}`, `${UserRole.Manager}`, `${UserRole.SalesRep}`])
  async createDealHandler(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    body: CreateDealDTO,
    @Param('contactId') contactId: string,
    @Req() req: express.Request,
    @Res() res: express.Response,
  ) {
    const authUser: IAuthUser = req['authUser'];

    const results = await this._DealService.createDealService(
      body,
      contactId,
      authUser,
    );

    return res.status(201).json({
      success: true,
      message: 'Deal created successfully :',
      data: results,
    });
  }

  @Get()
  @UseGuards(AuthGuard, RoleGuard)
  @Roles([`${UserRole.Admin}`, `${UserRole.Manager}`, `${UserRole.SalesRep}`])
  async getAllUserDealsHandler(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    body: GetAllUserDealsDTO,
    @Req() req: express.Request,
    @Res() res: express.Response,
  ) {
    const authUser: IAuthUser = req['authUser'];

    const results = await this._DealService.getAllUserDealsService(
      authUser,
      body,
    );

    return res
      .status(200)
      .json({ success: true, message: 'All User Deals :', data: results });
  }

  @Get('single/:dealId')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles([`${UserRole.Admin}`, `${UserRole.Manager}`, `${UserRole.SalesRep}`])
  async getSingleDealHandler(
    @Param('dealId') dealId: string,
    @Req() req: express.Request,
    @Res() res: express.Response,
  ) {
    const authUser: IAuthUser = req['authUser'];

    const results = await this._DealService.getSingleDealService(
      dealId,
      authUser,
    );

    return res
      .status(200)
      .json({ success: true, message: 'User Deal :', data: results });
  }

  @Put('update/:dealId')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles([`${UserRole.Admin}`, `${UserRole.Manager}`, `${UserRole.SalesRep}`])
  async updateDealHandler(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    body: UpdateDealDTO,
    @Param('dealId') dealId: string,
    @Req() req: express.Request,
    @Res() res: express.Response,
  ) {
    const authUser: IAuthUser = req['authUser'];

    const results = await this._DealService.updateDealService(
      body,
      dealId,
      authUser,
    );

    return res.status(200).json({
      success: true,
      message: 'Deal updated successfully :',
      data: results,
    });
  }

  @Get('activity/:dealId')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles([`${UserRole.Admin}`, `${UserRole.Manager}`, `${UserRole.SalesRep}`])
  async getAllDealActivitiesHandler(
    @Param('dealId') dealId: string,
    @Req() req: express.Request,
    @Res() res: express.Response,
  ) {
    const authUser: IAuthUser = req['authUser'];

    const results = await this._DealService.getAllDealActivitiesService(
      dealId,
      authUser,
    );
    return res
      .status(200)
      .json({ success: true, message: 'All Deal Activities :', data: results });
  }

  @Patch('close/:dealId')
  async closeDealHandler(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    body: CloseDealDTO,
    @Param('dealId') dealId: string,
    @Req() req: express.Request,
    @Res() res: express.Response,
  ) {
    const authUser: IAuthUser = req['authUser'];

    const results = await this._DealService.closeDealService(
      body,
      dealId,
      authUser,
    );

    return res.status(200).json({
      success: true,
      message: 'Deal Closed Successfully :',
      data: results,
    });
  }
}
