import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { LeadSource, LeadStatus } from 'src/Common/Types/Types';

export class CreateLeadDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsOptional()
  email: string;

  @IsPhoneNumber('EG')
  @IsNotEmpty()
  phone: string;

  @IsEnum(LeadSource)
  source: LeadSource;
}

export class UpdateLeadDTO {
  @IsString()
  @IsOptional()
  name: string;

  @IsEmail()
  @IsOptional()
  email: string;

  @IsPhoneNumber('EG')
  @IsOptional()
  phone: string;

  @IsEnum(LeadSource)
  @IsOptional()
  source: LeadSource;
}

export class assignLeadDTO {
  @IsString()
  @IsNotEmpty()
  owner: string;
}

export class updateLeadStatusDTO {
  @IsEnum(LeadStatus)
  @IsNotEmpty()
  status: LeadStatus;
}
