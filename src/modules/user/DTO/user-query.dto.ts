import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatuses, UserRoles } from 'generated/prisma/client';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { FindAllUserOrdersQuery } from 'src/modules/user/types/user.types';

export class FindAllUsersQueryDto {
  @ApiPropertyOptional({
    description: 'Filter by user IDs',
    type: [String],
    example: ['550e8400-e29b-41d4-a716-446655440000'],
  })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  ids?: UserEntity['id'][];

  @ApiPropertyOptional({
    description: 'Filter by email addresses',
    type: [String],
    example: ['john@example.com', 'jane@example.com'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  emails?: UserEntity['email'][];

  @ApiPropertyOptional({
    description: 'Filter by first names',
    type: [String],
    example: ['John', 'Jane'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  firstNames?: UserEntity['firstName'][];

  @ApiPropertyOptional({
    description: 'Filter by last names',
    type: [String],
    example: ['Doe', 'Smith'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  lastNames?: UserEntity['lastName'][];

  @ApiPropertyOptional({
    description: 'Search for emails containing this string',
    example: 'gmail.com',
  })
  @IsOptional()
  @IsString()
  emailContains?: string;

  @ApiPropertyOptional({
    description: 'Search for first names containing this string',
    example: 'John',
  })
  @IsOptional()
  @IsString()
  firstNameContains?: string;

  @ApiPropertyOptional({
    description: 'Search for last names containing this string',
    example: 'Doe',
  })
  @IsOptional()
  @IsString()
  lastNameContains?: string;

  @ApiPropertyOptional({
    description: 'Search for phones containing this string',
    example: '+380',
  })
  @IsOptional()
  @IsString()
  phoneContains?: string;

  @ApiProperty({
    description: 'Sort order (field:direction)',
    example: 'createdAt:desc',
    default: 'createdAt:desc',
  })
  @IsString()
  orderBy: string = 'createdAt:desc';

  @ApiProperty({
    description: 'Page number',
    example: 1,
    default: 1,
    minimum: 1,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10,
    default: 10,
    minimum: 1,
    maximum: 100,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 10;
}

export class FindAllUsersPrivateQueryDto extends FindAllUsersQueryDto {
  @ApiPropertyOptional({
    description: 'Filter by user roles',
    enum: UserRoles,
    isArray: true,
    example: [UserRoles.User, UserRoles.Admin],
  })
  @IsOptional()
  @IsArray()
  @IsEnum(UserRoles, { each: true })
  roles?: UserEntity['role'][];
}

export class FindOneUserQueryDto {
  @ApiPropertyOptional({
    description: 'User ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  @IsOptional()
  @IsUUID()
  id?: UserEntity['id'];

  @ApiPropertyOptional({
    description: 'Search for email containing this string',
    example: 'gmail.com',
  })
  @IsOptional()
  @IsString()
  emailContains?: string;

  @ApiPropertyOptional({
    description: 'Search for first name containing this string',
    example: 'John',
  })
  @IsOptional()
  @IsString()
  firstNameContains?: string;

  @ApiPropertyOptional({
    description: 'Search for last name containing this string',
    example: 'Doe',
  })
  @IsOptional()
  @IsString()
  lastNameContains?: string;

  @ApiPropertyOptional({
    description: 'Search for phones containing this string',
    example: '+380',
  })
  @IsOptional()
  @IsString()
  phoneContains?: string;
}

export class FindOneUserPrivateQueryDto extends FindOneUserQueryDto {
  @ApiPropertyOptional({
    description: 'Filter by user role',
    enum: UserRoles,
    example: UserRoles.Admin,
  })
  @IsOptional()
  @IsEnum(UserRoles)
  role?: UserEntity['role'];
}

export class FindAllUserOrdersQueryDto implements FindAllUserOrdersQuery {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  ids?: string[];

  @IsOptional()
  @IsArray()
  @IsEnum(OrderStatuses, { each: true })
  statuses?: OrderStatuses[];

  @IsOptional()
  @IsString()
  shippingAddressContains?: string;

  @IsOptional()
  @IsString()
  billingAddressContains?: string;

  @IsOptional()
  @IsString()
  trackingNumberContains?: string;

  @IsOptional()
  @IsString()
  notesContains?: string;

  @IsOptional()
  @IsString()
  orderBy: string = 'createdAt';

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit: number = 10;
}
