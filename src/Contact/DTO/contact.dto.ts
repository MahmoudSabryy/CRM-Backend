import { PartialType } from '@nestjs/mapped-types';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { Lead } from 'src/DB/Models/lead.model';

export class ConvertLeadToContactDTO {
  @IsString()
  @IsOptional()
  company?: string;

  @IsNotEmpty()
  lead: Lead;
}

export class CreateContactDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsPhoneNumber('EG')
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsOptional()
  company: string;
}

export class UpdateContactDTO extends PartialType(CreateContactDTO) {}
