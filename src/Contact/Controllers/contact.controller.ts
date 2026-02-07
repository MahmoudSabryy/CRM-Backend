import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ContactService } from '../Services/contact.service';
import { AuthGuard } from 'src/Common/Guards/Auth.Guard';
import { RoleGuard } from 'src/Common/Guards/Role.Guard';
import { Roles } from 'src/Common/Decorators/roles.decorator';
import { IAuthUser, UserRole } from 'src/Common/Types/Types';
import express from 'express';
import { CreateContactDTO, UpdateContactDTO } from '../DTO/contact.dto';
@Controller('contact')
export class ContactController {
  constructor(private readonly _ContactService: ContactService) {}

  @Post('create')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles([`${UserRole.Admin}`, `${UserRole.Manager}`, `${UserRole.SalesRep}`])
  async createContactHandler(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    body: CreateContactDTO,
    @Req() req: express.Request,
    @Res() res: express.Response,
  ) {
    const authUser: IAuthUser = req['authUser'];

    const results = await this._ContactService.createContactService(
      authUser,
      body,
    );

    return res.status(201).json({
      success: true,
      message: 'contact created successfully',
      data: results,
    });
  }

  @Post('convert/:leadId')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles([`${UserRole.Admin}`, `${UserRole.Manager}`, `${UserRole.SalesRep}`])
  async convertLeadTOContactHandler(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    body: CreateContactDTO,
    @Param('leadId') leadId: string,
    @Req() req: express.Request,
    @Res() res: express.Response,
  ) {
    const authUser: IAuthUser = req['authUser'];

    const results = await this._ContactService.convertLeadTOContactService(
      body,
      leadId,
      authUser,
    );

    return res.status(201).json({
      success: true,
      message: 'lead added to contact successfully',
      data: results,
    });
  }

  @Get('single/:contactId')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles([`${UserRole.Admin}`, `${UserRole.Manager}`, `${UserRole.SalesRep}`])
  async getSingleContactHandler(
    @Param('contactId') contactId: string,
    @Res() res: express.Response,
    @Req() req: express.Request,
  ) {
    const authUser: IAuthUser = req['authUser'];

    const results = await this._ContactService.getSingleContactService(
      contactId,
      authUser,
    );

    return res
      .status(200)
      .json({ success: true, message: 'your contact :', data: results });
  }

  @Get('all')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles([`${UserRole.Admin}`, `${UserRole.Manager}`, `${UserRole.SalesRep}`])
  async getAllContactsHandler(
    @Req() req: express.Request,
    @Res() res: express.Response,
  ) {
    const authUser: IAuthUser = req['authUser'];

    const results = await this._ContactService.getAllContactsService(authUser);

    return res
      .status(200)
      .json({ success: true, message: 'All contacts :', data: results });
  }

  @Put('update/:contactId')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles([`${UserRole.Admin}`, `${UserRole.Manager}`, `${UserRole.SalesRep}`])
  async updateContactHandler(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    body: UpdateContactDTO,
    @Param('contactId') contactId: string,
    @Req() req: express.Request,
    @Res() res: express.Response,
  ) {
    const authUser: IAuthUser = req['authUser'];
    const results = await this._ContactService.updateContactService(
      body,
      contactId,
      authUser,
    );

    return res.status(200).json({
      success: true,
      message: 'contact updated successfully ✅',
      data: results,
    });
  }

  @Get('deals/:contactId')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles([`${UserRole.Admin}`, `${UserRole.Manager}`, `${UserRole.SalesRep}`])
  async getAllContactDealsHandler(
    @Param('contactId') contactId: string,
    @Req() req: express.Request,
    @Res() res: express.Response,
  ) {
    const authUser: IAuthUser = req['authUser'];

    const results = await this._ContactService.getAllContactDealsService(
      contactId,
      authUser,
    );

    return res
      .status(200)
      .json({ success: true, message: 'All Contact Deals :', data: results });
  }

  @Delete('delete/:contactId')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles([`${UserRole.Admin}`, `${UserRole.Manager}`, `${UserRole.SalesRep}`])
  async softDeleteContactHandler(
    @Param('contactId') contactId: string,
    @Req() req: express.Request,
    @Res() res: express.Response,
  ) {
    const authUser: IAuthUser = req['authUser'];

    const results = await this._ContactService.softDeleteContactService(
      contactId,
      authUser,
    );

    return res.status(200).json({
      success: true,
      message: 'Contact Deleted Successfully :',
      data: results,
    });
  }
}
