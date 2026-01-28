import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { DealStatus, StageType } from 'src/Common/Types/Types';

export class GetAllUserDealsDTO {
  @IsUUID()
  @IsOptional()
  userId?: string;
}

export class CreateDealDTO {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsEnum(StageType)
  @IsNotEmpty()
  stage: StageType;

  @IsEnum(DealStatus)
  @IsOptional()
  status: DealStatus;

  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  expectedCloseDate: Date;

  @IsNumber()
  @IsNotEmpty()
  probability: number;
}

export class UpdateDealDTO {
  @IsString()
  @IsOptional()
  title?: string;

  @IsNumber()
  @IsOptional()
  amount?: number;

  @IsEnum(StageType)
  @IsOptional()
  stage?: StageType;

  @IsEnum(DealStatus)
  @IsOptional()
  status: DealStatus;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  expectedCloseDate?: Date;

  @IsNumber()
  @IsOptional()
  probability?: number;
}

export class CloseDealDTO {
  @IsEnum(StageType)
  stage: StageType;
}
