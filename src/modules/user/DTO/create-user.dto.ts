import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { UserRoles } from 'generated/prisma/enums';

export class CreateUserDto {
  @ApiProperty({
    description: 'User email address',
    format: 'email',
    example: 'newuser@ukmashop.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User password (min 8 chars, at least 1 number)',
    format: 'password',
    example: 'Password123',
  })
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[0-9])(?=.*[A-Za-z]).*$/, {
    message: 'Password must contain at least one letter and one number',
  })
  password: string;

  @ApiProperty({ description: 'First name', example: 'John' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ description: 'Last name', example: 'Doe' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ description: 'Phone number', example: '+1234567890', required: false })
  @IsOptional()
  @IsString()
  @Matches(/^\+?[0-9]{10,15}$/)
  phone: string;

  @ApiProperty({
    description: 'User role (admin, user, manager). Only assignable by admin',
    enum: UserRoles,
    example: UserRoles.User,
    required: false,
  })
  @IsOptional()
  @IsEnum(UserRoles)
  role: UserRoles;
}
