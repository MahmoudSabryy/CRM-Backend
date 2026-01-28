import { PartialType } from '@nestjs/mapped-types';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class ConvertLeadToContactDTO {
  @IsString()
  @IsOptional()
  company?: string;
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
