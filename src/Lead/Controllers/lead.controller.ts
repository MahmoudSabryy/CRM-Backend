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
import { LeadService } from '../Services/lead.service';
import express from 'express';
import {
  assignLeadDTO,
  CreateLeadDTO,
  UpdateLeadDTO,
  updateLeadStatusDTO,
} from '../DTO/lead.dto';
import { AuthGuard } from 'src/Common/Guards/Auth.Guard';
import { IAuthUser, UserRole } from 'src/Common/Types/Types';
import { RoleGuard } from 'src/Common/Guards/Role.Guard';
import { Roles } from 'src/Common/Decorators/roles.decorator';

@Controller('lead')
export class LeadController {
  constructor(private readonly _LeadService: LeadService) {}

  @Post('create')
  @UseGuards(AuthGuard)
  async createLeadHandler(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    body: CreateLeadDTO,
    @Req() req: express.Request,
    @Res() res: express.Response,
  ) {
    const authUser: IAuthUser = req['authUser'];
    const results = await this._LeadService.createLeadService(body, authUser);

    return res.status(201).json({
      success: true,
      message: 'Lead added successfully',
      data: results,
    });
  }

  @Get()
  @UseGuards(AuthGuard, RoleGuard)
  @Roles([`${UserRole.Admin}`, `${UserRole.Manager}`, `${UserRole.SalesRep}`])
  async getAllLeadsHandler(
    @Req() req: express.Request,
    @Res() res: express.Response,
  ) {
    const authUser: IAuthUser = req['authUser'];

    const results = await this._LeadService.getAllLeadsService(authUser);

    return res.status(200).json({
      success: true,
      message: 'All Leads :',
      data: results,
    });
  }

  @Get('single/:leadId')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles([`${UserRole.Admin}`, `${UserRole.Manager}`, `${UserRole.SalesRep}`])
  async getSingleLeadHandler(
    @Param('leadId') leadId: string,
    @Req() req: express.Request,
    @Res() res: express.Response,
  ) {
    const authUser: IAuthUser = req['authUser'];

    const results = await this._LeadService.getSingleLeadService(
      authUser,
      leadId,
    );

    return res.status(200).json({
      success: true,
      message: 'your Lead :',
      data: results,
    });
  }

  @Put('update/:leadId')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles([`${UserRole.Admin}`, `${UserRole.Manager}`, `${UserRole.SalesRep}`])
  async updateLeadHandler(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    body: UpdateLeadDTO,
    @Param('leadId') leadId: string,
    @Req() req: express.Request,
    @Res() res: express.Response,
  ) {
    const authUser: IAuthUser = req['authUser'];

    const results = await this._LeadService.updateLeadService(
      authUser,
      leadId,
      body,
    );

    return res.status(200).json({
      success: true,
      message: 'Lead updated Successfully:',
      data: results,
    });
  }

  @Patch('assign/:leadId')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles([`${UserRole.Admin}`, `${UserRole.Manager}`])
  async assignLeadHandler(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    body: assignLeadDTO,
    @Param('leadId') leadId: string,
    @Req() req: express.Request,
    @Res() res: express.Response,
  ) {
    const authUser: IAuthUser = req['authUser'];

    const results = await this._LeadService.assignLeadService(
      body,
      leadId,
      authUser,
    );

    return res.status(200).json({
      sucess: true,
      message: 'lead assigned successfully',
      data: results,
    });
  }

  @Patch('status/:leadId')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles([`${UserRole.Admin}`, `${UserRole.Manager}`, `${UserRole.SalesRep}`])
  async updateStatusHandler(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    body: updateLeadStatusDTO,
    @Param('leadId') leadId: string,
    @Req() req: express.Request,
    @Res() res: express.Response,
  ) {
    const authUser: IAuthUser = req['authUser'];

    const results = await this._LeadService.updateStatusService(
      authUser,
      leadId,
      body,
    );

    return res.status(200).json({
      sucess: true,
      message: 'lead status updated successfully',
      data: results,
    });
  }

  @Delete('delete/:leadId')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles([`${UserRole.Admin}`, `${UserRole.Manager}`, `${UserRole.SalesRep}`])
  async softDeleteLeadHandler(
    @Param('leadId') leadId: string,
    @Req() req: express.Request,
    @Res() res: express.Response,
  ) {
    const authUser: IAuthUser = req['authUser'];

    const results = await this._LeadService.softDeleteLeadService(
      leadId,
      authUser,
    );

    return res.status(200).json({
      success: true,
      message: 'Lead Deleted Successfully :',
      data: results,
    });
  }
}
