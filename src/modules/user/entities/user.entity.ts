import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MinLength,
} from 'class-validator';
import { User } from 'generated/prisma/client';
import { UserRoles } from 'generated/prisma/enums';

export class UserEntity implements User {
  @ApiProperty({
    description: 'Unique identifier of the user (UUID v4)',
    format: 'uuid',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    description: 'User email address used for login and communication',
    format: 'email',
    example: 'user@ukmashop.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User password (minimum 8 characters, at least 1 number)',
    example: 'StrongP@ssw0rd',
  })
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[0-9])(?=.*[A-Za-z]).*$/, {
    message: 'Password must contain at least one letter and one number',
  })
  password: string;

  @ApiProperty({
    description: 'User first name',
    example: 'John',
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    description: 'User last name',
    example: 'Doe',
  })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    description: 'User phone number in international format (10–15 digits, optional + prefix)',
    example: '+1234567890',
  })
  @IsString()
  @IsOptional()
  @Matches(/^\+?[0-9]{10,15}$/, {
    message: 'Phone number must contain 10–15 digits and may start with +',
  })
  phone: string | null;

  @ApiProperty({
    description: 'JWT refresh token for maintaining user session',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    nullable: true,
    required: false,
  })
  @IsOptional()
  @IsString()
  refreshToken: string | null;

  @ApiProperty({
    description: 'Role assigned to the user that determines access permissions',
    enum: UserRoles,
    example: UserRoles.User,
  })
  @IsEnum(UserRoles)
  role: UserRoles;

  @ApiProperty({
    description: 'Indicates whether the user account is currently active',
    example: true,
  })
  @IsBoolean()
  isActive: boolean;

  @ApiProperty({
    description: 'Date and time when the user account was created (ISO 8601 format)',
    format: 'date-time',
    example: '2024-01-15T10:30:00Z',
  })
  @IsDateString()
  createdAt: Date;

  @ApiProperty({
    description: 'Date and time when the user account was last updated (ISO 8601 format)',
    format: 'date-time',
    example: '2024-01-20T14:45:00Z',
  })
  @IsDateString()
  updatedAt: Date;
}
