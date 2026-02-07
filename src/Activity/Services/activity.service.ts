import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IAuthUser, UserRole } from 'src/Common/Types/Types';
import { Activity } from 'src/DB/Models/activity.model';
import { Repository } from 'typeorm';
import { CreateActivityDTO, UpdateActivityDTO } from '../DTO/activity.dto';
import { LeadService } from 'src/Lead/Services/lead.service';
import { ContactService } from 'src/Contact/Services/contact.service';
import { DealService } from 'src/Deal/Services/deal.service';

@Injectable()
export class ActivityService {
  constructor(
    @InjectRepository(Activity)
    private readonly _ActivityRepo: Repository<Activity>,
    private readonly _LeadService: LeadService,
    private readonly _ContactService: ContactService,
    private readonly _DealService: DealService,
  ) {}

  async getAllUserActivitiesService(authUser: IAuthUser) {
    const activities = await this._ActivityRepo.find({
      where: { user: { id: authUser.id } },
    });

    return activities;
  }

  async getSingleActivityService(activityId: string, authUser: IAuthUser) {
    if (authUser.role === UserRole.SalesRep) {
      const activity = await this._ActivityRepo.findOne({
        where: { id: activityId, user: { id: authUser.id } },
      });

      if (!activity) throw new NotFoundException('Activity not found');

      return activity;
    } else {
      const activity = await this._ActivityRepo.findOne({
        where: { id: activityId },
        withDeleted: true,
      });

      if (!activity) throw new NotFoundException('Activity not found');

      return activity;
    }
  }

  async createLeadActivityService(
    body: CreateActivityDTO,
    leadId: string,
    authUser: IAuthUser,
  ) {
    const { type, note, activityDate } = body;

    const lead = await this._LeadService.getSingleLeadService(authUser, leadId);

    const activity = this._ActivityRepo.create({
      type,
      note,
      activityDate,
      lead,
      user: authUser as any,
    });

    return await this._ActivityRepo.save(activity);
  }

  async createContactActivityService(
    body: CreateActivityDTO,
    contactId: string,
    authUser: IAuthUser,
  ) {
    const { type, note, activityDate } = body;
    const contact = await this._ContactService.getSingleContactService(
      contactId,
      authUser,
    );
    const activity = this._ActivityRepo.create({
      type,
      note,
      activityDate,
      contact,
      user: authUser as any,
    });

    return await this._ActivityRepo.save(activity);
  }

  async createDealActivityService(
    body: CreateActivityDTO,
    dealId: string,
    authUser: IAuthUser,
  ) {
    const { type, note, activityDate } = body;

    const deal = await this._DealService.getSingleDealService(dealId, authUser);

    const activity = this._ActivityRepo.create({
      type,
      note,
      activityDate,
      deal,
      user: authUser as any,
    });

    return await this._ActivityRepo.save(activity);
  }

  async updateActivityService(
    body: UpdateActivityDTO,
    activityId: string,
    authUser: IAuthUser,
  ) {
    const { type, note, activityDate } = body;

    const activity = await this.getSingleActivityService(activityId, authUser);
    console.log(activity);

    if (type) {
      if (activity.type === type)
        throw new BadRequestException(
          "Can't update the type with the same type",
        );
      activity.type = type;
    }

    if (note) {
      if (note.toLowerCase() === activity.note.toLowerCase())
        throw new BadRequestException(
          "Can't update the note with the same note",
        );
      activity.note = note;
    }

    if (activityDate) {
      if (
        new Date(activityDate).getTime() ===
        new Date(activity.activityDate).getTime()
      )
        throw new BadRequestException(
          "Can't update the Date with the same Date",
        );

      activity.activityDate = activityDate;
    }

    return await this._ActivityRepo.save(activity);
  }

  async softDeleteActivityService(activityId: string, authUser: IAuthUser) {
    const activity = await this.getSingleActivityService(activityId, authUser);

    activity.deletedBy = authUser as any;
    await this._ActivityRepo.save(activity);
    await this._ActivityRepo.softDelete(activity.id);

    return activity;
  }

  async restoreDeletedActivityService(activityId: string, authUser: IAuthUser) {
    const activity = await this.getSingleActivityService(activityId, authUser);

    // await this._ActivityRepo.restore(activity.id);
    activity.deletedBy = null as any;
    activity.deletedAt = null as any;

    return await this._ActivityRepo.save(activity);
  }
}
