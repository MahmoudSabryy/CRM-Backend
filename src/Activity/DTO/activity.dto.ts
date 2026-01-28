import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ActivityType } from 'src/Common/Types/Types';

export class CreateActivityDTO {
  @IsEnum(ActivityType)
  @IsNotEmpty()
  type: ActivityType;

  @IsString()
  @IsOptional()
  note: string;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  activityDate: Date;
}

export class UpdateActivityDTO {
  @IsEnum(ActivityType)
  @IsOptional()
  type: ActivityType;

  @IsString()
  @IsOptional()
  note: string;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  activityDate: Date;
}
