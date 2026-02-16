import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { UserEntity } from 'src/modules/user/entities/user.entity';

export class LoginDto {
  @ApiProperty({
    description: 'The email of the user',
    example: 'oleksandr.igumnov@gmail.com',
    format: 'email',
    required: true,
  })
  @MaxLength(50)
  @IsEmail()
  @IsNotEmpty()
  @IsDefined()
  email: UserEntity['email'];

  @ApiProperty({
    description: "User's password",
    example: 'Password123',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  password: UserEntity['password'];
}
