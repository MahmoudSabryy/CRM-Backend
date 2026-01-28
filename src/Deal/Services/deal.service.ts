import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DealStatus,
  IAuthUser,
  StageType,
  UserRole,
} from 'src/Common/Types/Types';
import { Deal } from 'src/DB/Models/deal.model';
import { Repository } from 'typeorm';
import {
  CloseDealDTO,
  CreateDealDTO,
  GetAllUserDealsDTO,
  UpdateDealDTO,
} from '../DTO/deal.dto';
import { Contact } from 'src/DB/Models/contact.model';

@Injectable()
export class DealService {
  constructor(
    @InjectRepository(Deal) private readonly _DealRepo: Repository<Deal>,
    @InjectRepository(Contact)
    private readonly _ContactRepo: Repository<Contact>,
  ) {}

  async createDealService(
    body: CreateDealDTO,
    contactId: string,
    authUser: IAuthUser,
  ) {
    const { title, stage, amount, expectedCloseDate, probability, status } =
      body;
    const contact = await this._ContactRepo.findOne({
      relations: { owner: true },
      where: { id: contactId },
    });

    if (!contact) throw new NotFoundException('contact not found');

    const deal = this._DealRepo.create({
      title,
      stage,
      amount,
      expectedCloseDate: new Date(expectedCloseDate),
      probability,
      contact,
      status: status || DealStatus.Open,
      owner: contact.owner,
      createdBy: authUser as any,
    });

    return await this._DealRepo.save(deal);
  }

  async getAllUserDealsService(authUser: IAuthUser, body: GetAllUserDealsDTO) {
    const { userId } = body;

    if (authUser.role === UserRole.SalesRep) {
      const deals = await this._DealRepo.find({
        where: { owner: { id: authUser.id } },
      });
      return deals;
    } else {
      const deals = await this._DealRepo.find({
        where: { owner: { id: userId } },
      });
      return deals;
    }
  }

  async getSingleDealService(dealId: string, authUser: IAuthUser) {
    if (authUser.role === UserRole.SalesRep) {
      const deal = await this._DealRepo.findOne({
        where: { owner: { id: authUser.id }, id: dealId },
      });

      if (!deal) throw new NotFoundException('deal not found');
      return deal;
    } else {
      const deal = await this._DealRepo.findOne({
        where: { id: dealId },
      });

      if (!deal) throw new NotFoundException('deal not found');

      return deal;
    }
  }

  async updateDealService(
    body: UpdateDealDTO,
    dealId: string,
    authUser: IAuthUser,
  ) {
    const { title, amount, expectedCloseDate, probability, stage, status } =
      body;

    const deal = await this.getSingleDealService(dealId, authUser);

    if (deal.stage === StageType.Won || deal.stage === StageType.Lost) {
      throw new BadRequestException('Cannot update a closed deal');
    }

    if (title) {
      if (title.toLowerCase() === deal.title.toLowerCase())
        throw new BadRequestException(
          "Can't update the title with the same title",
        );

      deal.title = title;
    }

    if (amount !== undefined) {
      if (deal.amount === amount)
        throw new BadRequestException(
          "Can't update the amount with the same amount",
        );
      deal.amount = amount;
    }

    if (expectedCloseDate) {
      if (
        new Date(expectedCloseDate).getTime() ===
        new Date(deal.expectedCloseDate).getTime()
      )
        throw new BadRequestException(
          "Can't update the Date with the same Date",
        );

      deal.expectedCloseDate = expectedCloseDate;
    }

    if (probability !== undefined) {
      if (probability === deal.probability)
        throw new BadRequestException(
          "Can't update the probability with the same probability",
        );

      deal.probability = probability;
    }

    if (stage) {
      if (stage === deal.stage)
        throw new BadRequestException(
          "Can't update the Stage with the same Stage",
        );

      deal.stage = stage;

      if (stage === StageType.Won || stage === StageType.Lost)
        deal.status = DealStatus.Closed;
    }

    if (status) {
      if (deal.status === status)
        throw new BadRequestException(
          "Can't update the Status with the same Status",
        );
      if (
        status === DealStatus.Closed &&
        deal.stage !== StageType.Won &&
        deal.stage !== StageType.Lost
      ) {
        throw new BadRequestException(
          'Cannot close deal without stage Won or Lost',
        );
      }

      deal.status = status;
    }

    return await this._DealRepo.save(deal);
  }

  async getAllDealActivitiesService(dealId: string, authUser: IAuthUser) {
    if (authUser.role === UserRole.SalesRep) {
      const deal = await this._DealRepo.findOne({
        where: { id: dealId, owner: { id: authUser.id } },
        relations: { activities: true },
        select: { id: true, activities: true },
      });

      if (!deal) throw new NotFoundException('deal not found');

      return deal.activities;
    } else {
      const deal = await this._DealRepo.findOne({
        where: { id: dealId },
        relations: { activities: true },
        select: { id: true, activities: true },
      });

      if (!deal) throw new NotFoundException('deal not found');

      return deal.activities;
    }
  }

  async closeDealService(
    body: CloseDealDTO,
    dealId: string,
    authUser: IAuthUser,
  ) {
    const { stage } = body;

    if (![StageType.Won, StageType.Lost].includes(stage)) {
      throw new BadRequestException('Deal can only be closed as won or lost');
    }

    let deal;

    if (authUser.role === UserRole.SalesRep) {
      deal = await this._DealRepo.findOne({
        where: {
          id: dealId,
          owner: { id: authUser.id },
        },
        relations: { owner: true },
      });
    } else {
      deal = await this._DealRepo.findOne({
        where: { id: dealId },
        relations: { owner: true },
      });
    }

    if (!deal) throw new NotFoundException('deal not found');

    if (deal.dealStatus === DealStatus.Closed) {
      throw new BadRequestException('Deal already closed');
    }

    deal.stage = stage;
    deal.dealStatus = DealStatus.Closed;
    deal.closedAt = new Date();

    return this._DealRepo.save(deal);
  }
}
