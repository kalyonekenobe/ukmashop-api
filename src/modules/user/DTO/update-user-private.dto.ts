import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { UserRoles } from 'generated/prisma/enums';
import { UserEntity } from 'src/modules/user/entities/user.entity';

export class UpdateUserPrivateDto implements Partial<UserEntity> {
  @ApiProperty({
    description: 'User email address used for login and communication',
    format: 'email',
    example: 'updateduser@ukmashop.com',
    required: false,
  })
  @IsEmail()
  @IsOptional()
  email?: UserEntity['email'];

  @ApiProperty({
    description: 'User password (minimum 8 characters, at least 1 number)',
    example: 'NewStr0ngP@ss',
    required: false,
  })
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[0-9])(?=.*[A-Za-z]).*$/, {
    message: 'Password must contain at least one letter and one number',
  })
  @IsOptional()
  password?: UserEntity['password'];

  @ApiProperty({
    description: 'User first name',
    example: 'Jane',
    required: false,
  })
  @IsString()
  @IsOptional()
  firstName?: UserEntity['firstName'];

  @ApiProperty({
    description: 'User last name',
    example: 'Smith',
    required: false,
  })
  @IsString()
  @IsOptional()
  lastName?: UserEntity['lastName'];

  @ApiProperty({
    description: 'User phone number in international format (10–15 digits, optional + prefix)',
    example: '+12345678901',
    required: false,
  })
  @IsString()
  @Matches(/^\+?[0-9]{10,15}$/, {
    message: 'Phone number must contain 10–15 digits and may start with +',
  })
  @IsOptional()
  phone?: UserEntity['phone'];

  @ApiProperty({
    description: 'JWT refresh token for maintaining user session',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    required: false,
  })
  @IsString()
  @IsOptional()
  refreshToken?: UserEntity['refreshToken'];

  @ApiProperty({
    description: 'Role assigned to the user that determines access permissions',
    enum: UserRoles,
    example: UserRoles.User,
    required: false,
  })
  @IsEnum(UserRoles)
  @IsOptional()
  role?: UserEntity['role'];

  @ApiProperty({
    description: 'Indicates whether the user account is currently active',
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: UserEntity['isActive'];
}
